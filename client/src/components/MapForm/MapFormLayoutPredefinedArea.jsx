import React, { useState, useEffect } from "react";
import { Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const MapLayoutPredefinedArea = (props) => {
  const { newArea } = props;
  const [predefinedAreas, setPredefinedAreas] = useState(undefined);
  const [choosenArea, setChoosenArea] = useState(undefined);

  useEffect(() => {
    const fetchPredefinedAreas = async () => {
      const response = await fetch("/static/predefinedAreas.geojson");
      const data = await response.json();

      setPredefinedAreas(
        data.features.map((feature) => {
          let coordinates;

          if (feature.geometry.type === "Polygon") {
            coordinates = feature.geometry.coordinates[0].map((c) => [...c].reverse());
          } else if (feature.geometry.type === "MultiPolygon") {
            coordinates = feature.geometry.coordinates.map((p) => p[0].map((c) => [...c].reverse()));
          }
          return { featureType: feature.geometry.type, coordinates: coordinates, name: feature.properties.id };
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
            key={`${predefinedArea.name}-${choosenArea === predefinedArea.name}`}
            positions={predefinedArea.coordinates}
            color="black"
            weight={3}
            fillColor={choosenArea === predefinedArea.name ? "blue" : "red"}
            eventHandlers={{
              click: () => {
                setChoosenArea(predefinedArea.name);
                newArea(predefinedArea.coordinates, predefinedArea.name);
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
