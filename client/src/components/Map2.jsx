import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import '../App.css';
import { MyPopup } from './MyPopup';
import API from '../../API';

// Custom icon for markers
const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Function to get random offsets for placeholder markers
function getRandomOffset() {
    const offset = 0.002; // Adjusted for visible spread
    return [
        (Math.random() - 0.5) * offset, 
        (Math.random() - 0.5) * offset
    ];
}

// Custom hook to recenter the map
const RecenterMap = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom); // Set the map view to the new position and zoom
    }, [map, position, zoom]); // Run this effect when either `position` or `zoom` changes

    return null;
}

function Map2(props) {
    const cornerPosition = [67.840, 20.207]; // Corner position
    const initialPosition = [67.850, 20.217]; // Initial position
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positionActual, setPositionActual] = useState(initialPosition); // State for current position
    const [zoomLevel, setZoomLevel] = useState(13); // State for zoom level

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
        setPositionActual(initialPosition); // Update state to trigger rerender
        setZoomLevel(13); // Reset zoom level to 13
    };

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer 
                center={positionActual} // Use the state variable for the center position
                zoom={zoomLevel} 
                style={{ height: '91vh', width: '100%' }}
            >
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
                    attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {data.map((item) => {
                    // Verifica se lat e long sono null; se sì, genera una posizione casuale
                    const position = (item.lat != null && item.long != null)
                        ? [item.lat, item.long]
                        : [
                            cornerPosition[0] + getRandomOffset()[0],
                            cornerPosition[1] + getRandomOffset()[1]
                        ];
                    if(item.lat===null){
                        console.log("Latitudine nulla");
                    }
                    return (
                        <Marker key={item.id} position={position} icon={icon}>
                            <Popup maxWidth={800}>
                                <MyPopup doc={item} />
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Add the recenter map component */}
                <RecenterMap position={positionActual} zoom={zoomLevel} />

                <button 
                    onClick={recenterMap} 
                    style={{
                        position: 'absolute', 
                        top: '15%', 
                        left: '0.8%', 
                        background: 'white', 
                        border: 'none', 
                        width: '35px', // Larghezza ridotta
                        height: '40px', // Altezza fissa
                        borderRadius: '5px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        zIndex: 1000, // Assicurati che il bottone sia sopra altri elementi
                        display: 'flex', // Abilita flexbox
                        alignItems: 'center', // Centra verticalmente
                        justifyContent: 'center', // Centra orizzontalmente
                        padding: '0' // Rimuovi il padding
                    }}
                    >
                    <i className="bi bi-compass" style={{ fontSize: '20px' }}></i>
                </button>
            </MapContainer>}
        </>
    );
}

export { Map2 };
