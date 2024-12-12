import React from "react";
import { Card, Form, Row, Col } from "react-bootstrap";

const Step2 = ({ document, errors, handleChange, handleAddNew, scales, types }) => (
  <Card className="mb-4">
    <Card.Body>
      {/* SCALE */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="scale">
            <Form.Label>Scale*</Form.Label>
            <Form.Select
              name="scale"
              value={document.scale || ""}
              onChange={handleAddNew}
              className="input-multi"
              isInvalid={!!errors.scale}
            >
              <option value="">Select a scale</option>
              {scales.map((scale, index) => (
                <option key={index} value={scale}>
                  {scale}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.scale}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="nValue">
            <Form.Label>Value of n*</Form.Label>
            <Form.Control
              type="text"
              name="nValue"
              value={document.nValue || ""}
              onChange={handleChange}
              isInvalid={!!errors.nValue}
              placeholder="Enter n"
              className={`input-multi ${document.scale === "1:n" ? "" : "disabled-field"}`}
              disabled={document.scale !== "1:n"}
            />
            <Form.Control.Feedback type="invalid">{errors.nValue}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {/* TYPE */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="type">
            <Form.Label>Type*</Form.Label>
            <Form.Select
              name="type"
              value={document.type || ""}
              onChange={handleAddNew}
              className="input-multi"
              isInvalid={!!errors.type}
            >
              <option value="">Select a type</option>
              {types.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
              <option value="add_new_type">+ Add new type</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="newType">
            <Form.Label>New Type*</Form.Label>
            <Form.Control
              type="text"
              name="newType"
              value={document.newType || ""}
              onChange={handleChange}
              isInvalid={!!errors.newType}
              placeholder="Enter new type"
              className={`input-multi ${document.type === "add_new_type" ? "" : "disabled-field"}`}
              disabled={document.type !== "add_new_type"}
            />
            <Form.Control.Feedback type="invalid">{errors.newType}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {/* LANGUAGE & PAGES */}
      <Row className="mb-3">
        {/* LANGUAGE */}
        <Col md={6}>
          <Form.Group controlId="language">
            <Form.Label>Language*</Form.Label>
            <Form.Select
              name="language"
              value={document.language || ""}
              onChange={handleChange}
              className="input-multi"
              isInvalid={!!errors.language}
            >
              <option value="" disabled>
                Select language...
              </option>
              <option value="Swedish">Swedish (recommended)</option>
              <option value="English">English (recommended)</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Russian">Russian</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.language}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        {/* PAGES */}
        <Col md={6}>
          <Form.Group controlId="pages">
            <Form.Label>Pages</Form.Label>
            <Form.Control
              type="text"
              name="pages"
              value={document.pages || ""}
              onChange={handleChange}
              placeholder="e.g., 35 or 35-45"
              className="input-multi"
              isInvalid={!!errors.pages}
            />
            <Form.Control.Feedback type="invalid">{errors.pages}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {/* ISSUANCE DATE */}
      <Row className="mb-3">
        <Form.Group controlId="issuanceDate">
          <Form.Label>Issuance Date*</Form.Label>
          <Row>
            {/* Dropdown per l'anno */}
            <Col className="mb-3" md={4}>
              <Form.Select
                name="issuanceDateYear"
                as="select"
                className="input-multi"
                isInvalid={!!errors.issuanceDate}
                value={document.issuanceDate?.split("-")[0] || ""}
                onChange={(e) => {
                  const year = e.target.value || "";
                  handleChange({
                    target: {
                      name: "issuanceDate",
                      value: [
                        year,
                        document.issuanceDate?.split("-")[1] || "",
                        document.issuanceDate?.split("-")[2] || "",
                      ]
                        .filter(Boolean) // Rimuove valori vuoti
                        .join("-"), // Unisce con il separatore "-"
                    },
                  });

                  if (!year) {
                    handleChange({
                      target: { name: "issuanceDate", value: "" }, // Resetta l'intero campo se l'anno è vuoto
                    });
                  }
                }}
              >
                <option value="">Year</option>
                {[...Array(50)].map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            {/* Dropdown per il mese */}
            <Col className="mb-3" md={4}>
              <Form.Select
                as="select"
                name="issuanceDateMonth"
                className="input-multi"
                value={document.issuanceDate?.split("-")[1] || ""}
                onChange={(e) => {
                  const month = e.target.value || "";
                  handleChange({
                    target: {
                      name: "issuanceDate",
                      value: [
                        document.issuanceDate?.split("-")[0] || "",
                        month,
                        document.issuanceDate?.split("-")[2] || "",
                      ]
                        .filter(Boolean) // Rimuove valori vuoti
                        .join("-"),
                    },
                  });

                  if (!month) {
                    handleChange({
                      target: {
                        name: "issuanceDate",
                        value: [document.issuanceDate?.split("-")[0] || ""]
                          .filter(Boolean)
                          .join("-"), // Solo anno
                      },
                    });
                  }
                }}
                disabled={!document.issuanceDate?.split("-")[0]} // Disabilitato finché non viene scelto l'anno
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month.toString().padStart(2, "0")}>
                    {month.toString().padStart(2, "0")}
                  </option>
                ))}
              </Form.Select>
            </Col>
            {/* Dropdown per il giorno */}
            <Col className="mb-3" md={4}>
              <Form.Select
                as="select"
                name="issuanceDateDay"
                className="input-multi"
                value={document.issuanceDate?.split("-")[2] || ""}
                onChange={(e) => {
                  const day = e.target.value || "";
                  handleChange({
                    target: {
                      name: "issuanceDate",
                      value: [
                        document.issuanceDate?.split("-")[0] || "",
                        document.issuanceDate?.split("-")[1] || "",
                        day,
                      ]
                        .filter(Boolean) // Rimuove valori vuoti
                        .join("-"),
                    },
                  });
                }}
                disabled={!document.issuanceDate?.split("-")[1]} // Disabilitato finché non viene scelto il mese
              >
                <option value="">Day</option>
                {Array.from(
                  {
                    length:
                      document.issuanceDate?.split("-")[1] && document.issuanceDate?.split("-")[0]
                        ? new Date(
                            document.issuanceDate.split("-")[0],
                            document.issuanceDate.split("-")[1],
                            0
                          ).getDate()
                        : 31,
                  },
                  (_, i) => i + 1
                ).map((day) => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day.toString().padStart(2, "0")}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {errors.issuanceDate && (
            <div className="invalid-feedback d-block text-center">{errors.issuanceDate}</div>
          )}
        </Form.Group>
      </Row>
    </Card.Body>
  </Card>
);

export default Step2;
