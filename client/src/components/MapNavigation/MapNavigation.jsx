import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import { Tooltip } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';

import '../../styles/MapNavigation.css';
import { MyPopup } from '../MyPopup';
import MyModal from './MyModal';
import MyFilterDropdown from './MyFilterDropdown';
import MyViewDropdown from './MyViewDropdown';
import KirunaMunicipality from '../MapUtils/KirunaMunicipality';
import RecenterButton from '../MapUtils/RecenterButton';
import API from '../../../API';
import LoadGeoJson from '../MapUtils/LoadGeoJson';
import {createCustomIcon,iconMap} from '../MapUtils/CustomIcon';
import fetchData from '../MapUtils/DataFetching';
import { useLocation } from 'react-router-dom';

const closeIcon = L.divIcon({
    className: 'custom-close-icon', // Classe personalizzata per evitare gli stili di default di Leaflet
    html: `
        <div class="icon-container" style="position: relative; width: 20px; height: 20px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
                <path d="M2.293 2.293a1 1 0 0 1 1.414 0L8 6.586l4.293-4.293a1 1 0 0 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 0-1.414z"/>
            </svg>
            <span class="tooltip-text" style="visibility: hidden; width: auto; background-color: black; color: white; text-align: center; border-radius: 6px; padding: 5px 0; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -50px;">Close area</span>
        </div>
    `,
    iconSize: [10, 10],
    iconAnchor: [15, 15] 
});

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

function MapNavigation(props) {
    const initialPosition = [67.850, 20.217];
    const location = useLocation();
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
    const [reload,setReload] = useState(false);
    //states to handle KX11
    const [selectedAreas, setSelectedAreas] = useState([]);
    //Add a new area when a marker is clicked, if it exists
    const handleMarkerClick = (doc) => {
        const areaExists = selectedAreas.some(area => area.docId === doc.id);
        if (!areaExists) {
            const lowestPoint = doc.area.reduce((lowest, coord) => coord[0] < lowest[0] ? coord : lowest);
            setSelectedAreas(prevAreas => [...prevAreas, { docId: doc.id, area: doc.area, lowestPoint }]);
        }
    };

    //Remove an area when the toggle is clicked
    const handleCloseClick = (docId) => {
        setSelectedAreas(selectedAreas.filter(area => area.docId !== docId));
    };

    //extract documentID from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const docId = parseInt(searchParams.get('id'));
        if (docId) {
            setSelectedDoc(data.find(doc => doc.id === docId));
            const doc = data.find(doc => doc.id === docId);
            // If the document has an area, add it to selectedAreas
            if (doc?.area) {
                handleMarkerClick(doc);
            }
        }
    },[location.search,data]);


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
        fetchData(selectedType,setData,props.setError,setLoading);
    }, [selectedType,reload]); // Fetch documents when selectedType changes
    // Filter documents without coordinates
    const noCoordDocuments = data.filter(doc => doc.lat == null && doc.long == null);
    // Filter documents with coordinates
    const coordDocuments = data.filter(doc => doc.lat != null && doc.long != null);
    const classNameEntireMunicipality = props.loggedIn ? 'myDropdownDocuments' : 'myDropdownFilter';

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer center={positionActual} zoom={zoomLevel} style={{ height: '91vh', width: '100%' }}>
                
                {/* Add the tile layer based on the selected view */}
                <TileLayer url={mapStyles[mapView]}/>
                
                {/* Dropdown to change the map view */}
                <MyViewDropdown setMapView={setMapView} mapView={mapView} setSelectedDoc={setSelectedDoc}/>
                
                {/* Close the popup when the map is clicked */}
                <MapClickHandler onMapClick={() => setSelectedDoc(null)} />
                
                {/* Dropdown to filter documents by type */}
                <MyFilterDropdown loggedIn={props.loggedIn} typeDoc={typeDoc} selectedType={selectedType} setSelectedType={setSelectedType}  />
                
                {/* Show documents without coordinates with a button that opens a modal */}
                <MyModal noCoordDocuments={noCoordDocuments} setSelectedDoc={setSelectedDoc} setRenderNumeber={setRenderNumeber} classNameEntireMunicipality={classNameEntireMunicipality} iconMap={iconMap} renderNumber={renderNumber}/>
                {/* Draw the entire municipality, as stated in the FAQ, it should be always be visible */}
                <LoadGeoJson setGeoJsonData={setGeoJsonData} geoJsonData={geoJsonData} />
                {geoJsonData && <KirunaMunicipality  geoJsonData={geoJsonData} />}
                {/*Draw the area associated with a document, if defined*/}
                {selectedAreas.map(area => (
                    <>
                        <Polygon key={area.docId} positions={area.area} color="red"/>
                        <Marker key={`close-${area.docId}`} position={area.lowestPoint} icon={closeIcon}
                            eventHandlers={{
                                click: () => handleCloseClick(area.docId)
                            }}
                        />
                    </>
                ))}

                {/* Draw clusters or icons depending on the zoom: also the exact same position is managed in this case */}
                <MarkerClusterGroup>
                    {coordDocuments.map((doc) => (
                        <Marker key={`${doc.id}-${doc.title}`} position={[doc.lat, doc.long]} 
                            icon={doc.id === selectedDoc?.id ? createCustomIcon(doc.type, true) : createCustomIcon(doc.type, false)}
                            eventHandlers={{click: () => {setSelectedDoc(doc); setRenderNumeber(renderNumber+1); if(doc.area){handleMarkerClick(doc);}}
                        }}>
                            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                                {doc.title} 
                            </Tooltip>
                        </Marker>
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
                                <MyPopup doc={selectedDoc} setError={props.setError} loggedIn={props.loggedIn} className='popupProp' reload={reload} setReload={setReload}/>
                            </Popup>
                        );
                    })()
                )}

                {/* Button to re-center the map */}
                <RecenterButton positionActual={positionActual} setPositionActual={setPositionActual} setZoomLevel={setZoomLevel} zoomLevel={zoomLevel} initialPosition={initialPosition} draw={false}/>
            </MapContainer>}
        </>
    );
}

export default MapNavigation
