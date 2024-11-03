import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const kirunaCoordinates = [67.8558, 20.2253];

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Map({ handleMapClick }) {
  const [position, setPosition] = useState({ lat: null, lng: null });

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;

        setPosition({
          lat: newLat,
          lng: newLng,
        });

        // Chiamata alla funzione handleMapClick con i nuovi valori di latitudine e longitudine
        handleMapClick(newLat, newLng);
      },
    });
    return null;
  };

  const clearMarker = () => {
    setPosition({ lat: null, lng: null });
    handleMapClick('', ''); // Resetta anche nel componente padre
  };

  return (
    <div className='text-center'>
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
      <Button onClick={clearMarker} variant="primary" type="button" className="btn-save mt-2 text-center">
        Remove marker
      </Button>
    </div>
  );
}

export { Map };
