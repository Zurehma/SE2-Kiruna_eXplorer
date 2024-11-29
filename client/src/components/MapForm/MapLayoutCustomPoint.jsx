import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import { Button, Form, FormGroup } from "react-bootstrap";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

const MapClickHandler = (props) => {
  const { newPoint } = props;

  useMapEvents({
    click: (e) => {
      const clickOnMap = e.originalEvent.target.className.startsWith("leaflet-container");

      if (clickOnMap) {
        newPoint(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

const MapLayoutCustomPoint = (props) => {
  const { newPoint } = props;

  return (
    <>
      <MapClickHandler newPoint={newPoint} />
      <Form>
        <Form.Group className="m-3">
          <Form.Text id="lat-input" />
          <Form.Text id="long-input" />
        </Form.Group>
      </Form>
    </>
  );
};

export default MapLayoutCustomPoint;
