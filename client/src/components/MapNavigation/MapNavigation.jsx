import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';

import '../../styles/MapNavigation.css';
import { MyPopup } from '../MyPopup';
import MyModal from './MyModal';
import MyFilterDropdown from './MyFilterDropdown';
import MyViewDropdown from './MyViewDropdown';
import KirunaMunicipality from '../MapUtils/KirunaMunicipality';
import RecenterButton from '../MapUtils/RecenterButton';
import API from '../../../API';
import { useMapEvents } from 'react-leaflet';

const PopupCloseHandler = ({ onClose }) => {
    const map = useMap();

    useEffect(() => {
        const handlePopupClose = () => {
            onClose();
        };

        map.on('popupclose', handlePopupClose);
        return () => {
            map.off('popupclose', handlePopupClose);
        };
    }, [map, onClose]);

    return null;
};


const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: () => {
            onMapClick();
        },
    });
    return null;
};


// Icon mapping based on document type
const iconMap = {
    Design: 'bi-file-earmark-text',
    Informative: 'bi-info-circle',
    Prescriptive: 'bi-arrow-right-square',
    Technical: 'bi-file-earmark-code',
    Agreement: 'bi-people-fill',
    Conflict: 'bi-x-circle',
    Consultation: 'bi-chat-dots',
    Action: 'bi-exclamation-triangle',
    Material: 'bi-file-earmark-binary',
};

// Function to create a custom divIcon with a specific icon inside
const createCustomIcon = (type) => {
    const iconClass = iconMap[type] || 'bi-file-earmark';
    return L.divIcon({
        html: `<div style="display: flex; align-items: center; justify-content: center; background: white; width: 25px; height: 25px; border-radius: 50%; border: 2px solid black;">
                    <i class="bi ${iconClass}" style="color: black; font-size: 12px;"></i>
               </div>`,
        className: '' // Clear default class
    });
};




function MapNavigation(props) {
    const initialPosition = [67.850, 20.217];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positionActual, setPositionActual] = useState(initialPosition);
    const [zoomLevel, setZoomLevel] = useState(11);
    const [selectedDoc, setSelectedDoc] = useState(null); // To manage the selected document for showing MyPopup
    const [renderNumber,setRenderNumeber] = useState(0);
    const [typeDoc,setTypeDoc] = useState([]);
    const [selectedType, setSelectedType] = useState('All'); // New state for selected type
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [highestPoint, setHighestPoint] = useState(null);

    
    //Handle views in the map
    const [mapView, setMapView] = useState("satellite");
    const mapStyles = {
        satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
        streets: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
        terrain: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        outdoor: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
    };

    //Get the highest point, used to understand where to place the popup. 
    useEffect(() => {
        if(!geoJsonData) return;
        const getHighestPoint = () => {
            if (!geoJsonData) return null;
        
            const multiPolygonCoordinates = geoJsonData.features[0].geometry.coordinates;
            const flattenedCoordinates = multiPolygonCoordinates
                .flatMap(polygon => polygon.flat());
            const highestPoint = flattenedCoordinates.reduce((highest, current) => {
                return current[1] > highest[1] ? current : highest; 
            });
            return [highestPoint[1], highestPoint[0]];
        };
        setHighestPoint(getHighestPoint());
    }, [geoJsonData]);

    useEffect(()=>{
        setLoading(true);
        const fetchTypes = async () =>{
            try{
                if(props.loggedIn){
                    const data = await API.getDocumentTypes();
                    setTypeDoc(data);
                }                 
            }
            catch(error){
                props.setError(error);
            }finally{
                setLoading(false)
            }
        }
        fetchTypes()
    }, [])    

    // Fetch data from the API
    useEffect(() => {
        setLoading(true);
        setSelectedDoc(null); // Clear the selected document whenever the filter changes
    
        const fetchData = async () => {
            try {
                const filters = selectedType === 'All' ? {} : { type: selectedType };
                const documents = await API.filterDocuments(filters);
                const updatedDocuments = documents.map(doc => {
                    if (!doc.coordinates || doc.coordinates.length === 0) {
                        return { ...doc, lat: null, long: null };
                    } else {
                        if (doc.coordinates.length > 1) {
                            // Function to find the highest point in a polygon, where the popup and the marker will be shown
                            const highestPoint = doc.coordinates.reduce((max, [lat, long]) => {
                                return lat > max.lat ? { lat, long } : max;
                            }, { lat: doc.coordinates[0][0], long: doc.coordinates[0][1] });
            
                            const area = doc.coordinates.map(([lat, long]) => [lat, long]);
            
                            return {
                                ...doc,
                                lat: highestPoint.lat,
                                long: highestPoint.long,
                                area
                            };
                        } else {
                            // Single coordinate
                            const { lat, long } = doc.coordinates;
                            return { 
                                ...doc, lat, long
                            };
                        }
                    }
                });
                setData(updatedDocuments);
            } catch (error) {
                props.setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedType]); // Fetch documents when selectedType changes
    // Filter documents without coordinates
    const noCoordDocuments = data.filter(doc => doc.lat == null && doc.long == null);
    // Filter documents with coordinates
    const coordDocuments = data.filter(doc => doc.lat != null && doc.long != null);
    

    
    const classNameEntireMunicipality = props.loggedIn ? 'myDropdownDocuments' : 'myDropdownFilter';
    
    
    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer center={positionActual} zoom={zoomLevel} style={{ height: '92vh', width: '100%' }}>
                
                {/* Add the tile layer based on the selected view */}
                <TileLayer url={mapStyles[mapView]}/>
                
                {/* Dropdown to change the map view */}
                <MyViewDropdown setMapView={setMapView} mapView={mapView} setSelectedDoc={setSelectedDoc}/>
                
                {/* Close the popup when the map is clicked */}
                <MapClickHandler onMapClick={() => setSelectedDoc(null)} />
                
                {/* Dropdown to filter documents by type */}
                <MyFilterDropdown loggedIn={props.loggedIn} typeDoc={typeDoc} selectedType={selectedType} setSelectedType={setSelectedType} setSelectedDoc={setSelectedDoc} />
                
                {/* Show documents without coordinates with a button that opens a modal */}
                <MyModal noCoordDocuments={noCoordDocuments} setSelectedDoc={setSelectedDoc} setRenderNumeber={setRenderNumeber} classNameEntireMunicipality={classNameEntireMunicipality} iconMap={iconMap} renderNumber={renderNumber}/>
                
                {/* Draw the entire municipality, as stated in the FAQ, it should be always be visible */}
                <KirunaMunicipality setGeoJsonData={setGeoJsonData} geoJsonData={geoJsonData} setHighestPoint={setHighestPoint} />
                {/*Draw the area associated with a document, if defined*/}
                {selectedDoc && selectedDoc.area && <Polygon positions={selectedDoc.area} color="red" />}

                {/* Draw clusters or icons depending on the zoom: also the exact same position is managed in this case */}
                <MarkerClusterGroup>
                    {coordDocuments.map((doc) => (
                        <Marker key={doc.id} position={[doc.lat, doc.long]} icon={createCustomIcon(doc.type)}
                            eventHandlers={{click: () => {setSelectedDoc(doc); setRenderNumeber(renderNumber+1);}
                        }}/>
                    ))}
                </MarkerClusterGroup>
                
                {/* If a document is selected, show MyPopup in a popup */}
                {/*Done in this way to avoid visual problems dued to continue re-rendering because of clustering */}
                {selectedDoc!==null && ((() => {
                        const pos = selectedDoc?.lat ? [selectedDoc.lat, selectedDoc.long] : highestPoint;
                        const myKey = selectedDoc.id+renderNumber;
                        return (
                            <Popup position={pos} maxWidth={800} key={myKey}  closeButton={true} autoClose={false}>
                                 <PopupCloseHandler onClose={() => setSelectedDoc(null)} />
                                <MyPopup doc={selectedDoc} setError={props.setError} loggedIn={props.loggedIn} className='popupProp' />
                            </Popup>
                        );
                    })()
                )}

                {/* Button to re-center the map */}
                <RecenterButton positionActual={positionActual} setPositionActual={setPositionActual} setZoomLevel={setZoomLevel} zoomLevel={zoomLevel} initialPosition={initialPosition}/>
            </MapContainer>}
        </>
    );
}

export default MapNavigation
