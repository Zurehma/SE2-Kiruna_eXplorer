import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Dropdown, Card, ProgressBar,Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Map } from './Map.jsx';
import '../styles/Documents.css';
import 'leaflet/dist/leaflet.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Polygon } from 'react-leaflet';
import L from 'leaflet';
import ISO6391 from 'iso-639-1';
import Select from 'react-select';
import * as turf from '@turf/turf';



import 'bootstrap-icons/font/bootstrap-icons.css';

function StepIndicator({ step, totalSteps, setStep }) {
  const steps = [
    { label: 'STEP 1', icon: <i className="bi bi-lock"></i> },
    { label: 'STEP 2', icon: <i className="bi bi-person-circle"></i> },
    { label: 'STEP 3', icon: <i className="bi bi-credit-card"></i> },
    { label: 'STEP 4', icon: <i className="bi bi-check-circle"></i> }
  ];

  return (
    <div className="step-indicator d-flex justify-content-between mb-4">
      {steps.map((item, index) => (
        <button
          key={index}
          className={`step-btn btn ${index + 1 === step ? 'btn-primary' : 'btn-light'} d-flex flex-column align-items-center`}
          onClick={() => setStep(index + 1)}
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
  const [types, setTypes] = useState([]);  
  const [scales, setScales] = useState(["Text", "Blueprints/Effects", "1:n",]); // valori statici per scales
  const [showNField, setShowNField] = useState(false);
  const totalSteps = 4;
  const navigate = useNavigate();
  const { id } = useParams(); // Ottieni l'id dalla URL per la modalità modifica
  const [files, setFiles] = useState([]); //To manage uploaded files
  const [stakeholders, setStakeholders] = useState(["1ghj", "2hjkl", "3jkl", "4jkl", "5hjkl", "6hjkl", "7bhjk", "8nhjkl", "9nmjkl", "10mjkl"]); // valori statici per stakeholders
  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState("");
  const [step, setStep] = useState(1);

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
        const response2= await API.getTypeDocuments();
        setTypes(response2); 
   
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
      setDocument(doc); // Popola il form con i dati esistenti
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

    // Polygon coordinates
    const polygonCoordinates = [
      [67.87328157366065, 20.20047943270466],
      [67.84024426842895, 20.35839687019359],
      [67.82082254726043, 20.181254701184297],
      [67.87328157366065, 20.20047943270466] // Ritorno al primo punto per chiudere il poligono
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
             // Se il nome è 'lat' o 'long', aggiorna solo coordinates
             return {
                 ...prevDocument,
                 coordinates: {
                     ...prevDocument.coordinates,
                     [name]: parseFloat(value) || '' // Parsing in float per coordinate
                 }
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
    setDocument((prevDocument) => ({
      ...prevDocument,
      coordinates: { lat, long: lng }
    }));
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePreviousStep = () => setStep(prev => prev - 1);

   const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!document.title || document.title.length < 2) {
      newErrors.title = "Title is required and cannot be empty."
    }
    // if (!document.stakeholder || document.stakeholder.length < 2) {
    //   newErrors.stakeholder = "Stakeholder is required and cannot be empty.";
    // }
    if (!document.scale) {
      newErrors.scale = "You must select a scale.";
    }
    if (!document.type) {
      newErrors.type = "You must select a type.";
    }
    if (!document.issuanceDate) {
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
    if (!document.coordinates.lat || !document.coordinates.long || !validateCoordinates(Number(document.coordinates.lat), Number(document.coordinates.long))) {
      newErrors.coordinates = "Please enter a valid number of LATITUDE and LONGITUDE or select from the map.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
      console.log("Document to saveeeee:", document);

    try {
    

      const response = await API.saveDocument(document);
      doc = response;
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

  const validatePages = (value) => {
    // Regex per controllare se è un singolo numero o un range valido
    const singleNumberRegex = /^\d+$/;
    const rangeRegex = /^\d+\s*-\s*\d+$/;
  
    if (singleNumberRegex.test(value)) {
      document.pages = value; // Assegna il numero singolo a pages
      document.pageFrom = "";
      document.pageTo = "";
      return true; // Numero singolo valido
    } else if (rangeRegex.test(value)) {
      const [start, end] = value.split('-').map(num => parseInt(num.trim(), 10));
      if (start < end) {
        document.pages = ""; // Svuota pages per il range
        document.pageFrom = start; // Assegna il primo numero a pageFrom
        document.pageTo = end; // Assegna il secondo numero a pageTo
        return true; // Range valido con inizio minore di fine
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




  const renderStep1 = () => (
    <Card className="mb-4">
      <Card.Body>
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
    <Form.Group controlId="stakeholders">
                <Form.Label>Stakeholders*</Form.Label>
                <Form.Select 
                    as="select"
                    name="stakeholder"
                    value={document.stakeholder || ""}
                    onChange={handleChange}
                    className="input"    
                    isInvalid={!!errors.stakeholder} 
                  >
                    <option value="">Select a stakeholder</option>
                    {stakeholders.map((stakeholder, index) => (
                      <option key={index} value={stakeholder}>{stakeholder}</option>
                    ))}
                  </Form.Select>
                  {/* <Form.Control.Feedback type="invalid">
                    {errors.stakeholder}
                  </Form.Control.Feedback> */}

      
                </Form.Group> 

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
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
      </Card.Body>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="mb-4">
     
      <Card.Body>
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
                    <option key={index} value={type.name}>{type.name}</option>
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
                    name="lat" 
                    value={document.coordinates.lat || ""} 
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
                    name="long" 
                    value={document.coordinates.long || ""} 
                    onChange={handleChange} 
                    placeholder="e.g., 18.0686"
                    className="input" 
                  />
                             <Form.Control.Feedback type="invalid">
                  {errors.coordinates}
              </Form.Control.Feedback>
                </Form.Group>
              </Col>

            </Row>
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

  const renderStep4 = () => (
    <Card className="mb-4">
      <Card.Body>
        <Form.Group controlId="description">
          <Form.Label>Description*</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={document.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
        </Form.Group>
        <Map
          handleMapClick={(lat, lng) => setDocument(prevDoc => ({
            ...prevDoc,
            coordinates: { lat, long: lng }
          }))}
        />
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
             <StepIndicator step={step} totalSteps={totalSteps} setStep={setStep} />


<Form onSubmit={handleSubmit}>
  {step === 1 && renderStep1()}
  {step === 2 && renderStep2()}
  {step === 3 && renderStep3()}
  {step === 4 && renderStep4()}

  <div className="mt-4 d-flex justify-content-between">
    {step > 1 && <Button variant="secondary" onClick={handlePreviousStep}>Back</Button>}
    {step < totalSteps ? (
      <Button variant="primary" onClick={handleNextStep}>Next</Button>
    ) : (
      <Button variant="success" type="submit">Submit</Button>
    )}
  </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  </div>
  );
}

export default Documents;











// import React, { useState, useEffect } from 'react';
// import { Form, Button,Dropdown, Container, Card, Row, Col } from 'react-bootstrap';
// import '../styles/Documents.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import API from '../../API.js';
// import { Map } from './Map.jsx';
// import 'leaflet/dist/leaflet.css';
// import { Polygon } from 'react-leaflet';
// import L from 'leaflet';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ISO6391 from 'iso-639-1';
// import Select from 'react-select';
// import * as turf from '@turf/turf';


// function Documents(props) { 
//   const [types, setTypes] = useState([]);  
//   const [scales, setScales] = useState(["Text", "Blueprints/Effects", "1:n",]); // valori statici per scales
//   const [showNField, setShowNField] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams(); // Ottieni l'id dalla URL per la modalità modifica
//   const [files, setFiles] = useState([]); //To manage uploaded files

//   const [stakeholders, setStakeholders] = useState(["1ghj", "2hjkl", "3jkl", "4jkl", "5hjkl", "6hjkl", "7bhjk", "8nhjkl", "9nmjkl", "10mjkl"]); // valori statici per stakeholders
//   const [selectedStakeholderIds, setSelectedStakeholderIds] = useState([]);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [newStakeholder, setNewStakeholder] = useState("");
  
//   const [document, setDocument] = useState({
//     title: '',
//     stakeholder: '',
//     scale: '',
//     nValue: '',
//     issuanceDate: '',
//     type: '',
//     description: '',
//     language: '',
//     pages: '',
//     coordinates: { lat: '', long: '' },  // Nuovo campo coordinates
//     pageFrom: '',
//     pageTo: ''
//   });
  
//   const [errors, setErrors] = useState({
//     title: '',
//     stakeholder: '',
//     scale: '',
//     nValue: '',
//     issuanceDate: '',
//     type: '',
//     language: '',
//     coordinates: '',
//     description: '',
//     pages: ''
//   });

//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const response2= await API.getTypeDocuments();
//         setTypes(response2); 
   
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchTypes();

//     if (id) {
//       fetchDocument(id); 
//     }
//   }, [id]);

//   const fetchDocument = async (documentId) => {
//     try {
//       const doc = await API.getDocumentById(documentId);
//       setDocument(doc); // Popola il form con i dati esistenti
//       setShowNField(doc.scale === '1:n');
//     } catch (error) {
//       console.error("Error fetching document:", error);
//     }
//   };
   
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const validFormats = ['.mp4', '.jpeg', '.pdf', '.png','jpg'];
//     // Filter files by extension and add them only if they respect the correct format
//     const newFiles = selectedFiles.filter(file => 
//       validFormats.some(format => file.name.endsWith(format))
//     );
//     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   };

//   const removeFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleScaleChange = (e) => {
//     const { value } = e.target;
//     handleChange(e);
//     if (value === '1:n') {
//       setShowNField(true);
//     } else {
//       setShowNField(false);
//     }
//   };

//   // Polygon coordinates
//   const polygonCoordinates = [
//     [67.87328157366065, 20.20047943270466],
//     [67.84024426842895, 20.35839687019359],
//     [67.82082254726043, 20.181254701184297],
//     [67.87328157366065, 20.20047943270466] // Ritorno al primo punto per chiudere il poligono
//   ];

//   const polygonGeoJson = {
//     type: "Polygon",
//     coordinates: [polygonCoordinates] // GeoJSON richiede un array annidato
//   };

//   const validateCoordinates = (lat, lng) => {
//     const point = [lat, lng]; // ordine GeoJSON: [lng, lat]
//     const isInside = turf.booleanPointInPolygon(point, polygonGeoJson);
//     return isInside;
// };



//   const handleChange = (e) => {
//    const { name, value } = e.target;
//     setDocument((prevDocument) => {
//         if (name === 'lat' || name === 'long') {
//             // Se il nome è 'lat' o 'long', aggiorna solo coordinates
//             return {
//                 ...prevDocument,
//                 coordinates: {
//                     ...prevDocument.coordinates,
//                     [name]: parseFloat(value) || '' // Parsing in float per coordinate
//                 }
//             };
//         } else {
//             return {
//                 ...prevDocument,
//                 [name]: name === 'nValue' ? parseInt(value, 10) || '' : value
//             };
//         }
//     });
//   };

//   const handleMapClick = (lat, lng) => {
//     setDocument((prevDocument) => ({
//       ...prevDocument,
//       coordinates: { lat, long: lng }
//     }));
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const newErrors = {};
//     if (!document.title || document.title.length < 2) {
//       newErrors.title = "Title is required and cannot be empty."
//     }
//     // if (!document.stakeholder || document.stakeholder.length < 2) {
//     //   newErrors.stakeholder = "Stakeholder is required and cannot be empty.";
//     // }
//     if (!document.scale) {
//       newErrors.scale = "You must select a scale.";
//     }
//     if (!document.type) {
//       newErrors.type = "You must select a type.";
//     }
//     if (!document.issuanceDate) {
//       newErrors.issuanceDate = "Issuance Date must be in a valid format (YYYY-MM-DD, YYYY-MM, or YYYY).";
//     }
//     if (!document.language) {
//       newErrors.language = "Language is required and cannot be empty.";
//     }
//     if (!document.description || document.description.length < 2) {
//       newErrors.description = "Description is required and cannot be empty.";
//     }
//     if (document.pages && !validatePages(document.pages)) {
//       newErrors.pages = "Please enter a valid number or range (e.g., 35 or 35-45).";
//     }
//     if (!document.coordinates.lat || !document.coordinates.long || !validateCoordinates(Number(document.coordinates.lat), Number(document.coordinates.long))) {
//       newErrors.coordinates = "Please enter a valid number of LATITUDE and LONGITUDE or select from the map.";
//     }
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;
//       console.log("Document to saveeeee:", document);

//     try {
    

//       const response = await API.saveDocument(document);
//       doc = response;
//       //Try to submit files
//       if (files.length > 0) {
//         files.forEach(async (file) => {
//           const formData = new FormData();
//           formData.append('file', file);
//           try {
//             await API.uploadFiles(doc.id,formData);
//           } catch (error) {
//             props.setError(error);
//           }
//         } ); 
//       }
//       props.setNewDoc(doc);
//       navigate(`/documents/links`);
//     } catch (error) {
//       console.error("Error saving document:", error);
//       props.setError(error);
//     }
//   };


//   const validatePages = (value) => {
//     // Regex per controllare se è un singolo numero o un range valido
//     const singleNumberRegex = /^\d+$/;
//     const rangeRegex = /^\d+\s*-\s*\d+$/;
  
//     if (singleNumberRegex.test(value)) {
//       document.pages = value; // Assegna il numero singolo a pages
//       document.pageFrom = "";
//       document.pageTo = "";
//       return true; // Numero singolo valido
//     } else if (rangeRegex.test(value)) {
//       const [start, end] = value.split('-').map(num => parseInt(num.trim(), 10));
//       if (start < end) {
//         document.pages = ""; // Svuota pages per il range
//         document.pageFrom = start; // Assegna il primo numero a pageFrom
//         document.pageTo = end; // Assegna il secondo numero a pageTo
//         return true; // Range valido con inizio minore di fine
//       } else {
//         return "The starting page should be less than the ending page.";
//       }
//     } else {
//       return "Please enter a valid number or range (e.g., 35 or 35-45).";
//     }
//   };
  

//   const [position, setPosition] = useState({ lat: null, lng: null });
//   useEffect(() => {
//     if(position.lat && position.lng){
//       document.coordinates.lat = position.lat;
//       document.coordinates.long = position.lng;
//     }
//   }, [position.lat,position.lng]);

//   useEffect(() => {
//     if (document.coordinates.lat && document.coordinates.long && validateCoordinates(Number(document.coordinates.lat),Number(document.coordinates.lat))) {
//       setPosition({ lat: document.coordinates.lat, lng: document.coordinates.long });
//     }else if(document.coordinates.lat && document.coordinates.long && !validateCoordinates(Number(document.coordinates.lat),Number(document.coordinates.long))){
//       setPosition({ lat: null, lng: null });
//     }
//   }, [document.coordinates.lat, document.coordinates.long]);




 
  




//   return (
//     <div className="documents-background">
//       <Container className="d-flex align-items-center justify-content-center min-vh-100">
//         <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '700px' }}>
//           <Card.Body>
//             <Card.Title className="mb-4 text-center">ADD NEW DOCUMENT</Card.Title>
//             <Form onSubmit={handleSubmit}>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="title">
//                   <Form.Label>Title*</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     name="title" 
//                     minLength={2} 
//                     value={document.title || ""}  // Usa stringa vuota come valore predefinito
//                     onChange={handleChange} 
//                     placeholder="Enter document title"
//                     className="input" 
//                     isInvalid={!!errors.title} 
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//               <Form.Group controlId="stakeholders">
//                 <Form.Label>Stakeholders*</Form.Label>
//                 <Form.Select 
//                     as="select"
//                     name="stakeholder"
//                     value={document.stakeholder || ""}
//                     onChange={handleChange}
//                     className="input"    
//                     isInvalid={!!errors.stakeholder} 
//                   >
//                     <option value="">Select a stakeholder</option>
//                     {stakeholders.map((stakeholder, index) => (
//                       <option key={index} value={stakeholder}>{stakeholder}</option>
//                     ))}
//                   </Form.Select>
//                   {/* <Form.Control.Feedback type="invalid">
//                     {errors.stakeholder}
//                   </Form.Control.Feedback> */}

      
//                 </Form.Group>     
//               </Col>
//             </Row>

//              <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="scale">
//                   <Form.Label>Scale*</Form.Label>
//                   <Form.Select 
//                     as="select"
//                     name="scale"
//                     value={document.scale || ""}
//                     onChange={handleScaleChange}
//                     className="input"    
//                     isInvalid={!!errors.scale} 
//                   >
//                     <option value="">Select a scale</option>
//                     {scales.map((scale, index) => (
//                       <option key={index} value={scale}>{scale}</option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.scale}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>

//               {showNField && (
//                 <Col md={6}>
//                   <Form.Group controlId="nValue">
//                     <Form.Label>Value of n*</Form.Label>
//                     <Form.Control 
//                       type="text" 
//                       name="nValue" 
//                       value={document.nValue || ""} 
//                       onChange={handleChange} 
//                       placeholder="Enter n"
//                       className="input"
//                       //isInvalid={!!errors.scale}
//                     />
//                   </Form.Group>
//                 </Col>
//               )}

//             </Row>
            
//             <Row className="mb-3">
//               <Col md={6}>
//               <Form.Group controlId="type">
//                 <Form.Label>Type*</Form.Label>
//                 <Form.Select 
//                   as="select"
//                   name="type"
//                   value={document.type || ""}
//                   onChange={handleChange}
//                   className="input"
//                   isInvalid={!!errors.type} 
//                 >
//                   <option value="">Select a type</option>
//                   {types.map((type, index) => (
//                     <option key={index} value={type.name}>{type.name}</option>
//                   ))}
//                 </Form.Select>
//                 <Form.Control.Feedback type="invalid">
//                   {errors.type}
//                 </Form.Control.Feedback>
//               </Form.Group>
//               </Col>
             
//               <Col md={6}>
//                 <Form.Group controlId="issuanceDate">
//                   <Form.Label>Issuance Date*</Form.Label>
//                   <DatePicker
//                     selected={document.issuanceDate ? new Date(document.issuanceDate) : null}
//                     onChange={(date) => handleChange({ 
//                       target: { 
//                         name: "issuanceDate", 
//                         value: date.toISOString().split('T')[0]  // Converti in formato YYYY-MM-DD
//                       } 
//                     })}
//                     dateFormat="yyyy-MM-dd"
//                     placeholderText="Select a date"
//                     className="input"
//                   />
//                   {errors.issuanceDate && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.issuanceDate}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>
//               </Col>         

//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="language">
//                   <Form.Label>Language*</Form.Label>
//                   <Form.Select 
//                     name="language" 
//                     value={document.language || ""} 
//                     onChange={handleChange} 
//                     className="input" 
//                     isInvalid={!!errors.language}
//                   >
//                     <option value="" disabled>Select language...</option>
//                     <option value="Swedish">Swedish (recommended)</option>
//                     <option value="English">English (recommended)</option>
//                     <option value="Spanish">Spanish</option>
//                     <option value="French">French</option>
//                     <option value="German">German</option>
//                     <option value="Italian">Italian</option>
//                     <option value="Chinese">Chinese</option>
//                     <option value="Japanese">Japanese</option>
//                     <option value="Russian">Russian</option>
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.language}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group controlId="pages">
//                   <Form.Label>Pages</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     name="pages" 
//                     value={document.pages || ""} 
//                     onChange={handleChange} 
//                     placeholder="Number of pages or range (e.g., 35 or 35-45)"
//                     className="input" 
//                   />
//                    <Form.Control.Feedback type="invalid">
//                     {errors.pages}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>
           

//             <Row className="mb-3">
//               <Form.Label>Select a point on the Map, if not selected, the entire municipality is considered</Form.Label>
//               <Map handleMapClick={handleMapClick} setPosition={setPosition} latitude={position.lat} longitude={position.lng} polygonCoordinates={polygonCoordinates} validateCoordinates={validateCoordinates} />
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="latitude">
//                   <Form.Label>Latitude</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     name="lat" 
//                     value={document.coordinates.lat || ""} 
//                     onChange={handleChange}
//                     placeholder="e.g., 59.3293"
//                     className="input" 
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="longitude">
//                   <Form.Label>Longitude</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     name="long" 
//                     value={document.coordinates.long || ""} 
//                     onChange={handleChange} 
//                     placeholder="e.g., 18.0686"
//                     className="input" 
//                   />
//                              <Form.Control.Feedback type="invalid">
//                   {errors.coordinates}
//               </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>

//             </Row>

//             <Form.Group controlId="description" className="mb-4">
//             <Form.Label>Description*</Form.Label>
//             <Form.Control 
//                 as="textarea" 
//                 rows={5} 
//                 name="description" 
//                 minLength={2}  
//                 value={document.description || ""} 
//                 onChange={handleChange} 
//                 placeholder="Enter a brief description"
//                 className="input-textarea" 
//                 isInvalid={!!errors.description}
//             />
//             <Form.Control.Feedback type="invalid">
//                 {errors.description}
//             </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="fileUpload">
//                 <Form.Label>Upload Files</Form.Label>
//                 <Form.Control
//                   type="file"
//                   multiple
//                   onChange={handleFileChange} 
//                   className="file-input"
//                 />
//                 <div className="file-preview mt-3">
//                   {files.map((file, index) => (
//                     <div key={index} className="file-item d-flex justify-content-between align-items-center mb-3 ms-2">
//                       <span>{file.name}</span>
//                       <Button variant="danger" size="sm" onClick={() => removeFile(index)} className="me-2">
//                         <i className="bi bi-trash-fill"></i>
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </Form.Group>

//             <div className="text-center mt-4">
//                 <Button variant="primary" type="submit" onClick={handleSubmit} className="btn-save">Save Document</Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>
//     </Container>
//     </div>
//   );
// }

// export default Documents;


