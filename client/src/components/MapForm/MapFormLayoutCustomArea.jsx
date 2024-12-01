import React, { useEffect } from "react";
import { Marker, useMap, useMapEvents, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";
import L from "leaflet";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const MapFormLayoutCustomArea = (props) => {
  const { isFullscreen, position, newArea, validateCoordinates } = props;
  const map = useMap();

  useEffect(() => {
    let drawControl;

    if (isFullscreen && position.coordinates == undefined) {
      drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
        },
        edit: false,
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event) => {
        const geoJSON = event.layer.toGeoJSON();
        const coordinates = geoJSON.geometry.coordinates[0].map((c) => c.reverse());

        const invalidResult = coordinates.map(([lat, long]) => validateCoordinates(lat, long)).includes(false);

        if (invalidResult) {
          return null;
        }

        newArea(coordinates);
      });

      map.on(L.Draw.Event.DRAWVERTEX, (event) => {
        const layer = event.layers.getLayers()[0];
        const { lat, lng } = layer.getLatLng();

        if (!validateCoordinates(lat, lng)) {
          console.log("Invalid");
        }
      });
    }

    return () => {
      if (drawControl) {
        map.removeControl(drawControl);
        map.off(L.Draw.Event.CREATED);
        map.off(L.Draw.Event.DRAWVERTEX);
      }
    };
  }, [isFullscreen, map, position.coordinates]);

  return null;
};

export default MapFormLayoutCustomArea;
