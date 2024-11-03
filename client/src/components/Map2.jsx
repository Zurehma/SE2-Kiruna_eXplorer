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
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position); // Set the map view to the new position
    }, [map, position]); // Only run this effect when `position` changes

    return null;
}

function Map2(props) {
    const initialPosition = [67.850, 20.217]; // Initial position
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positionActual, setPositionActual] = useState(initialPosition); // State for current position

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

    // Function to recenter the map on Kiruna
    const recenterMap = () => {
        setPositionActual(initialPosition); // Update state to trigger rerender
    };

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer 
                center={positionActual} // Use the state variable for the center position
                zoom={13} 
                style={{ height: '91vh', width: '100%' }}
            >
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
                    attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {data.map((item) => {
                    const position = item.lat !== null && item.long !== null
                        ? [item.lat, item.long] 
                        : [initialPosition[0] + getRandomOffset()[0], initialPosition[1] + getRandomOffset()[1]];
                    return (
                        <Marker key={item.id} position={position} icon={icon}>
                            <Popup maxWidth={800}>
                                <MyPopup doc={item} />
                            </Popup>
                        </Marker>
                    );
                })}
                
                {/* Add the recenter map component */}
                <RecenterMap position={positionActual} />

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
