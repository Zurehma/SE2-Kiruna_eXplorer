import React, { useState, useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const redMarkerIcon = new L.Icon({
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
});

const blueMarkerIcon = new L.Icon({
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
});

const MapLayoutPredefinedPoint = (props) => {
  const { position,newPoint } = props;
  const [predefinedPoints, setPredefinedPoints] = useState(undefined);
  const [choosenPosition, setChoosenPosition] = useState(position?.type==='Point' ? position.name : undefined);

  useEffect(() => {
    if (position?.type === "Point") {
      setChoosenPosition(position.name);
    }else{
      setChoosenPosition(undefined)
    }
  }, [position]);

  useEffect(() => {
    const fetchPredefinedPoints = async () => {
      const response = await fetch("/public/static/predefinedPoints.geojson");
      const data = await response.json();

      setPredefinedPoints(
        data.features.map((feature) => {
          return { lat: feature.geometry.coordinates[1], long: feature.geometry.coordinates[0], name: feature.properties.name };
        })
      );
    };

    fetchPredefinedPoints();
  }, []);
  
  return (
    <>
      {predefinedPoints &&
        predefinedPoints.map((predefinedPoint) => (
          <Marker
            key={`${predefinedPoint.name}-${choosenPosition}`}
            position={[predefinedPoint.lat, predefinedPoint.long]}
            icon={choosenPosition === predefinedPoint.name ? blueMarkerIcon : redMarkerIcon}
            data-test-id={`map-marker-${predefinedPoint.name}`}
            eventHandlers={{
              click: () => {
                setChoosenPosition(predefinedPoint.name);
                newPoint(predefinedPoint.lat, predefinedPoint.long, predefinedPoint.name);
              },
            }}
          >
            <Popup>
              Name: {predefinedPoint.name}
              <br />
              Latitude: {predefinedPoint.lat}
              <br />
              Longitude: {predefinedPoint.long}
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default MapLayoutPredefinedPoint;
