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

const MapLayoutCustomPoint = (props) => {
  const { newPosition, clearPosition } = props;

  return (
    <>
      <MapClickHandler newPosition={newPosition} />
      <ClearPositionButton clearPosition={clearPosition} />
    </>
  );
};

export default MapLayoutCustomPoint;
