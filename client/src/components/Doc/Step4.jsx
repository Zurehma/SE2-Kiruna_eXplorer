import React from "react";
import { Card, Form, Button } from "react-bootstrap";

const Step4 = ({
  handleFileChange,
  files,
  removeFile,
  existingAttachments,
  removeExistingFile,
}) => (
  <Card className="mb-4">
    <Card.Body>
      <Form.Group controlId="fileUpload">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} className="file-input" />
        <div className="file-preview mt-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="file-item d-flex justify-content-between align-items-center mb-3 ms-2"
            >
              <span>{file.name}</span>
              <Button variant="danger" size="sm" onClick={() => removeFile(index)} className="me-2">
                <i className="bi bi-trash-fill"></i>
              </Button>
            </div>
          ))}
          {existingAttachments.map((file) => (
            <div
              key={file.id + file.docID}
              className="file-item d-flex justify-content-between align-items-center mb-3 ms-2"
            >
              <span>{file.name}</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeExistingFile(file.id)}
                className="me-2"
              >
                <i className="bi bi-trash-fill"></i>
              </Button>
            </div>
          ))}
        </div>
      </Form.Group>
    </Card.Body>
  </Card>
);

export default Step4;
