import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";
import L from "leaflet";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const MapFormLayoutCustomArea = (props) => {
  const { isFullscreen, position, newArea, validateCoordinates } = props;
  const map = useMap();
  const drawControlRef = useRef(null); // Ref per tracciare il controllo di disegno
  const drawnItemsRef = useRef(new L.FeatureGroup()); // Ref per il gruppo di layer
  
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    if (!drawControlRef.current && isFullscreen && position.coordinates == undefined) {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: false,
        },
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      // Evento: creazione di una nuova shape
      map.on(L.Draw.Event.CREATED, (event) => {
        if (drawnItems.getLayers().length > 0) {
          // Se c'è già un poligono, rimuovi il nuovo e mostra un messaggio
          event.layer.remove();
          alert("Only one polygon can be drawn at a time.");
          return;
        }

        const layer = event.layer;
        const geoJSON = layer.toGeoJSON();
        const coordinates = geoJSON.geometry.coordinates[0].map((c) =>
          c.reverse()
        );

        const invalidResult = coordinates
          .map(([lat, long]) => validateCoordinates(lat, long))
          .includes(false);

        if (invalidResult) {
          event.layer.remove(); // Rimuove il layer se i dati sono invalidi
          alert("Invalid polygon coordinates.");
          return;
        }

        drawnItems.addLayer(layer); // Aggiunge la nuova shape al gruppo
        newArea(coordinates); // Aggiorna le coordinate
      });

      // Evento: modifica di una shape esistente
      map.on(L.Draw.Event.EDITED, () => {
        const layers = drawnItems.getLayers();
        if (layers.length > 0) {
          const layer = layers[0]; // Supponendo che ci sia una sola shape
          const geoJSON = layer.toGeoJSON();
          const coordinates = geoJSON.geometry.coordinates[0].map((c) =>
            c.reverse()
          );
          const invalidResult = coordinates
            .map(([lat, long]) => validateCoordinates(lat, long))
            .includes(false);

          if (invalidResult) {
            alert("Invalid modification. Reverting to original shape.");
            return;
          }
          newArea(coordinates); // Aggiorna l'area con le nuove coordinate
        }
      });
    }

    return () => {
      // Pulizia
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED); // Rimuovi anche il listener di modifica
      map.removeLayer(drawnItems);
    };
  }, [isFullscreen, map]);

  return null;
};

export default MapFormLayoutCustomArea;
