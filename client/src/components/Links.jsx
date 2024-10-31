import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import API from '../../API.js';
import { useParams } from 'react-router-dom';

function Links() {
  const { newId } = useParams(); // Ottiene l'ID del nuovo documento
  const [documents, setDocuments] = useState([]);
  const [linkData, setLinkData] = useState({
    document1: newId, // Preseleziona il nuovo documento come document1
    document2: '',
    linkType: 'Condiviso'
  });

  useEffect(() => {
    // Recupera la lista di documenti dal backend
    const fetchDocuments = async () => {
      try {
        const response = await API.getDocuments();
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

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
      alert("Links saved successfully!");
    } catch (error) {
      console.error("Error saving links:", error);
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Save Links</Card.Title>
          <Form>
            <Form.Group controlId="document1" className="mb-3">
              <Form.Label>Select Document 1</Form.Label>
              <Form.Control 
                as="select" 
                name="document1" 
                value={linkData.document1} 
                onChange={handleChange}
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="document2" className="mb-3">
              <Form.Label>Select Document 2</Form.Label>
              <Form.Control 
                as="select" 
                name="document2" 
                value={linkData.document2} 
                onChange={handleChange}
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="linkType" className="mb-3">
              <Form.Label>Link Type</Form.Label>
              <Form.Control 
                as="select" 
                name="linkType" 
                value={linkData.linkType} 
                onChange={handleChange}
              >
                <option value="Condiviso">Condiviso</option>
                <option value="Nuovo">Nuovo</option>
                <option value="Alternativo">Alternativo</option>
              </Form.Control>
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" onClick={handleSaveLinks}>
                Save Links
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Links;
