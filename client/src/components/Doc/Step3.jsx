import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Map } from "./../Map.jsx";

const Step3 = ({
  document,
  errors,
  handleChange,
  handleMapClick,
  setPosition,
  position,
  polygonCoordinates,
  validateCoordinates,
}) => (
  <Card className="mb-4">
    <Card.Body>
      <Col>
        <Row className="mb-3">
          <Form.Label>
            Select a point on the Map, if not selected, the entire municipality is considered
          </Form.Label>
          <Map
            handleMapClick={handleMapClick}
            setPosition={setPosition}
            latitude={position.lat}
            longitude={position.lng}
            polygonCoordinates={polygonCoordinates}
            validateCoordinates={validateCoordinates}
          />
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="latitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="text"
                name="lat"
                value={document.coordinates.lat || ""}
                onChange={handleChange}
                placeholder="e.g., 59.3293"
                isInvalid={!!errors.coordinates}
                className="input"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="longitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="text"
                name="long"
                value={document.coordinates.long || ""}
                onChange={handleChange}
                placeholder="e.g., 18.0686"
                isInvalid={!!errors.coordinates}
                className="input"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Messaggio di errore per l'intera riga */}
        {errors.coordinates && (
          <div className="invalid-feedback d-block text-center">{errors.coordinates}</div>
        )}
      </Col>
    </Card.Body>
  </Card>
);

export default Step3;
