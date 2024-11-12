import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import '../styles/Documents.css';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import { Map } from './Map.jsx';
import 'leaflet/dist/leaflet.css';
import { Polygon } from 'react-leaflet';
import L from 'leaflet';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ISO6391 from 'iso-639-1';


function Documents(props) { 
  const [types, setTypes] = useState([]);
  const [scales, setScales] = useState([]);
  const [showNField, setShowNField] = useState(false);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); //To manage uploaded files
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFormats = ['.mp4', '.jpeg', '.pdf', '.png','jpg'];

    // Filter files by extension and add them only if they respect the correct format
    const newFiles = selectedFiles.filter(file => 
      validFormats.some(format => file.name.endsWith(format))
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const [document, setDocument] = useState({
    title: '',
    stakeholder: '',
    scale: '',
    nValue: '',
    issuanceDate: '',
    type: '',
    description: '',
    language: '',
    pages: '',
    latitude: '',
    longitude: '',
    pageFrom: '', // Nuovo campo
    pageTo: ''    // Nuovo campo
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

  // const validateDate = (date) => {
  //   const validFormats = [
  //     /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  //     /^\d{4}-\d{2}$/,       // YYYY-MM
  //     /^\d{4}$/              // YYYY
  //   ];
  //   return validFormats.some((regex) => regex.test(date));
  // };
  
  const validatePages = (value) => {
    // Regex per controllare se è un singolo numero o un range valido (es. "35-45" o "35 - 45")
    const singleNumberRegex = /^\d+$/;
    const rangeRegex = /^\d+\s*-\s*\d+$/;

    if (singleNumberRegex.test(value)) {
      return true; // Numero singolo valido
    } else if (rangeRegex.test(value)) {
      const [start, end] = value.split('-').map(num => parseInt(num.trim(), 10));
      if (start < end) {
        return true; // Range valido con inizio minore di fine
      } else {
        return "The starting page should be less than the ending page.";
      }
    } else {
      return "Please enter a valid number or range (e.g., 35 or 35-45).";
    }
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

  //Polygon coordinates to check that the coordinates are inside it
  const polygonCoordinates = [
    [67.87328157366065, 20.20047943270466],
    [67.84024426842895, 20.35839687019359],
    [67.82082254726043, 20.181254701184297]
  ];

  const polygon = L.polygon(polygonCoordinates);
  const validateCoordinates = (lat, lng) => {
    const point = L.latLng(lat, lng);
    return polygon.getBounds().contains(point);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      [name]: name === 'nValue' ? parseInt(value, 10) || '' : value, // Converti nValue in numero
    }));
  };

  const [errors, setErrors] = useState({
    title: '',
    stakeholder: '',
    scale: '',
    nValue: '',
    issuanceDate: '',
    type: '',
    language: '',
    latitude: '',
    longitude: '',
    description: '',
    pages: ''
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
      newErrors.issuanceDate = "Issuance Date must be in a valid format (YYYY-MM-DD, YYYY-MM, or YYYY).";
    }
    if (!document.language) {
      newErrors.language = "Language is required and cannot be empty.";
    }
    if (!document.description || document.description.length < 2) {
      newErrors.description = "Description is required and cannot be empty.";
    }
    if (document.pages && !validatePages(document.pages)) {
      newErrors.pages = "Please enter a valid number or range (e.g., 35 or 35-45).";
    }
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
  
    if(document.nValue && document.scale === '1:n') {  
      document.scale = document.nValue;
    }
    let doc = {};
    try {
      const response = await API.saveDocument(document);
      doc = response;
      //Try to submit files
      /*
      if (files.length > 0) {
        files.forEach(async (file) => {
          const formData = new FormData();
          formData.append(file.name.split('.').pop(), file);
          try {
            await API.uploadFiles(doc.id,formData);
          } catch (error) {
            props.setError(error);
          }
        } ); 
      }*/
      props.setNewDoc(doc);
      navigate(`/documents/links`);
    } catch (error) {
      console.error("Error saving document:", error);
      props.setError(error);
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
    if(position.lat && position.lng){
      document.latitude = position.lat;
      document.longitude = position.lng;
    }
  }, [position.lat,position.lng]);

  useEffect(() => {
    if (document.latitude && document.longitude && validateCoordinates(Number(document.latitude),Number(document.longitude))) {
      setPosition({ lat: document.latitude, lng: document.longitude });
    }else if(document.latitude && document.longitude && !validateCoordinates(Number(document.latitude),Number(document.longitude))){
      setPosition({ lat: null, lng: null });
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
                  <Form.Label>Title*</Form.Label>
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
                  <Form.Label>Stakeholder*</Form.Label>
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
                  <Form.Label>Scale*</Form.Label>
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
                    <Form.Label>Value of n*</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="nValue" 
                      value={document.nValue || ""} 
                      onChange={handleChange} 
                      placeholder="Enter n"
                      className="input"
                      //isInvalid={!!errors.scale}
                    />
                  </Form.Group>
                </Col>
              )}

            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type*</Form.Label>
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
                  <Form.Label>Issuance Date*</Form.Label>
                  <DatePicker
                    selected={document.issuanceDate ? new Date(document.issuanceDate) : null}
                    onChange={(date) => handleChange({ 
                      target: { 
                        name: "issuanceDate", 
                        value: date.toISOString().split('T')[0]  // Converti in formato YYYY-MM-DD
                      } 
                    })}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    className="input"
                  />
                  {errors.issuanceDate && (
                    <Form.Control.Feedback type="invalid">
                      {errors.issuanceDate}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>         

            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="language">
                  <Form.Label>Language*</Form.Label>
                  <Form.Select 
                    name="language" 
                    value={document.language || ""} 
                    onChange={handleChange} 
                    className="input" 
                    isInvalid={!!errors.language}
                  >
                    <option value="" disabled>Select language...</option>
                    {/* Recommended languages */}
                    <option value="Swedish">Swedish (recommended)</option>
                    <option value="English">English (recommended)</option>
                    
                    {/* Other languages */}
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Russian">Russian</option>
                    {/* Add more languages if needed */}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.language}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="pages">
                  <Form.Label>Pages</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="pages" 
                    value={document.pages || ""} 
                    onChange={handleChange} 
                    placeholder="Number of pages or range (e.g., 35 or 35-45)"
                    className="input" 
                  />
                   <Form.Control.Feedback type="invalid">
                    {errors.pages}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Form.Label>Select a point on the Map, if not selected, the entire municipality is considered</Form.Label>
              <Map handleMapClick={handleMapClick} setPosition={setPosition} latitude={position.lat} longitude={position.lng} polygonCoordinates={polygonCoordinates} validateCoordinates={validateCoordinates} />
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
            <Form.Label>Description*</Form.Label>
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
            <Form.Group controlId="fileUpload">
                <Form.Label>Upload Files</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange} 
                  className="file-input"
                />
                <div className="file-preview mt-3">
                  {files.map((file, index) => (
                    <div key={index} className="file-item d-flex justify-content-between align-items-center mb-3 ms-2">
                      <span>{file.name}</span>
                      <Button variant="danger" size="sm" onClick={() => removeFile(index)} className="me-2">
                        <i class="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  ))}
                </div>
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





