import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import '../styles/Links.css';


function Links(props) {
  const [documents, setDocuments] = useState([]); 
  const [typeLink, setTypeLink] = useState([]);  

  const [linkData, setLinkData] = useState({
    document1: '',
    //     document1: props.newDoc.id || '',
    document2: '',
    linkType: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.getDocuments();
        setDocuments(response);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkData((prevLinkData) => ({
      ...prevLinkData,
      [name]: value,
    }));
  };

  const handleSaveLinks = async () => {
    console.log('yyooooo', linkData);

    try {
      await API.setLink(linkData);
      console.log('Completed', linkData);
      setShowModal(true);
      setSaveStatus('Completed');
      setLinkData({ document1: '', document2: '', linkType: '' });
      console.log('Compl', linkData);
      // props.setNewDoc = '';
      // props.newDoc = '';
    } catch (error) {
      console.log('Ebooooooo');
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
                  >
                    {!props.newDoc && <option value="">Select Document 1</option>}
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
                    <option key={type.id} value={type.id}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="text-center  mt-5">
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
