import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { Button } from 'react-bootstrap';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RecenterMap = ({ position, zoom }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);

  return null;
};

const DrawingControl = ({ drawingMode, setDrawnShapes }) => {
  const map = useMapEvents({});

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        circlemarker: false,
        polyline: false,
        circle: false, 
        marker: true, 
        rectangle: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#6e6eff',
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    const handleDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      setDrawnShapes((prevShapes) => [...prevShapes, layer.toGeoJSON()]);
    };

    if (drawingMode) {
      map.addControl(drawControl);
      map.on(L.Draw.Event.CREATED, handleDrawCreated);
    } else {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
    }

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
    };
  }, [map, drawingMode, setDrawnShapes]);

  return null;
};

function Map() {
  const initialPosition = [67.850, 20.217];
  const [positionActual, setPositionActual] = useState(initialPosition);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null); // Posizione del marcatore

  const recenterMap = () => {
    setPositionActual(initialPosition);
    setZoomLevel(13);
  };

  const clearMarker = () => {
    setMarkerPosition(null); // Rimuovi la posizione del marcatore
    setDrawnShapes([]); // Rimuovi i disegni
  };

  const toggleDrawingMode = (e) => {
    e.stopPropagation(); // Prevenire il click della mappa
    setDrawingMode(!drawingMode);
  };

  const handleMarkerCreated = (lat, lng) => {
    setMarkerPosition({ lat, lng }); // Imposta la posizione del marcatore
  };

  return (
    <div className="text-center" style={{ position: 'relative' }}>
      <MapContainer center={positionActual} zoom={zoomLevel} style={{ height: '50vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <RecenterMap position={positionActual} zoom={zoomLevel} />
        
        <DrawingControl drawingMode={drawingMode} setDrawnShapes={setDrawnShapes} />

        {markerPosition && ( // Mostra il marcatore se presente
          <Marker position={markerPosition} icon={markerIcon} data-testid="map-marker">
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {/* Container per i bottoni */}
        <div style={{ position: 'absolute', top: '3%', left: '93%', zIndex: 1000 }}>
          {/* Bottone per ricentrare la mappa */}
          <button 
            onClick={recenterMap} 
            style={{
              background: 'white', 
              border: 'none', 
              width: '25px', 
              height: '25px', 
              borderRadius: '5px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '0',
            }}
          >
            <i className="bi bi-compass" style={{ fontSize: '20px' }}></i>
          </button>

          {/* Bottone per attivare la modalità disegno */}
          <button 
            onClick={toggleDrawingMode} 
            style={{
              background: drawingMode ? '#d9534f' : 'white',
              border: 'none',
              width: '25px',
              height: '25px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
              marginTop: '5px', // Imposta un piccolo margine
            }}
          >
            <i className="bi bi-pencil" style={{ fontSize: '20px', color: drawingMode ? 'white' : 'black' }}></i>
          </button>
        </div>
      </MapContainer>

      {/* Bottone per rimuovere il marcatore */}
      {markerPosition && ( // Mostra il bottone solo se il marcatore è presente
        <Button onClick={clearMarker} variant="primary" type="button" className="btn-save mt-2 text-center">
          Remove marker
        </Button>
      )}
    </div>
  );
}

export { Map };
