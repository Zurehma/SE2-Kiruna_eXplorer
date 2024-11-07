import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';

import '../App.css';
import { MyPopup } from './MyPopup';
import API from '../../API';

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
        html: `<div style="display: flex; align-items: center; justify-content: center; background: white; width: 30px; height: 30px; border-radius: 50%; border: 2px solid black;">
                    <i class="bi ${iconClass}" style="color: black; font-size: 16px;"></i>
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

    // Coordinate per il poligono (angoli specificati)
    const polygonCoordinates = [
        [67.87328157366065, 20.20047943270466],
        [67.84024426842895, 20.35839687019359],
        [67.82082254726043, 20.181254701184297]
    ];

    // Coordinate per il bottone "+"
    const plusButtonPosition = [67.87328157366065, 20.20047943270466];

    // Fetch data from the API
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const documents = await API.getDocuments();
                setData(documents);
            } catch (error) {
                props.setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); 

    // Function to recenter the map on Kiruna with zoom reset to 13
    const recenterMap = () => {
        setPositionActual(initialPosition);
        setZoomLevel(13);
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
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }} 
                />

                {/* Marker for the "+" button at the top vertex */}
                <Marker position={plusButtonPosition} icon={plusIcon}>
                    <Popup>
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
                                            onClick={() => setSelectedDoc(item)} // Set selected document on click
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
                                                />
                                            </div>
                                            <div>
                                                <p>{item.name}</p>
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

                {/* Render coordinate documents as markers on the map */}
                {coordDocuments.map((item) => {
                    const position = [item.lat, item.long];
                    const customIcon = createCustomIcon(item.type);
                    return (
                        <Marker key={item.id} position={position} icon={customIcon}>
                            <Popup maxWidth={800} className='popupProp'>
                                <MyPopup doc={item} />
                            </Popup>
                        </Marker>
                    );
                })}

                {/* If a document is selected, show MyPopup in a popup */}
                {selectedDoc && (
                    <Popup className='popupProp'
                        position={plusButtonPosition} 
                        maxWidth={800}
                        onClose={() => setSelectedDoc(null)} // Clear selected document when popup is closed
                    >
                        <MyPopup doc={selectedDoc} />
                    </Popup>
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
