import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Modal, Dropdown, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../API.js";
import "../styles/Links.css";

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");
    return (
      <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
        <Form.Control
          autoFocus
          className="search-bar"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) => !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

function Links(props) {
  const [documents, setDocuments] = useState([]);
  const [typeLink, setTypeLink] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [linkedDocuments, setLinkedDocuments] = useState([]);
  const navigate = useNavigate();
  const [linkData, setLinkData] = useState({
    document1: "",
    document2: [],
    linkType: "",
  });

  const [errors, setErrors] = useState({
    document1: "",
    document2: "",
    linkType: "",
    err: "",
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.getDocuments(undefined, true);
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

  useEffect(() => {
    if (linkData.document1 && linkData.linkType) {
      const fetchLinkedDocuments = async () => {
        try {
          const linkedResponse = await API.getLinksDoc(linkData.document1);

          // Filtra i documenti per tipo e rimuovi quelli già linkati
          const filteredLinkedDocs = linkedResponse
            .filter((doc) => doc.type === linkData.linkType) // Filtro per tipo
            .map((doc) => doc.linkedDocID); // Prendo solo gli ID dei documenti

          setLinkedDocuments(filteredLinkedDocs);

          console.log("gggggggg:", filteredLinkedDocs);

          // Setta i documenti filtrati
          setLinkedDocuments(filteredLinkedDocs);
        } catch (error) {
          console.error("Error fetching linked documents:", error);
        }
      };

      fetchLinkedDocuments();
    } else {
      setLinkedDocuments([]);
    }
  }, [linkData.document1, linkData.linkType]);

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
      setSaveStatus("Completed");
      setLinkData({ document1: "", document2: [], linkType: "" });
      props.setNewDoc("");
    } catch (error) {
      if (error.message === "Conflict") {
        setErrors({ err: "The link already exists." });
      }
      setSaveStatus("Not Completed");
      setShowModal(true);
    }
  };

  const handleNewLink = () => {
    setShowModal(false);
    setLinkData({ document1: "", document2: [], linkType: "" });
  };

  const handleClose = () => navigate("/graph");

  const handleDocument1Change = (docId) => {
    setLinkData({
      document1: docId,
      linkType: "",
      document2: [],
    });
  };

  const handleLinkTypeChange = (type) => {
    setLinkData((prevLinkData) => ({
      ...prevLinkData,
      linkType: type,
      document2: [], // Reset document2 when linkType changes
    }));
  };

  const handleDocument2Toggle = (docId) => {
    setLinkData((prevLinkData) => ({
      ...prevLinkData,
      document2: prevLinkData.document2.includes(docId)
        ? prevLinkData.document2.filter((id) => id !== docId)
        : [...prevLinkData.document2, docId],
    }));
  };

  return (
    <div className="links-background">
      <Container className="links-container d-flex align-items-top justify-content-center min-vh-100">
        <Card
          className="p-4 shadow-lg w-100"
          style={{ maxWidth: "700px", maxHeight: "650px", marginTop: "50px" }}
        >
          <Card.Body>
            <Card.Title className="links-card-title">ADD NEW LINK</Card.Title>
            <div className="step-button">
              <i class="bi bi-share-fill"></i>
              LINK STEP
            </div>

            <Form className="cd-body">
              {/* Document 1 */}
              <Row className="mb-3">
                <Col className="mb-3">
                  <Form.Group controlId="document1" className="links-form-group">
                    <Form.Label className="links-form-label">Document 1*</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" className="form-select">
                        {documents.find((doc) => doc.id === Number(linkData.document1))?.title ||
                          "Select Document 1"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {documents.map((doc) => (
                          <Dropdown.Item key={doc.id} onClick={() => handleDocument1Change(doc.id)}>
                            {doc.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {errors.document1 && (
                      <div className="invalid-feedback d-block">{errors.document1}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Link Type */}
              <Row className="mb-3">
                <Col className="mb-3">
                  <Form.Group controlId="linkType" className="links-form-group">
                    <Form.Label className="links-form-label">Link Type*</Form.Label>
                    <Form.Select
                      name="linkType"
                      value={linkData.linkType}
                      onChange={(e) => handleLinkTypeChange(e.target.value)}
                      isInvalid={!!errors.linkType}
                      disabled={!linkData.document1}
                    >
                      <option value="">Select a type of Link</option>
                      {typeLink.map((type, index) => (
                        <option key={index} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.linkType}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Document 2 */}
              <Row className="mb-3">
                <Col className="mb-3">
                  <Form.Group controlId="document2" className="links-form-group">
                    <Form.Label className="links-form-label">Document 2*</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        className="form-select"
                        disabled={!linkData.linkType}
                      >
                        {linkData.document2.length > 0
                          ? `${linkData.document2.length} Documents Selected`
                          : "Select Documents"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu as={CustomMenu}>
                        {documents
                          .filter(
                            (doc) =>
                              !linkedDocuments.includes(doc.id) && doc.id !== linkData.document1
                          ) // Filtro per rimuovere anche linkData.document1
                          .map((doc) => (
                            <Dropdown.Item
                              key={doc.id}
                              onClick={() => handleDocument2Toggle(doc.id)}
                            >
                              {linkData.document2.includes(doc.id) ? "✓ " : ""}
                              {doc.title}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {errors.document2 && (
                      <div className="invalid-feedback d-block">{errors.document2}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Save Button */}
              <div className="text-center mt-5">
                <Button variant="primary" onClick={handleSaveLinks} className="btn-save">
                  Save Link
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className="links-modal-title">
              {saveStatus === "Completed" ? "Success" : "Error"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="links-modal-body">
            {saveStatus === "Completed"
              ? "Link saved successfully!"
              : `Failed to save the link. ${errors.err || ""}`}
          </Modal.Body>
          <Modal.Footer>
            {saveStatus === "Completed" ? (
              <Button variant="primary" onClick={handleNewLink} className="btn-saveLink">
                Save New Link
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNewLink} className="btn-saveLink">
                Try again!
              </Button>
            )}
            <Button variant="secondary" onClick={handleClose}>
              Go to Graph
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Links;
