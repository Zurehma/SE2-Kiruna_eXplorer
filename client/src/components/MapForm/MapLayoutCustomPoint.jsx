import React from "react";
import { Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const MapClickHandler = ({ onPointSelected }) => {
  // Gestisce gli eventi di clic sulla mappa
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target;
      if (target.closest(".resize-button")) {
        return; // Ignora il clic se è avvenuto sul bottone o su un suo elemento figlio
      }
      const { lat, lng } = e.latlng;
      onPointSelected({ lat, lng }); // Passa il punto cliccato al componente padre
    },
  });

  return null;
};

const MapLayoutCustomPoint = ({ position, newPoint, validateCoordinates }) => {
  const handlePointSelected = (point) => {
    // Validazione delle coordinate
    const isValid = validateCoordinates({ type: "Point", coordinates: [point.lng, point.lat] });
    if (isValid) {
      // Passa direttamente il punto validato al metodo newPoint
      newPoint(point.lat, point.lng, "CustomPoint");
    }
  };

  return (
    <>
      {/* Gestore del clic sulla mappa */}
      <MapClickHandler onPointSelected={handlePointSelected} />

      {/* Marker del punto confermato */}
      {position && position.type === "Point" && <Marker position={[position.coordinates.lat, position.coordinates.long]} />}
    </>
  );
};

export default MapLayoutCustomPoint;
