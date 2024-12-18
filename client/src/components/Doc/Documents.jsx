import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../API.js";
import "../../styles/Documents.css";
import "leaflet/dist/leaflet.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";
import PropTypes from "prop-types";

function Documents(props) {
  const scales = ["Text", "Blueprints/Effects", "1:n"];
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [filesToBeDeleted, setFilesToBeDeleted] = useState([]);
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [types, setTypes] = useState([]);
  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState([]);
  const [position, setPosition] = useState({ type: null, coordinates: null, name: null });
  const [error, setError] = useState(null);

  const [document, setDocument] = useState({
    title: "",
    stakeholders: "",
    scale: "",
    nValue: "",
    issuanceDate: "",
    type: "",
    newType: "",
    description: "",
    language: "",
    pages: "",
    coordinates: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    stakeholders: "",
    scale: "",
    nValue: "",
    issuanceDate: "",
    type: "",
    language: "",
    coordinates: "",
    description: "",
    pages: "",
    newType: "",
  });

  const resetState = () => {
    setDocument(() => ({
      title: "",
      stakeholders: "",
      scale: "",
      nValue: "",
      newType: "",
      issuanceDate: "",
      type: "",
      description: "",
      language: "",
      pages: "",
      coordinates: "",
    }));
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await API.getStakeholders();
        const formattedStakeholders = response.map((stakeholders) => ({
          value: stakeholders.name,
          label: stakeholders.name,
          isNew: false, // Indica che è predefinito
        }));
        setStakeholdersList(formattedStakeholders);
        const response2 = await API.getTypeDocuments();
        setTypes(response2);
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
      const coordinates = doc.coordinates;
      let scale = doc.scale;
      let nValue = "";
      if (scale !== "Text" && scale !== "Blueprints/Effects") {
        nValue = Number(scale);
        scale = `1:n`;
      }
      // Aggiorna gli stakeholders selezionati
      const selected = (doc.stakeholders || []).map((stakeholders) => ({
        value: stakeholders,
        label: stakeholders,
        isNew: false,
      }));
      setSelectedStakeholders(selected); // Imposta lo stato

      // Aggiorna il documento
      setDocument((prevDocument) => ({
        ...doc,
        coordinates,
        scale,
        nValue,
      }));

      if (coordinates?.lat && coordinates?.long) {
        setPosition({ coordinates: coordinates, type: "Point" });
      } else if (coordinates && coordinates.length > 3) {
        setPosition({ coordinates: coordinates, type: "Area" });
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Error fetching document");
    }
  };

  const fetchAttachments = async (documentId) => {
    try {
      const attachments = await API.getAttachments(documentId);
      setExistingAttachments(attachments);
    } catch (error) {
      setError("Error fetching document");
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

  const handleAddNew = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => {
      if (name === "scale") {
        return {
          ...prevDocument,
          scale: value,
          nValue: value === "1:n" ? prevDocument.nValue || "" : undefined, // Resetta nValue se non è `1:n`
        };
      }
      if (name === "type") {
        return {
          ...prevDocument,
          type: value,
          newType: value === "add_new_type" ? prevDocument.newType || "" : undefined, // Resetta newType se non è `add_new_type`
        };
      }
      return prevDocument;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => {
      if (name === "lat" || name === "long") {
        return {
          ...prevDocument,
        };
      } else {
        return {
          ...prevDocument,
          [name]: name === "nValue" ? parseInt(value, 10) || "" : value,
        };
      }
    });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!document.title || document.title.length < 2) {
      newErrors.title = "Title is required and cannot be empty.";
    }
    if (!document.stakeholders || document.stakeholders.length === 0) {
      newErrors.stakeholders = "You must select at least one stakeholder.";
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
    if (document.scale == "1:n" && !document.nValue) {
      newErrors.nValue = "You must insert a number or select another scale.";
    }
    if (!document.type) {
      newErrors.type = "You must select a type.";
    }
    if (document.type == "add_new_type" && document.newType.length < 2) {
      newErrors.newType = "You must insert a new type or select one from the menu.";
    }
    if (!document.issuanceDate) {
      newErrors.issuanceDate =
        "You must select a Date in a valid format (YYYY or YYYY-MM or YYYY-MM-DD).";
    }
    if (!document.language) {
      newErrors.language = "You must select a language.";
    }
    if (document.pages && !validatePages(document.pages)) {
      newErrors.pages = "Please enter a valid number of page (e.g., 35 or 1-35).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => true;

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
      setStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => setStep((prev) => prev - 1);

  const validatePages = (value) => {
    if (!value) {
      return true;
    }
    // Espressione regolare per accettare un singolo numero o più numeri separati da trattini senza spazi
    const pagesRegex = /^(\d+)(-\d+)*$/;
    if (pagesRegex.test(value)) {
      document.pages = value;
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (position.coordinates) {
      document.coordinates = position.coordinates;
    }
  }, [position.coordinates, position.type]);

  const handleFileUpload = async (doc) => {
    if (files.length > 0) {
      files.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
          await API.uploadFiles(doc.id, formData);
        } catch (error) {
          setError("Error saving document:");
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
      if (document.type === "add_new_type") {
        document.type = document.newType;
      } else {
        document.newType = "";
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
            setError("Error deleting attachment");
          }
        });
        resetState();
        navigate(-1);
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
      setError("Error saving document:");
    }
  };

  ///////STAKEHOLDERS///////

  //Gestisce la selezione degli stakeholders
  const handleStake = (selectedOptions) => {
    // Trova le opzioni rimosse
    const removedOptions = selectedStakeholders.filter(
      (opt) => !(selectedOptions || []).some((sel) => sel.value === opt.value)
    );
    // Rimuove solo quelli creati manualmente
    const removedNewOptions = removedOptions.filter((opt) => opt.isNew);
    if (removedNewOptions.length > 0) {
      setStakeholdersList((prev) =>
        prev.filter(
          (stakeholders) =>
            !removedNewOptions.some((removed) => removed.value === stakeholders.value)
        )
      );
    }
    // Aggiorna le opzioni selezionate
    setSelectedStakeholders(selectedOptions || []);

    // Aggiorna document.stakeholder
    handleChange({
      target: {
        name: "stakeholders",
        value: selectedOptions?.map((opt) => opt.value) || [],
      },
    });
  };

  // Aggiunge un nuovo stakeholder
  const handleCreate = (inputValue) => {
    const newStakeholder = { value: inputValue, label: inputValue, isNew: true };
    setStakeholdersList((prev) => [...prev, newStakeholder]);
    setSelectedStakeholders((prev) => [...prev, newStakeholder]);

    // Salva nel documento
    setDocument((prevDoc) => ({
      ...prevDoc,
      stakeholders: [...selectedStakeholders, newStakeholder].map((opt) => opt.value),
    }));
  };

  return (
    <div className="documents-background">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        {error && (
          <Alert
            variant="danger"
            className="fixed-top mt-3"
            style={{ zIndex: 150000000000 }}
            dismissible
            onClose={() => setError(null)}
          >
            <p>{error}</p>
          </Alert>
        )}
        <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "700px" }}>
          <Card.Body>
            <Card.Title className="mb-4 text-center">
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
                  handleStake={handleStake}
                  handleCreate={handleCreate}
                  stakeholdersList={stakeholdersList}
                  selectedStakeholders={selectedStakeholders}
                />
              )}
              {step === 2 && (
                <Step2
                  document={document}
                  errors={errors}
                  handleChange={handleChange}
                  handleAddNew={handleAddNew}
                  scales={scales}
                  types={types}
                />
              )}
              {step === 3 && (
                <Step3
                  document={document}
                  errors={errors}
                  handleChange={handleChange}
                  position={position}
                  setPosition={setPosition}
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

Documents.propTypes = {
  setError: PropTypes.func,
  setNewDoc: PropTypes.func,
};

export default Documents;
