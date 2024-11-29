import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Map } from "./../Map.jsx";
import MapForm from "../MapForm/MapForm.jsx";

const Step3 = ({ document, errors, handleChange, handleMapClick, setPosition, position, polygonCoordinates, validateCoordinates }) => (
  <Card className="mb-4">
    <Card.Body>
      <Col>
        <Row className="mb-3">
          <Form.Label>Select a point on the Map, if not selected, the entire municipality is considered</Form.Label>
          <MapForm position={position} setPosition={setPosition} />
        </Row>

        {/* Messaggio di errore per l'intera riga */}
        {errors.coordinates && <div className="invalid-feedback d-block text-center">{errors.coordinates}</div>}
      </Col>
    </Card.Body>
  </Card>
);

export default Step3;
