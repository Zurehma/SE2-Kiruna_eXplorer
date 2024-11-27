import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from "react-leaflet";
import { Button } from "react-bootstrap";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const MapLayoutPredefinedArea = (props) => {
  const { newArea } = props;
  const [predefinedAreas, setPredefinedAreas] = useState(undefined);
  const [choosenArea, setChoosenArea] = useState(undefined);

  useEffect(() => {
    const fetchPredefinedAreas = async () => {
      const response = await fetch("/public/static/predefinedAreas.geojson");
      const data = await response.json();

      setPredefinedAreas(
        data.features.map((feature) => {
          feature.geometry.coordinates[0].map((c) => c.reverse());
          return { coordinates: feature.geometry.coordinates, name: feature.properties.id };
        })
      );
    };

    fetchPredefinedAreas();
  }, []);

  return (
    <>
      {predefinedAreas &&
        predefinedAreas.map((predefinedArea) => (
          <Polygon
            key={predefinedArea.name}
            positions={predefinedArea.coordinates}
            color="black"
            weight={3}
            fillColor={choosenArea === predefinedArea.name ? "lightblue" : "red"}
            eventHandlers={{
              click: () => {
                setChoosenArea(predefinedArea.name);
              },
            }}
          >
            <Popup>Name: {predefinedArea.name}</Popup>
          </Polygon>
        ))}
    </>
  );
};

export default MapLayoutPredefinedArea;
