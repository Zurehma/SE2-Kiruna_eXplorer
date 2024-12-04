import React, { useEffect, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";
import { Container, Form, Row, Col, FloatingLabel } from "react-bootstrap";

const MapClickHandler = ({ onPointSelected }) => {
  // Gestisce gli eventi di clic sulla mappa
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target;

      if (target.closest(".leaflet-container") !== target) {
        return; // Ignora il clic se è avvenuto sul bottone o su un suo elemento figlio
      }

      const { lat, lng } = e.latlng;
      onPointSelected({ lat, lng }); // Passa il punto cliccato al componente padre
    },
  });

  return null;
};

const LatLngManualLayout = (props) => {
  const { position, newPoint, validateCoordinates } = props;
  const [formLat, setFormLat] = useState(position?.coordinates?.lat || undefined);
  const [formLong, setFormLong] = useState(position?.coordinates?.long || undefined);

  useEffect(() => {
    if (position.coordinates) {
      setFormLat(position.coordinates.lat);
      setFormLong(position.coordinates.long);
    } else {
      setFormLat("");
      setFormLong("");
    }
  }, [position.coordinates]);

  const handleFormChangeLat = (event) => {
    const inputLat = Number(event.target.value);
    const inputLong = Number(formLong);

    if (inputLat && inputLong) {
      newPoint({ lat: inputLat, lng: inputLong });
    }

    setFormLat(inputLat);
  };

  const handleFormChangeLong = (event) => {
    const inputLat = Number(formLat);
    const inputLong = Number(event.target.value);

    if (inputLat && inputLong) {
      newPoint({ lat: inputLat, lng: inputLong });
    }

    setFormLong(inputLong);
  };

  return (
    <Container fluid={true} className="manual-latlng-layout">
      <Row className="justify-content-evenly">
        <Col md={{ span: 6 }}>
          <Form.Group>
            <FloatingLabel label="Latitude">
              <Form.Control
                value={formLat}
                onChange={handleFormChangeLat}
                type="text"
                id="floating-lat"
                placeholder="Latitude"
                className="manual-latlng-form"
              />
            </FloatingLabel>
          </Form.Group>
        </Col>
        <Col md={{ span: 6 }}>
          <Form.Group>
            <FloatingLabel label="Longitude">
              <Form.Control
                value={formLong}
                onChange={handleFormChangeLong}
                type="text"
                id="floating-long"
                placeholder="Longitude"
                className="manual-latlng-form"
              />
            </FloatingLabel>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

const MapLayoutCustomPoint = ({ position, newPoint, validateCoordinates }) => {
  const handlePointSelected = (point) => {
    // Validazione delle coordinate
    const isValid = validateCoordinates(point.lat, point.lng);
    if (isValid) {
      // Passa direttamente il punto validato al metodo newPoint
      newPoint(point.lat, point.lng);
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
