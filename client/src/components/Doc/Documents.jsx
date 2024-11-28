import React, { useState, useEffect } from "react";
import { Form, Button, Container, Dropdown } from "react-bootstrap";
import { DropdownButton, Card, ProgressBar, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../API.js";
import { Map } from "./../Map.jsx";
import "../../styles/Documents.css";
import "leaflet/dist/leaflet.css";
import { Polygon } from "react-leaflet";
import L from "leaflet";
import ISO6391 from "iso-639-1";
import Select from "react-select";
import * as turf from "@turf/turf";
import "bootstrap-icons/font/bootstrap-icons.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";

function Documents(props) {
  const [scales, setScales] = useState(["Text", "Blueprints/Effects", "1:n"]);
  const [showNField, setShowNField] = useState(false);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [filesToBeDeleted, setFilesToBeDeleted] = useState([]);
  const { id } = useParams();

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
    title: "",
    stakeholder: "",
    scale: "",
    nValue: "",
    issuanceDate: "",
    type: "",
    description: "",
    language: "",
    pages: "",
    coordinates: { lat: "", long: "" },
    pageFrom: "",
    pageTo: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    stakeholder: "",
    scale: "",
    nValue: "",
    issuanceDate: "",
    type: "",
    language: "",
    coordinates: "",
    description: "",
    pages: "",
  });

  const resetState = () => {
    setDocument(() => ({
      title: "",
      stakeholder: "",
      scale: "",
      nValue: "",
      issuanceDate: "",
      type: "",
      description: "",
      language: "",
      pages: "",
      coordinates: { lat: "", long: "" },
      pageFrom: "",
      pageTo: "",
    }));
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await API.getStakeholders();
        setStakeholders(response);
        setCurrentStakeholders(response);
        const response2 = await API.getTypeDocuments();
        setTypes(response2);
        setCurrentTypes(response2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTypes();

    if (id) {
      fetchDocument(id);
      //here fetch existing attachments, so that you can give the possibility to modify them
      fetchAttachments(id);
    } else {
      resetState();
    }
  }, [id]);

  const fetchDocument = async (documentId) => {
    try {
      const doc = await API.getDocumentById(documentId);
      const coordinates = doc.coordinates || { lat: "", long: "" };
      let pages = doc.pages;
      if (!doc.pages && doc.pageFrom && doc.pageTo) {
        pages = `${doc.pageFrom}-${doc.pageTo}`;
      }

      let scale = doc.scale;
      let nValue = "";
      let showNField = false; // Variabile temporanea per gestire la visualizzazione del campo
      if (scale !== "Text" && scale !== "Blueprints/Effects") {
        nValue = Number(scale); // Converti scale in numero
        scale = `1:n`; // Imposta scale come `1:n`
        showNField = true; // Mostra il campo nValue
      }
      // Aggiorna lo stato del documento e del campo di visualizzazione
      setDocument((prevDocument) => ({
        ...doc,
        coordinates,
        pages,
        scale,
        nValue,
      }));
      setShowNField(showNField); // Aggiorna la visibilità del campo nValue
    } catch (error) {
      console.error("Error fetching document:", error);
      props.setError(error);
    }
  };

  const fetchAttachments = async (documentId) => {
    try {
      const attachments = await API.getAttachments(documentId);
      setExistingAttachments(attachments);
    } catch (error) {
      props.setError(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFormats = [".mp4", ".jpeg", ".pdf", ".png", "jpg"];
    // Filter files by extension and add them only if they respect the correct format
    const newFiles = selectedFiles.filter((file) =>
      validFormats.some((format) => file.name.endsWith(format))
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleScaleChange = (e) => {
    const { value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      scale: value,
      nValue: value === "1:n" ? prevDocument.nValue || "" : undefined, // Resetta nValue se non è `1:n`
    }));
    setShowNField(value === "1:n"); // Mostra o nascondi il campo nValue
  };

  const polygonCoordinates = [
    [67.87328157366065, 20.20047943270466],
    [67.84024426842895, 20.35839687019359],
    [67.82082254726043, 20.181254701184297],
    [67.87328157366065, 20.20047943270466],
  ];

  const polygonGeoJson = {
    type: "Polygon",
    coordinates: [polygonCoordinates], // GeoJSON richiede un array annidato
  };

  const validateCoordinates = (lat, lng) => {
    const point = [lat, lng]; // ordine GeoJSON: [lng, lat]
    const isInside = turf.booleanPointInPolygon(point, polygonGeoJson);
    return isInside;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => {
      if (name === "lat" || name === "long") {
        return {
          ...prevDocument,
          coordinates: {
            ...prevDocument.coordinates,
            [name]: value || "",
          },
        };
      } else {
        return {
          ...prevDocument,
          [name]: name === "nValue" ? parseInt(value, 10) || "" : value,
        };
      }
    });
  };

  const handleMapClick = (lat, lng) => {
    setPosition({ lat, lng });
    setDocument((prevDocument) => ({
      ...prevDocument,
      coordinates: { lat, long: lng },
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
    if (!document.issuanceDate) {
      newErrors.issuanceDate =
        "You must select a Date in a valid format (YYYY or YYYY-MM or YYYY-MM-DD).";
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
    setDocument((prevDocument) => {
      return {
        ...prevDocument,
        coordinates: {
          ...prevDocument.coordinates,
          lat: parseFloat(prevDocument.coordinates.lat) || 0,
          long: parseFloat(prevDocument.coordinates.long) || 0,
        },
      };
    });
    const newErrors = {};
    if (
      (document.coordinates.lat || document.coordinates.long) &&
      !validateCoordinates(Number(document.coordinates.lat), Number(document.coordinates.long))
    ) {
      newErrors.coordinates = "Please enter a valid LATITUDE and LONGITUDE or select from the map.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    console.log("step", step);
    let isValid = false;
    if (step === 1) {
      console.log("step1");
      isValid = validateStep1();
    } else if (step === 2) {
      console.log("step2");
      isValid = validateStep2();
    } else if (step === 3) {
      console.log("step3");
      isValid = validateStep3();
    }
    if (isValid) {
      setStep((prev) => prev + 1);
    }
    console.log("isValid", step);
  };

  const handlePreviousStep = () => setStep((prev) => prev - 1);

  const validatePages = (value) => {
    if (!value) {
      // Campo vuoto è accettato
      return true;
    }

    const singleNumberRegex = /^\d+$/; // Controlla un singolo numero
    const rangeRegex = /^\d+\s*-\s*\d+$/; // Controlla un range con un trattino

    if (singleNumberRegex.test(value)) {
      // Caso: valore singolo
      document.pages = parseInt(value, 10); // Salva come numero
      document.pageFrom = "";
      document.pageTo = "";
      return true;
    } else if (rangeRegex.test(value)) {
      // Caso: range con trattino
      const [start, end] = value.split("-").map((num) => parseInt(num.trim(), 10));
      if (start < end) {
        document.pages = "";
        document.pageFrom = start;
        document.pageTo = end;
        return true;
      } else {
        return false; // Errore se il range è invalido (es. 45-35)
      }
    } else {
      return false; // Input non valido
    }
  };

  const [position, setPosition] = useState({ lat: null, lng: null });
  useEffect(() => {
    if (position.lat && position.lng) {
      document.coordinates.lat = position.lat;
      document.coordinates.long = position.lng;
    }
  }, [position.lat, position.lng]);

  useEffect(() => {
    if (
      document.coordinates.lat &&
      document.coordinates.long &&
      validateCoordinates(Number(document.coordinates.lat), Number(document.coordinates.long))
    ) {
      setPosition({ lat: document.coordinates.lat, lng: document.coordinates.long });
    } else if (
      document.coordinates.lat &&
      document.coordinates.long &&
      !validateCoordinates(Number(document.coordinates.lat), Number(document.coordinates.long))
    ) {
      setPosition({ lat: null, lng: null });
    }
  }, [document.coordinates.lat, document.coordinates.long]);

  const handleFileUpload = async (doc) => {
    if (files.length > 0) {
      files.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
          await API.uploadFiles(doc.id, formData);
        } catch (error) {
          props.setError(error);
        }
      });
    }
  };

  const removeExistingFile = (attachmentId) => {
    setFilesToBeDeleted([...filesToBeDeleted, attachmentId]);
    setExistingAttachments(existingAttachments.filter((file) => file.id !== attachmentId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (document.scale === "1:n") {
        document.scale = document.nValue;
      } else {
        document.nValue = "";
      }
      if (id) {
        // Modalità Edit: aggiorna documento esistente
        await API.updateDocument(id, document);
        //Add new files and delete files
        handleFileUpload(document);
        filesToBeDeleted.forEach(async (attachmentId) => {
          try {
            await API.deleteAttachment(id, attachmentId);
          } catch (error) {
            console.error("Error deleting attachment:", error);
            props.setError(error);
          }
        });
        resetState();
        navigate(`/documents/all`);
      } else if (step === 4) {
        const doc = await API.saveDocument(document);
        //Try to submit files
        handleFileUpload(doc);
        props.setNewDoc(doc);
        resetState();
        navigate(`/documents/links`);
      }
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
    // if (newType.trim() !== "") {
    //   const newEntry = { name: newType };
    //   setCurrentTypes([...currentTypes, newEntry]); // Aggiungi il nuovo tipo
    //   setIsAddingNewType(false); // Nascondi il campo di input
    //   handleChange({ target: { name: "type", value: newType } }); // Aggiorna il valore selezionato
    //   setNewType(""); // Resetta il campo di input
    // }
  };

  return (
    <div className="documents-background">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "700px" }}>
          <Card.Body>
            <Card.Title dataTest="form" className="mb-4 text-center">
              {id ? `EDIT DOCUMENT: ${id}` : "ADD NEW DOCUMENT"}
            </Card.Title>
            {/* Step Indicator with Clickable Buttons */}
            <div style={{ textAlign: "center", padding: "20px" }}>
              <StepIndicator
                step={step}
                setStep={setStep}
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
            </div>
            <Form onSubmit={handleSubmit}>
              {step === 1 && (
                <Step1
                  document={document}
                  errors={errors}
                  handleChange={handleChange}
                  currentStakeholders={currentStakeholders}
                  isAddingNew={isAddingNew}
                  newStakeholder={newStakeholder}
                  handleNewStakeholderChange={handleNewStakeholderChange}
                  handleNewBlur={handleNewBlur}
                  handleSelectChange={handleSelectChange}
                  stakeholders={stakeholders}
                />
              )}
              {step === 2 && (
                <Step2
                  document={document}
                  errors={errors}
                  handleChange={handleChange}
                  handleScaleChange={handleScaleChange}
                  handleSelectChange={handleSelectChange}
                  handleNewTypeChange={handleNewTypeChange}
                  scales={scales}
                  currentTypes={currentTypes}
                  isAddingNewType={isAddingNewType}
                  newType={newType}
                  showNField={showNField}
                />
              )}
              {step === 3 && (
                <Step3
                  document={document}
                  errors={errors}
                  handleChange={handleChange}
                  handleMapClick={handleMapClick}
                  position={position}
                  setPosition={setPosition}
                  polygonCoordinates={polygonCoordinates}
                  validateCoordinates={validateCoordinates}
                />
              )}
              {step === 4 && (
                <Step4
                  handleFileChange={handleFileChange}
                  removeFile={removeFile}
                  files={files}
                  existingAttachments={existingAttachments}
                  removeExistingFile={removeExistingFile}
                />
              )}
              <div className="mt-4">
                <Row>
                  <Col md={6}>
                    {step > 1 && (
                      <Button className="btn-back" variant="secondary" onClick={handlePreviousStep}>
                        Back
                      </Button>
                    )}
                  </Col>
                  <Col md={6}>
                    {step < 4 ? (
                      <Button className="btn-save" variant="primary" onClick={handleNextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button className="btn-save" variant="success" onClick={handleSubmit}>
                        Submit
                      </Button>
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
