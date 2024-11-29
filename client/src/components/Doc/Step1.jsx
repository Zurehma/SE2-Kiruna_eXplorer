import React from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";

const Step1 = ({
  document,
  errors,
  handleChange,
  stakeholders,
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
            className="input"
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
            <div className={!!errors.stakeholder ? "is-invalid" : ""}>
              <CreatableSelect
                isMulti
                options={stakeholders}
                value={selectedStakeholders}
                onChange={handleStake}
                onCreateOption={handleCreate}
                placeholder="Select or add stakeholders..."
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                classNamePrefix="react-select"
              />
            </div>
            {errors.stakeholder && (
              <div className="invalid-feedback d-block">{errors.stakeholder}</div>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* STAKEHOLDER */}
      {/* <Row className="mb-3">
        <Col className="mb-3" md={6}>
          <Form.Group controlId="stakeholder">
            <Form.Label>Stakeholders*</Form.Label>
            <Form.Select
              as="select"
              name="stakeholder"
              value={document.stakeholder || ""}
              onChange={handleSelectChange}
              className="input-multi"
              isInvalid={!!errors.stakeholder}
            >
              <option value="">Select a stakeholder</option>
              {currentStakeholders.map((stakeholder, index) => (
                <option key={index} value={stakeholder.name}>
                  {stakeholder.name}
                </option>
              ))}
              <option value="add_new">+ Add new stakeholder</option>
            </Form.Select>
            {errors.stakeholder && (
              <Form.Control.Feedback type="invalid">{errors.stakeholder}</Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        {isAddingNew && (
          <Col md={6}>
            <Form.Group controlId="newStakeholder">
              <Form.Label>New Stakeholder</Form.Label>
              <Form.Control
                type="text"
                name="newStakeholder"
                value={newStakeholder}
                onChange={handleNewStakeholderChange}
                onBlur={handleNewBlur} // Salva automaticamente al perdere il focus
                placeholder="Enter new stakeholder"
                className="input"
              />
            </Form.Group>
          </Col>
        )}
      </Row> */}

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
