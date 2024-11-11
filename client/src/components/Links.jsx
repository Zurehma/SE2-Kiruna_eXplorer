import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import API from '../../API.js';
import '../styles/Links.css';

function Links(props) {
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [typeLink, setTypeLink] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [linkedDocuments, setLinkedDocuments] = useState([]); // aggiunto per documenti già collegati
  const navigate = useNavigate();
  const [linkData, setLinkData] = useState({
    document1: '',
    document2: [],
    linkType: ''
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.getDocuments();
        setDocuments(response);
        setAllDocuments(response);
        const response2 = await API.getTypeLinks();
        setTypeLink(response2);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();

    if (props.newDoc) {
      setLinkData((prevLinkData) => ({
        ...prevLinkData,
        document1: props.newDoc.id,
      }));
    }
  }, [props.newDoc]);

  // Effettua una chiamata API per ottenere i documenti già collegati quando cambia document1
  useEffect(() => {
    if (linkData.document1) {
      const fetchLinkedDocuments = async () => {
        try {
          const linkedResponse = await API.getLinksDoc(linkData.document1);
          setLinkedDocuments(linkedResponse);
        } catch (error) {
          console.error("Error fetching linked documents:", error);
        }
      };
      fetchLinkedDocuments();
    } else {
      setLinkedDocuments([]); // reset se document1 non è selezionato
    }
  }, [linkData.document1]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkData((prevLinkData) => ({
      ...prevLinkData,
      [name]: value,
      ...(name === "document1" ? { document2: [] } : {}) // resetta document2 quando document1 cambia
    }));
  };

  const [errors, setErrors] = useState({
    document1: '',
    document2: '',
    linkType: '',
    err: '',
  });

  const handleSaveLinks = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!linkData.document1) {
      newErrors.document1 = "You must select a document.";
    }
    if (linkData.document2.length === 0) {
      newErrors.document2 = "You must select at least one document.";
    }
    if (!linkData.linkType) {
      newErrors.linkType = "You must select a type of link.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await API.setLink(linkData);
      setShowModal(true);
      setSaveStatus('Completed');
      setLinkData({ document1: '', document2: [], linkType: '' });
      props.setNewDoc('');
    } catch (error) {
      if (error.message === "Conflict") {
        setErrors({ err: "The link already exists." });
      }
      setSaveStatus('Not Completed');
      setShowModal(true);
    }
  };

  const handleNewLink = () => {
    setShowModal(false);
    setLinkData({ document1: '', document2: [], linkType: '' });
  };

  const handleClose = () => navigate('/');

  return (
    <div className="links-background">
      <Container className="d-flex align-items-top justify-content-center min-vh-100">
        <Card className="card-link p-4 shadow-sm">
          <Card.Body>
            <Card.Title className="links-card-title">ADD NEW LINK</Card.Title>
            <Form>
              <Form.Group controlId="document1" className="links-form-group">
                <Form.Label className="links-form-label">Document 1</Form.Label>
                <Form.Select 
                  name="document1" 
                  value={linkData.document1} 
                  onChange={handleChange}
                  isInvalid={!!errors.document1}
                >
                  {!props.newDoc && <option value="">Select Document 1</option>}
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.document1}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="document2" className="links-form-group">
                <Form.Label className="links-form-label">Document 2</Form.Label>
                <Select
                  name="document2"
                  value={documents.filter(doc => linkData.document2.includes(doc.id)).map(doc => ({ value: doc.id, label: doc.title }))}
                  onChange={(selectedOptions) => setLinkData(prevLinkData => ({
                    ...prevLinkData,
                    document2: selectedOptions.map(option => option.value)
                  }))}
                  options={documents
                    .filter((doc) => doc.id !== Number(linkData.document1) && !linkedDocuments.includes(doc.id))
                    .map((doc) => ({
                      value: doc.id,
                      label: doc.title
                    }))}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isInvalid={!!errors.document2}
                  isDisabled={!linkData.document1} // disabilita se document1 non è selezionato
                />
                <Form.Control.Feedback type="invalid">
                  {errors.document2}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="linkType" className="links-form-group">
                <Form.Label className="links-form-label">Link Type</Form.Label>
                <Form.Select
                  name="linkType" 
                  value={linkData.linkType} 
                  onChange={handleChange}
                  isInvalid={!!errors.linkType}

                >
                  <option value="">Select a type of Link</option>
                  {typeLink.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.linkType}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="text-center mt-5">
                <Button variant="primary" onClick={handleSaveLinks} className="btn-save">Save Link</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className="links-modal-title">
              {saveStatus === 'Completed' ? 'Success' : 'Error'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="links-modal-body">
            {saveStatus === 'Completed' 
              ? 'Link saved successfully!' 
              : `Failed to save the link. ${errors.err || ''}`}
          </Modal.Body>
          <Modal.Footer>
            {saveStatus === 'Completed' ? 
              (
                <Button variant="primary" onClick={handleNewLink} className="btn-saveLink">
                  Save New Link
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNewLink } className="btn-saveLink">
                  Try again!
                </Button>
              )}
            <Button variant="secondary" onClick={handleClose}>
              Go to Home
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Links;
