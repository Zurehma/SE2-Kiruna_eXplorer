import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import '../styles/Documents.css';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import Document from '../document.mjs';

function Documents() { 
  // const [types, setTypes] = useState([]);
  // const [scale, setScale] = useState([]);
  const [scale, setScale] = useState([
    { id: 'text', name: 'Text' },
    { id: 'blueprints/effects', name: 'Blueprints/Effects' },
    { id: '1:n', name: 'Ratio 1:n' }
  ]);
  
  const [types, setTypes] = useState([
    { id: 'informative', name: 'Informative' }
  ]);
  const [error, setError] = useState(null); 
  const [showNField, setShowNField] = useState(false);
  const [nValue, setNValue] = useState('');
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    title: '',
    stakeholders: '',
    scale: '',
    issuanceDate: '',
    type: '',
    connections: '',
    language: '',
    pages: '',
    latitude:'',
    longitude: '',
    description: ''
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await API.getTypeDocuments();
        setTypes(response.data);
        const response2 = await API.getTypeScale();
        setScale(response2.data);
        setScale('Text', 'blueprints/effects', 'Ratio 1:n' );
        setTypes('Informative');
     } catch (error) {
        console.error("Errore nel recupero dei tipi di documenti:", error);
      }
    };
    fetchTypes();
  }, []);

  const validateDate = (date) => {
    const validFormats = [
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{2}\/\d{4}$/,       // MM/YYYY
      /^\d{4}$/               // YYYY
    ];
    return validFormats.some((regex) => regex.test(date));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    handleChange(e);

    if (validateDate(value) || value === "") {
      setError(""); // Rimuove l'errore se il formato è valido
    } else {
      setError("Invalid date. Use DD/MM/YYYY, MM/YYYY or YYYY.");
    }
  };

  const handleScaleChange = (e) => {
    const { value } = e.target;
    handleChange(e);

    // Mostra il campo n solo se la scala selezionata è '1:n'
    if (value === '1:n') {
      setShowNField(true);
    } else {
      setShowNField(false);
      setNValue(""); // Reset del valore di n se non serve più
    }
  };

  const handleNChange = (e) => {
    setNValue(e.target.value);
    // Puoi aggiungere un handler per aggiornare lo stato di `document` se serve
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
   // e.preventDefault();
    console.log("Document saved:", document);
    
    try {
        const response = await API.saveDocument(document);
        const newId = response.data.id;
        // Reindirizza alla pagina Links con il nuovo ID
        navigate(`/document/link`);
      } catch (error) {
        console.error("Error saving document:", error);
      }
  };

  return (
    <div className="documents-background">
    <Container className="my-5">
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center">ADD NEW DOCUMENT</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    minLength={2} 
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
                    minLength={2} 
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
                  <Form.Select 
                    as="select"
                    name="scale"
                    value={document.scale}
                    onChange={handleScaleChange}
                    className="input"
                  >
                    <option value="">Select a scale</option>
                    {scale.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {showNField && (
                <Col md={3}>
                  <Form.Group controlId="nValue">
                    <Form.Label>Value of n</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="nValue" 
                      value={nValue} 
                      onChange={handleNChange} 
                      placeholder="Enter n"
                      className="input"
                    />
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group controlId="issuanceDate">
                  <Form.Label>Issuance Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="issuanceDate" 
                    value={document.issuanceDate} 
                    onChange={handleDateChange} 
                    placeholder="e.g., 2007"
                    className="input" 
                    isInvalid={!!error} // Aggiunge il feedback visivo per errore
                  />
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select 
                    as="select"
                    name="type"
                    value={document.type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select a type</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
           

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
                    type="integer" 
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
                minLength={2}  
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
