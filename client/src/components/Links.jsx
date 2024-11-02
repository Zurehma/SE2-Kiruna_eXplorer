import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import '../styles/Links.css';


function Links(props) {
  // const [documents, setDocuments] = useState([]); // Default to empty array
  // const [typeLink, setTypeLink] = useState([]);   // Default to empty array

   //****per test 
   const [documents, setDocuments] = useState([
    { id: 'text', title: 'Text' },
    { id: 'blueprints/effects', title: 'Blueprints/Effects' },
    { id: '1:n', title: 'Ratio 1:n' }
  ]);
  const [typeLink, setTypeLink] = useState([
    { id: 'informative', name: 'Informative' },
    { id: 'infor', name: 'Infor' },
    { id: 'inf', name: 'Inf' },

  ]);
  //****per test 


  const [linkData, setLinkData] = useState({
    document1: props.newId || '',
    document2: '',
    linkType: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // Stato del salvataggio
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera la lista di documenti dal backend
    const fetchDocuments = async () => {
      try {
        // const response = await API.getDocuments();
        // setDocuments(response.data || []);
        // const response2 = await API.getTypeLink();
        // setTypeLink(response2.data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();

    // Imposta `props.newId` come valore iniziale per `document1` se presente
    if (props.newId) {
      setLinkData((prevLinkData) => ({
        ...prevLinkData,
        document1: props.newId,
      }));
    }
  }, [props.newId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkData((prevLinkData) => ({
      ...prevLinkData,
      [name]: value,
    }));
  };

  const handleSaveLinks = async () => {
    try {
      await API.setLink(linkData);
      setSaveStatus('Completed');
      setShowModal(true);
      setLinkData({ document1: '', document2: '', linkType: '' });
      props.newId = ''; // Svuota props.newId
    } catch (error) {
      console.error("Error saving links:", error);
      setSaveStatus('Not Completed');
      setShowModal(true);
    }
  };

  const handleNewLink = () => {
    setShowModal(false);
    setLinkData({ document1: '', document2: '', linkType: '' });
  };

  const handleClose = () => navigate('/');

  return (
    <div className="links-background">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card className="p-4 shadow-sm">
          <Card.Body>
          <Card.Title className="links-card-title">ADD NEW LINK</Card.Title>
          <Form>
          <Form.Group controlId="document1" className="links-form-group">
          <Form.Label className="links-form-label">Document 1</Form.Label>
          <Form.Select 
                name="document1" 
                value={linkData.document1} 
                onChange={handleChange}
              >
                {!props.newId && <option value="">Select Document 1</option>}
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="document2" className="links-form-group">
              <Form.Label className="links-form-label">Document 2</Form.Label>
              <Form.Select
                name="document2" 
                value={linkData.document2} 
                onChange={handleChange}
              >
                <option value="">Select Document 2</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="linkType" className="links-form-group">
              <Form.Label className="links-form-label">Link Type</Form.Label>
              <Form.Select
                name="linkType" 
                value={linkData.linkType} 
                onChange={handleChange}
              >
                <option value="">Select a type of Link</option>
                {typeLink.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-center mt-4">
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
            : 'Failed to save the link.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Go to Home
          </Button>
          {saveStatus === 'Completed' && (
            <Button variant="primary" onClick={handleNewLink}>
              Save New Link
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
}

export default Links;
