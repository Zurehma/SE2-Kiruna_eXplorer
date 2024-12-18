import React from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";

const Step1 = ({
  document,
  errors,
  handleChange,
  stakeholdersList,
  handleStake,
  selectedStakeholders,
  handleCreate,
}) => (
  <Card className="mb-4">
    <Card.Body>
      {/* TITLE */}
      <Row className="mb-3">
        <Form.Group controlId="title">
          <Form.Label>Title*</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={document.title}
            onChange={handleChange}
            placeholder="Enter document title"
            className="input-multi"
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* STAKEHOLDERS */}
      <Row className="mb-3">
        <Col className="mb-3">
          <Form.Group controlId="stakeholder">
            <Form.Label>Stakeholders*</Form.Label>
            <div className={!!errors.stakeholders ? "is-invalid" : ""}>
              <CreatableSelect
                isMulti
                options={stakeholdersList}
                value={selectedStakeholders}
                onChange={handleStake}
                onCreateOption={handleCreate}
                placeholder="Select or add stakeholders..."
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #006d77", // Bordo coerente con il campo Title
                    borderRadius: "5px", // Angoli arrotondati
                    fontSize: "16px", // Dimensione del testo
                    padding: "0.5rem", // Rimuove padding extra
                  }),
                }}
              />
            </div>
            {errors.stakeholders && (
              <div className="invalid-feedback d-block">{errors.stakeholders}</div>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* DESCRIPTION */}
      <Row className="mb-3">
        <Form.Group controlId="description" className="mb-4">
          <Form.Label>Description*</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            minLength={2}
            value={document.description || ""}
            onChange={handleChange}
            placeholder="Enter a brief description"
            className="input-textarea"
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Card.Body>
  </Card>
);

export default Step1;
