import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import '../styles/Documents.css';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import { Map } from './Map.jsx';

function Documents(props) { 
  const [types, setTypes] = useState([]);
  const [scales, setScales] = useState([]);
  const [showNField, setShowNField] = useState(false);
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    title: '',
    stakeholder: '',
    scale: '',
    issuanceDate: '',
    type: '',
    description: '',
    language: '',
    pages: '',
    latitude:'',
    longitude: '',
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await API.getTypeDocuments();
        setTypes(response); 
        const response2 = await API.getTypeScale();
        setScales(response2); 
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleScaleChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    if (value === '1:n') {
      setShowNField(true);
    } else {
      setShowNField(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({
    title: '',
    stakeholder: '',
    scale: '',
    issuanceDate: '',
    type: '',
    language: '',
    pages: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!document.title || document.title.length < 2) {
      newErrors.title = "Title is required and cannot be empty."
    }
    if (!document.stakeholder || document.stakeholder.length < 2) {
      newErrors.stakeholder = "Stakeholder is required and cannot be empty.";
    }
    if (!document.scale) {
      newErrors.scale = "You must select a scale.";
    }
    if (!document.type) {
      newErrors.type = "You must select a type.";
    }
    if (!document.issuanceDate || !validateDate(document.issuanceDate)) {
      newErrors.issuanceDate = "Issuance Date must be in a valid format (DD/MM/YYYY, MM/YYYY, or YYYY).";
    }
    if (!document.language) {
      newErrors.language = "Language is required and cannot be empty.";
    }
    if (!document.description || document.description.length < 2) {
      newErrors.description = "Description is required and cannot be empty.";
    }
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      const response = await API.saveDocument(document);
      const doc = response;
      props.setNewDoc(doc);
      navigate(`/documents/links`);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };
  
  const handleMapClick = (lat, lng) => {
    setDocument((prevDocument) => ({
      ...prevDocument,
      latitude: lat,
      longitude: lng,
    }));
  };

  const [position, setPosition] = useState({ lat: null, lng: null });
  useEffect(() => {
    document.latitude = position.lat;
    document.longitude = position.lng;
  }, [position.lat,position.lng]);

  useEffect(() => {
    if (document.latitude && document.longitude) {
      setPosition({ lat: document.latitude, lng: document.longitude });
      
    }
  }, [document.latitude, document.longitude]);

  return (
    <div className="documents-background">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '700px' }}>
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
                    value={document.title || ""}  // Usa stringa vuota come valore predefinito
                    onChange={handleChange} 
                    placeholder="Enter document title"
                    className="input" 
                    isInvalid={!!errors.title} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="stakeholder">
                  <Form.Label>Stakeholder</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="stakeholder" 
                    minLength={2} 
                    value={document.stakeholder || ""} 
                    onChange={handleChange} 
                    placeholder="e.g., Kiruna kommun/Residents"
                    className="input" 
                    isInvalid={!!errors.stakeholder} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stakeholder}
                  </Form.Control.Feedback>
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
                    value={document.scale || ""}
                    onChange={handleScaleChange}
                    className="input"    
                    isInvalid={!!errors.scale} 
                  >
                    <option value="">Select a scale</option>
                    {scales.map((scale, index) => (
                      <option key={index} value={scale}>{scale}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.scale}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {showNField && (
                <Col md={6}>
                  <Form.Group controlId="nValue">
                    <Form.Label>Value of n</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="nValue" 
                      value={document.scale || ""} 
                      onChange={handleChange} 
                      placeholder="Enter n"
                      className="input"
                      isInvalid={!!errors.scale}
                    />
                  </Form.Group>
                </Col>
              )}

            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select 
                    as="select"
                    name="type"
                    value={document.type || ""}
                    onChange={handleChange}
                    className="input"
                    isInvalid={!!errors.type} 
                  >
                    <option value="">Select a type</option>
                    {types.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="issuanceDate">
                  <Form.Label>Issuance Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="issuanceDate" 
                    value={document.issuanceDate || ""} 
                    onChange={handleChange} 
                    placeholder="e.g., 2007"
                    className="input" 
                    isInvalid={!!errors.issuanceDate} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.issuanceDate}
                  </Form.Control.Feedback>
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
                    value={document.language || ""} 
                    onChange={handleChange} 
                    placeholder="e.g., Swedish"
                    className="input" 
                    isInvalid={!!errors.language}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.language}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="pages">
                  <Form.Label>Pages</Form.Label>
                  <Form.Control 
                    type="integer" 
                    name="pages" 
                    value={document.pages || ""} 
                    onChange={handleChange} 
                    placeholder="Number of pages"
                    className="input" 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Label>Select a point on the Map, if not selected, the entire municipality is considered</Form.Label>
              <Map handleMapClick={handleMapClick} setPosition={setPosition} latitude={position.lat} longitude={position.lng} />
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="latitude" 
                    value={document.latitude || ""} 
                    onChange={handleChange}
                    placeholder="e.g., 59.3293"
                    className="input" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="longitude" 
                    value={document.longitude || ""} 
                    onChange={handleChange} 
                    placeholder="e.g., 18.0686"
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
                value={document.description || ""} 
                onChange={handleChange} 
                placeholder="Enter a brief description"
                className="input-textarea" 
                isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
                {errors.description}
            </Form.Control.Feedback>
            </Form.Group>

            <div className="text-center mt-4">
                <Button variant="primary" type="submit" onClick={handleSubmit} className="btn-save">Save Document</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
}

export default Documents;





