import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Dropdown,DropdownButton, Card, ProgressBar,Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Map } from './Map.jsx';
import '../styles/Documents.css';
import 'leaflet/dist/leaflet.css';
import { Polygon } from 'react-leaflet';
import L from 'leaflet';
import ISO6391 from 'iso-639-1';
import Select from 'react-select';
import * as turf from '@turf/turf';
import 'bootstrap-icons/font/bootstrap-icons.css';


function StepIndicator({ step, totalSteps, setStep, validateStep }) {
  const steps = [
    { label: 'STEP 1', icon: <i className="bi bi-lock"></i> },
    { label: 'STEP 2', icon: <i className="bi bi-person-circle"></i> },
    { label: 'STEP 3', icon: <i className="bi bi-credit-card"></i> },
    { label: 'STEP 4', icon: <i className="bi bi-check-circle"></i> }
  ];

  const handleStepChange = (newStep) => {
    if (newStep > step) {
      let isValid = false;
      if (step === 1) {
        isValid = validateStep(1);
      } else if (step === 2) {
        isValid = validateStep(2);
      } else if (step === 3) {
        isValid = validateStep(3);
      }

      if (isValid) {
        setStep(newStep);
      }
    } else {
      setStep(newStep);
    }
  };

  return (
    <div className="step-indicator d-flex justify-content-between mb-4">
      {steps.map((item, index) => (
        <button
          key={index}
          className={`step-btn btn ${index + 1 === step ? 'btn-light' : 'btn-light'} d-flex flex-column align-items-center`}
          onClick={() => handleStepChange(index + 1)}
        >
          <div className={`icon ${index + 1 <= step ? 'active' : ''}`}>
            {item.icon}
          </div>
          <span className={`${index + 1 === step ? 'text-primary' : 'text-muted'}`}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}




function Documents(props) {
  const [scales, setScales] = useState(["Text", "Blueprints/Effects", "1:n",]); 
  const [showNField, setShowNField] = useState(false);
  const totalSteps = 4;
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1);
  const [types, setTypes] = useState([]);
  const [currentTypes, setCurrentTypes] = useState([]);
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newType, setNewType] = useState("");
  const [stakeholders, setStakeholders] = useState([]);
  const [currentStakeholders, setCurrentStakeholders] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState("");

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
    coordinates: { lat: '', long: '' },
    pageFrom: '',
    pageTo: ''
  });
  
  const [errors, setErrors] = useState({
    title: '',
    stakeholder: '',
    scale: '',
    nValue: '',
    issuanceDate: '',
    type: '',
    language: '',
    coordinates: '',
    description: '',
    pages: ''
  });
  
  useEffect(() => {
    const fetchTypes = async () => {
      try { 
        const response = await API.getStakeholders();
        setStakeholders(response);
        setCurrentStakeholders(response); 
        const response2= await API.getTypeDocuments();
        setTypes(response2); 
        setCurrentTypes(response2); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTypes();

    if (id) {
      fetchDocument(id); 
    }
  }, [id]);

  const fetchDocument = async (documentId) => {
    try {
      const doc = await API.getDocumentById(documentId);
      setDocument(doc); 
      setShowNField(doc.scale === '1:n');
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

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

  const handleScaleChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    if (value === '1:n') {
      setShowNField(true);
    } else {
      setShowNField(false);
    }
  };

  const polygonCoordinates = [
    [67.87328157366065, 20.20047943270466],
    [67.84024426842895, 20.35839687019359],
    [67.82082254726043, 20.181254701184297],
    [67.87328157366065, 20.20047943270466] 
  ];

  const polygonGeoJson = {
    type: "Polygon",
    coordinates: [polygonCoordinates] // GeoJSON richiede un array annidato
  };

  const validateCoordinates = (lat, lng) => {
    const point = [lat, lng]; // ordine GeoJSON: [lng, lat]
    const isInside = turf.booleanPointInPolygon(point, polygonGeoJson);
    return isInside;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
     setDocument((prevDocument) => {
         if (name === 'lat' || name === 'long') {
             return {   ...prevDocument, coordinates: {
                     ...prevDocument.coordinates, [name]: parseFloat(value) || ''  }
                    };
         } else {
             return {
                 ...prevDocument,
                 [name]: name === 'nValue' ? parseInt(value, 10) || '' : value
             };
         }
     });
   };

   const handleMapClick = (lat, lng) => {
    setPosition({ lat, lng });
    setDocument((prevDocument) => ({
      ...prevDocument,
      coordinates: { lat, long: lng }
    }));
  };
  
const validateStep1 = () => {
  const newErrors = {};
  if (!document.title || document.title.length < 2) {
    newErrors.title = "Title is required and cannot be empty.";
  }
  if (!document.stakeholder) {
    newErrors.stakeholder = "You must select a stakeholder.";
  }
  if (!document.issuanceDate) {
    newErrors.issuanceDate = "You must select a Date in a valid format (YYYY-MM-DD).";
  }
  if (!document.description || document.description.length < 2) {
    newErrors.description = "Description is required and cannot be empty.";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; 
};

const validateStep2 = () => {
  const newErrors = {};
  if (!document.scale) {
    newErrors.scale = "You must select a scale.";
  }
  if (!document.type) {
    newErrors.type = "You must select a type.";
  }
  if (!document.language) {
    newErrors.language = "You must select a language.";
  }
  if (document.pages && !validatePages(document.pages)) {
    newErrors.pages = "Please enter a valid number or range (e.g., 35 or 35-45).";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const validateStep3 = () => {
  const newErrors = {};
  if (!position.lat || !position.lng || !validateCoordinates(Number(position.lat), Number(position.lng))) {
    newErrors.coordinates = "Please enter a valid LATITUDE and LONGITUDE or select from the map.";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleNextStep = () => {
  let isValid = false;
  if (step === 1) {
    isValid = validateStep1();
  } else if (step === 2) {
    isValid = validateStep2();
  } else if (step === 3) {
    isValid = validateStep3();
  }

  if (isValid) {
    setStep(prev => prev + 1);
  }
};

  const handlePreviousStep = () => setStep(prev => prev - 1);

  const validatePages = (value) => {
    const singleNumberRegex = /^\d+$/;
    const rangeRegex = /^\d+\s*-\s*\d+$/;  
    if (singleNumberRegex.test(value)) {
      document.pages = value; 
      document.pageFrom = "";
      document.pageTo = "";
      return true; 
    } else if (rangeRegex.test(value)) {
      const [start, end] = value.split('-').map(num => parseInt(num.trim(), 10));
      if (start < end) {
        document.pages = ""; 
        document.pageFrom = start; 
        document.pageTo = end; 
        return true; 
      } else {
        return "The starting page should be less than the ending page.";
      }
    } else {
      return "Please enter a valid number or range (e.g., 35 or 35-45).";
    }
  };

  const [position, setPosition] = useState({ lat: null, lng: null });
  useEffect(() => {
    if(position.lat && position.lng){
      document.coordinates.lat = position.lat;
      document.coordinates.long = position.lng;
    }
  }, [position.lat,position.lng]);

  useEffect(() => {
    if (document.coordinates.lat && document.coordinates.long && validateCoordinates(Number(document.coordinates.lat),Number(document.coordinates.lat))) {
      setPosition({ lat: document.coordinates.lat, lng: document.coordinates.long });
    }else if(document.coordinates.lat && document.coordinates.long && !validateCoordinates(Number(document.coordinates.lat),Number(document.coordinates.long))){
      setPosition({ lat: null, lng: null });
    }
  }, [document.coordinates.lat, document.coordinates.long]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doc= await API.saveDocument(document);  
      //Try to submit files
      if (files.length > 0) {
        files.forEach(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          try {
            await API.uploadFiles(doc.id,formData);
          } catch (error) {
            props.setError(error);
          }
        } ); 
      }
      props.setNewDoc(doc);
      navigate(`/documents/links`);
    } catch (error) {
      console.error("Error saving document:", error);
      props.setError(error);
    }
  };

//add_new Stakeholder and Type management
  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setIsAddingNew(true);
    } else if (value === "add_new_type") {
      setIsAddingNewType(true);
    } else {
      handleChange(e); 
    }
  };

  const handleNewStakeholderChange = (e) => {
    setNewStakeholder(e.target.value);
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  };

  const handleNewBlur = () => {
    if (newStakeholder.trim() !== "") {
      const newEntry = { name: newStakeholder };
      setCurrentStakeholders([...currentStakeholders, newEntry]); 
      setIsAddingNew(false); 
      handleChange({ target: { name: "stakeholder", value: newStakeholder } }); 
      setNewStakeholder("");
    } 
    if (newType.trim() !== "") {
      const newEntry = { name: newType };
      setCurrentTypes([...currentTypes, newEntry]); // Aggiungi il nuovo tipo
      setIsAddingNewType(false); // Nascondi il campo di input
      handleChange({ target: { name: "type", value: newType } }); // Aggiorna il valore selezionato
      setNewType(""); // Resetta il campo di input
    }
  };

  const renderStep1 = () => (
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
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
{/* STAKEHOLDER */}
        <Row className="mb-3">
          <Col className="mb-3" md={6}>
            <Form.Group controlId="stakeholder">
              <Form.Label>Stakeholders*</Form.Label>
              <Form.Select
                as="select"
                name="stakeholder"
                value={document.stakeholder || ""}
                onChange={handleSelectChange}
                className="input"
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
                <Form.Control.Feedback type="invalid">
                  {errors.stakeholder}
                </Form.Control.Feedback>
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
        </Row>
{/* ISSUANCE DATE */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="issuanceDate">
              <Form.Label>Issuance Date*</Form.Label>
              <div className={errors.issuanceDate ? "is-invalid" : ""}>
                <DatePicker
                  selected={document.issuanceDate ? new Date(document.issuanceDate) : null}
                  onChange={(date) =>
                    handleChange({
                      target: {
                        name: "issuanceDate",
                        value: date.toISOString().split("T")[0],
                      },
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                  showYearDropdown
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                  className="input"
                />
              </div>
              {errors.issuanceDate && (
                <div className="invalid-feedback">{errors.issuanceDate}</div>
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
        </Row>
      </Card.Body>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="mb-4">
      <Card.Body>
  {/* SCALE */}
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
  {/* TYPE */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="type">
              <Form.Label>Type*</Form.Label>
              <Form.Select
                as="select"
                name="type"
                value={document.type || ""}
                onChange={handleSelectChange}
                className="input"
                isInvalid={!!errors.type}
              >
                <option value="">Select a type</option>
                {currentTypes.map((type, index) => (
                  <option key={index} value={type.name}>
                    {type.name}
                  </option>
                ))}
                <option value="add_new_type">+ Add new type</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {isAddingNewType && (
            <Col md={6}>
              <Form.Group controlId="newType">
                <Form.Label>New Type</Form.Label>
                <Form.Control
                  type="text"
                  name="newType"
                  value={newType}
                  onChange={handleNewTypeChange}
                  onBlur={handleNewBlur} // Salva automaticamente quando perde il focus
                  placeholder="Enter new type"
                  className="input"
                />
              </Form.Group>
            </Col>
          )}
        </Row>
        <Row className="mb-3"> 
{/* LANGUAGE */}
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
              <Form.Control.Feedback type="invalid">
                {errors.language}
              </Form.Control.Feedback>
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
                placeholder="Number of pages or range (e.g., 35 or 35-45)"
                className="input" 
              />
                <Form.Control.Feedback type="invalid">
                {errors.pages}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderStep3 = () => (
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
            <div className="invalid-feedback d-block text-center">
              {errors.coordinates}
            </div>
          )}
        </Col>
      </Card.Body>
    </Card>
  );
  

  const renderStep4 = () => (
    <Card className="mb-4">
      <Card.Body>
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
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
      </Card.Body>
    </Card>
  );
       

  return (
         <div className="documents-background">
       <Container className="d-flex align-items-center justify-content-center min-vh-100">
         <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '700px' }}>
           <Card.Body>
             <Card.Title className="mb-4 text-center">ADD NEW DOCUMENT</Card.Title>

             {/* Step Indicator with Clickable Buttons */}
             <StepIndicator step={step}  totalSteps={4}  setStep={setStep}
                validateStep={(currentStep) => {
                  if (currentStep === 1) {
                    return validateStep1();
                  } else if (currentStep === 2) {
                    return validateStep2();
                  } else if (currentStep === 3) {
                    return validateStep3();
                  }
                  return true; // Default per gli step senza validazione
                }}
              />


          <Form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="mt-4">
              <Row>
                <Col md={6}>
                {step > 1 && <Button className='btn-back' variant="secondary" onClick={handlePreviousStep}>Back</Button>}
               </Col>
               <Col md={6}>
                {step < totalSteps ? (
                  <Button className='btn-save' variant="primary" onClick={handleNextStep}>Next</Button>
                ) : (
                  <Button className='btn-save' variant="success" onClick={handleSubmit} >Submit</Button>
                )}
                </Col>
              </Row>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  </div>
  );
}

export default Documents;



