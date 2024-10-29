import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import '../styles/Documents.css';

function Documents() {
  const [document, setDocument] = useState({
    title: '',
    stakeholders: '',
    scale: '',
    issuanceDate: '',
    type: '',
    connections: '',
    language: '',
    pages: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Document saved:", document);
  };

  return (
    <div className="documents-background">
    <Container className="my-5">
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Save Document</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={document.title} 
                    onChange={handleChange} 
                    placeholder="Enter document title"
                    className="input" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="stakeholders">
                  <Form.Label>Stakeholders</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="stakeholders" 
                    value={document.stakeholders} 
                    onChange={handleChange} 
                    placeholder="e.g., Kiruna kommun/Residents"
                    className="input" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="scale">
                  <Form.Label>Scale</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="scale" 
                    value={document.scale} 
                    onChange={handleChange} 
                    placeholder="Text, Image, etc."
                    className="input" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="issuanceDate">
                  <Form.Label>Issuance Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="issuanceDate" 
                    value={document.issuanceDate} 
                    onChange={handleChange} 
                    placeholder="e.g., 2007"
                    className="input" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="type" 
                    value={document.type} 
                    onChange={handleChange} 
                    placeholder="e.g., Informative document"
                    className="input" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="connections">
                  <Form.Label>Connections</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="connections" 
                    value={document.connections} 
                    onChange={handleChange} 
                    placeholder="e.g., 3"
                    className="input" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="language" 
                    value={document.language} 
                    onChange={handleChange} 
                    placeholder="e.g., Swedish"
                    className="input" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="pages">
                  <Form.Label>Pages</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="pages" 
                    value={document.pages} 
                    onChange={handleChange} 
                    placeholder="Number of pages"
                    className="input" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="description" className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={5} 
                name="description" 
                value={document.description} 
                onChange={handleChange} 
                placeholder="Enter a brief description"
                className="input-textarea" 
            />
            </Form.Group>


            <div className="text-center">
              <Button variant="primary" type="submit">
                Save Document
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
}

export default Documents;
