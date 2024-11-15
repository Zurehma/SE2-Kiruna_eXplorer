import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

import '../App.css';
import { MyPopup } from './MyPopup';
import API from '../../API';
import { ShowDocuments } from './showDocuments';
import { Dropdown } from 'react-bootstrap';

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

// Custom icon for the "+" button
const plusIcon = L.divIcon({
    html: `<div style="display: flex; align-items: center; justify-content: center; background: white; width: 30px; height: 30px; border-radius: 50%; border: 2px solid black;">
                <i class="bi bi-plus" style="color: black; font-size: 20px;"></i>
           </div>`,
    className: '' // Clear default class
});

// Custom hook to recenter the map
const RecenterMap = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom); // Set the map view to the new position and zoom
    }, [map, position, zoom]);

    return null;
}

function Map2(props) {
    const initialPosition = [67.850, 20.217];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positionActual, setPositionActual] = useState(initialPosition);
    const [zoomLevel, setZoomLevel] = useState(11);
    const [selectedDoc, setSelectedDoc] = useState(null); // To manage the selected document for showing MyPopup
    const [renderNumber,setRenderNumeber] = useState(0);
    const [typeDoc,setTypeDoc] = useState([]);
    const [selectedType, setSelectedType] = useState('All'); // New state for selected type
    // Coordinate per il poligono (angoli specificati)
    const polygonCoordinates = [
        [67.87328157366065, 20.20047943270466],
        [67.84024426842895, 20.35839687019359],
        [67.82082254726043, 20.181254701184297]
    ];

    // Sposta il bottone "+" leggermente più su del vertice superiore del triangolo
    const plusButtonPosition = [67.8825492583, 20.2059690000253713];

    // Linea per collegare il bottone "+" al vertice superiore del poligono
    const lineCoordinates = [
        plusButtonPosition, // Coordinate del bottone "+"
        polygonCoordinates[0] // Coordinate del vertice superiore del triangolo
    ];

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
                if (props.loggedIn) {
                    const filters = selectedType === 'All' ? {} : { type: selectedType };
                    const documents = await API.filterDocuments(filters);
                    const updatedDocuments = documents.map(doc => {
                        if (!doc.coordinates) {
                            return { ...doc, lat: null, long: null };
                        } else {
                            const { lat, long } = doc.coordinates;
                            return { ...doc, lat, long };
                        }
                    });
                    setData(updatedDocuments);

                }
            } catch (error) {
                props.setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedType]); // Fetch documents when selectedType changes
    
    

    // Function to recenter the map on Kiruna with zoom reset to 13
    const recenterMap = () => {
        setPositionActual(initialPosition);
        setZoomLevel(11);
    };

    // Filter documents without coordinates
    const noCoordDocuments = data.filter(doc => doc.lat == null && doc.long == null);
    // Filter documents with coordinates
    const coordDocuments = data.filter(doc => doc.lat != null && doc.long != null);

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer 
                center={positionActual}
                zoom={zoomLevel} 
                style={{ height: '91vh', width: '100%' }}
            >
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
                    attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Polygon component for the area */}
                <Polygon 
                    positions={polygonCoordinates} 
                    pathOptions={{ color: 'blue', fillColor: 'none'}} 
                />
                <Polyline positions={lineCoordinates} pathOptions={{ color: 'blue' }} />
                
                {/* Marker for the "+" button at the top vertex */}
                <Marker position={plusButtonPosition} icon={plusIcon}>
                    <Popup className='popupPropPlus'>
                        <div>
                            <p>Entire municipality of Kiruna: </p>
                            {noCoordDocuments.length > 0 ? (
                                noCoordDocuments.map((item) => {
                                    const customIcon = createCustomIcon(item.type);
                                    return (
                                        <div 
                                            key={item.id} 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                margin: '5px',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '5px',
                                                border: '1px solid #ddd',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                            onClick={() => { setSelectedDoc(item); setRenderNumeber((renderNumber) => renderNumber + 1); }} // Set selected document on click
                                        >
                                            <div 
                                                style={{
                                                    marginRight: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <i 
                                                    className={`bi ${iconMap[item.type]}`} 
                                                    style={{ fontSize: '20px', color: '#555' }}
                                                /><p className=' ms-3 small'>{item.title}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No documents without coordinates available.</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
                {props.loggedIn && 
                    <Dropdown
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        zIndex: 1000,
                    }}
                    onSelect={(eventKey) => setSelectedType(eventKey)} // Use setSelectedType to set the filter
                >
                    <Dropdown.Toggle
                        variant="light"
                        id="dropdown-filter-button"
                        style={{
                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                            borderRadius: '8px', // Changed to make it rectangular
                            padding: '5px 15px', // Adjusted padding for rectangular look
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            color:'#006d77'
                        }}
                    >
                        <i className="bi bi-filter" style={{ fontSize: '20px', marginRight: '8px' }}></i>
                        Filter
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ backgroundColor: 'white' }}>
                        <Dropdown.Header>Filter by document type</Dropdown.Header>
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        {typeDoc.map((type, index) => (
                            <Dropdown.Item key={index} eventKey={type.name}>{type.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                }
                {/* Render coordinate documents as markers on the map */}
                {<ShowDocuments data={coordDocuments} createCustomIcon={createCustomIcon} setSelectedDoc={setSelectedDoc} setRenderNumeber={setRenderNumeber} renderNumber={renderNumber} />}

                {/* If a document is selected, show MyPopup in a popup */}
                {selectedDoc && (
                    (() => {
                        const pos = selectedDoc.lat ? [selectedDoc.lat, selectedDoc.long] : plusButtonPosition;
                        const myKey = selectedDoc.id+renderNumber;
                        return (
                            <Popup 
                                position={pos} 
                                maxWidth={800}
                                key={myKey}
                                onClose={() => setSelectedDoc(null)} // Clear selected document when popup is closed
                            >
                                <MyPopup doc={selectedDoc} setError={props.setError} loggedIn={props.loggedIn} className='popupProp' />
                            </Popup>
                        );
                    })()
                )}

                <RecenterMap position={positionActual} zoom={zoomLevel} />

                <button 
                    onClick={recenterMap} 
                    style={{
                        position: 'absolute', 
                        top: '15%', 
                        left: '0.8%', 
                        background: 'white', 
                        border: 'none', 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '5px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        zIndex: 1000, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0' 
                    }}
                >
                    <i className="bi bi-compass" style={{ fontSize: '20px' }}></i>
                </button>
            </MapContainer>}
        </>
    );
}

export { Map2 };
