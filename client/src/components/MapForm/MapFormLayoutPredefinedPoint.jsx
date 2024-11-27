import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import { Button } from "react-bootstrap";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

/**
 * Button component to remove the current marker
 * @param {*} clearPosition function to clear the position marker
 * @returns
 */
const ClearPositionButton = (props) => {
  const { clearPosition } = props;

  return (
    <>
      <Button variant="danger" size="sm" className="clear-position-button" onClick={(e) => clearPosition()}>
        Remove marker
      </Button>
    </>
  );
};

const MapLayoutPredefinedPoint = (props) => {
  const { newPosition, clearPosition } = props;

  const predefinedPositions = [
    {
      lat: 67.8558,
      long: 20.2253,
      name: "Kiruna Church",
    },
    {
      lat: 67.8663,
      long: 20.226,
      name: "Kiruna Town Hall",
    },
    {
      lat: 67.8475,
      long: 20.2083,
      name: "Icehotel",
    },
    {
      lat: 67.8466,
      long: 20.2258,
      name: "LKAB Mine",
    },
    {
      lat: 67.8392,
      long: 20.2263,
      name: "Esrange Space Center",
    },
    {
      lat: 67.8592,
      long: 20.2295,
      name: "Knut Liestams Fjällstation",
    },
  ];

  const [choosenPosition, setChoosenPosition] = useState(undefined);

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

  return (
    <>
      {predefinedPositions.map((predefinedPosition) => (
        <Marker
          key={predefinedPosition.name}
          position={[predefinedPosition.lat, predefinedPosition.long]}
          icon={choosenPosition === predefinedPosition.name ? blueMarkerIcon : redMarkerIcon}
          data-test-id={`map-marker-${predefinedPosition.name}`}
          eventHandlers={{
            click: () => {
              setChoosenPosition(predefinedPosition.name);
              newPosition(predefinedPosition.lat, predefinedPosition.long, predefinedPosition.name);
            },
          }}
        >
          <Popup>
            Name: {predefinedPosition.name}
            <br />
            Latitude: {predefinedPosition.lat}
            <br />
            Longitude: {predefinedPosition.long}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapLayoutPredefinedPoint;
