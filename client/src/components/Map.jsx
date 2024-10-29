import React, {useState} from 'react';

import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// Latitude and Longitude for Kiruna, Sweden
const kirunaCoordinates = [67.8558, 20.2253];

import L from 'leaflet';
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Map() {
    const [position, setPosition] = useState({ lat: null, lng: null });

    const MapClickHandler = () => {
        useMapEvents({
        click: (e) => {
            setPosition({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            });
        },
        });
        return null;
    };

    // Funzione per rimuovere il marker e resettare lo stato
    const clearMarker = () => {
        setPosition({ lat: null, lng: null });
    };

    return (
        <div>
        <h2 className='mb-4 mt-2'>Select a point on the map to indicate where the document comes from</h2>

        <MapContainer
            center={kirunaCoordinates}
            zoom={12}
            style={{ height: '50vh', width: '100%' }}
        >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />

            {/* Mostra il marker se le coordinate sono definite */}
            {position.lat && position.lng && (
            <Marker position={[position.lat, position.lng]} icon={markerIcon} data-testid="map-marker">
                <Popup>Selected Location</Popup>
            </Marker>
        
            )}
        </MapContainer>

        {/* Pulsante per rimuovere il marker */}
        <button onClick={clearMarker} style={{ marginTop: '10px', padding: '10px' }}>
            Remove Marker
        </button>
        </div>
    );
}

export {Map};