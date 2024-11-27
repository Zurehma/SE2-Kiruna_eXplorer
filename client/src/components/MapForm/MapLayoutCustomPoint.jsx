import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import { Button } from "react-bootstrap";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const MapClickHandler = (props) => {
  const { newPosition } = props;

  useMapEvents({
    click: (e) => {
      const clickOnMap = e.originalEvent.target.className.startsWith("leaflet-container");

      if (clickOnMap) {
        newPosition(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

const MapLayoutCustomPoint = (props) => {
  const { newPosition } = props;

  return (
    <>
      <MapClickHandler newPosition={newPosition} />
    </>
  );
};

export default MapLayoutCustomPoint;
