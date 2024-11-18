import React, { useState,useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap,Polygon } from 'react-leaflet';
import L from 'leaflet';

// Removed unused kirunaCoordinates variable

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RecenterMap = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
      map.setView(position, zoom); // Set the map view to the new position and zoom
  }, [map, position, zoom]); // Run this effect when either `position` or `zoom` changes

  return null;
}

function Map({ handleMapClick,setPosition,latitude,longitude,polygonCoordinates,validateCoordinates }) {
  const initialPosition = [67.850, 20.217]; // Initial position
  const [positionActual, setPositionActual] = useState(initialPosition); // State for current position
  const [zoomLevel, setZoomLevel] = useState(12); // State for zoom level
  

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        if(validateCoordinates(newLat,newLng)){
          setPosition({
            lat: newLat,
            lng: newLng,
          });
          // Chiamata alla funzione handleMapClick con i nuovi valori di latitudine e longitudine
          handleMapClick(newLat, newLng);
        }
      },
    });
    return null;
  };
  const recenterMap = () => {
    setPositionActual(initialPosition); // Update state to trigger rerender
    setZoomLevel(13); // Reset zoom level to 13
  };

  const clearMarker = () => {
    setPosition({ lat: null, lng: null });
    handleMapClick('', ''); // Resetta anche nel componente padre
  };

  return (
    <div className='text-center'>
      <MapContainer
        center={positionActual}
        zoom={zoomLevel}
        data-testid="map"
        style={{ height: '50vh', width: '100%' }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
          attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <Polygon 
                    positions={polygonCoordinates} 
                    pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }} 
        />
        {/* Mostra il marker se le coordinate sono definite */}
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={markerIcon} data-testid="map-marker">
            <Popup>Selected Location</Popup>
          </Marker>
        )}
        <RecenterMap position={positionActual} zoom={zoomLevel} />
        <button 
          onClick={recenterMap} 
          style={{
          position: 'absolute', 
          top: '25%', 
          left: '2%', 
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
      </MapContainer>

      {/* Pulsante per rimuovere il marker */}
      {latitude && longitude && 
      <Button onClick={clearMarker} variant="primary" type="button" className="btn-save mt-2 text-center">
        Remove marker
      </Button>}
    </div>
  );
}

export { Map };