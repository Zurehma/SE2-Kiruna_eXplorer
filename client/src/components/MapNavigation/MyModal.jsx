import React, { useState } from 'react';
import { Button, Modal, Form,Row,Col } from 'react-bootstrap';


function MyModal(props){ 
    const [show, setShow] = useState(false); // State for the modal
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

    const handleSelect = (doc) => {
        setShow(false); 
        props.setSelectedDoc(doc); 
        props.setRenderNumeber(renderNumber+1);
    };
    // Filter documents inside the modal
    const filteredDocuments = props.noCoordDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <>
        {/* Show documents without coordinates with a button that opens a modal */}
        <Button variant="light" onClick={() => setShow(true)} className={props.classNameEntireMunicipality}>
            <i className="bi bi-folder2-open me-1"></i> Entire municipality
        </Button>
        <Modal show={show} onHide={() => setShow(false)} size="lg" centered className="modal-dialog-scrollable">
            <Modal.Header closeButton>
            <Modal.Title>
                <i className="bi bi-folder2-open me-2"></i> Documents
            </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
            {/* Barra di ricerca */}
            <Form.Control
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
            />
            {/* Lista dei documenti */}
            {filteredDocuments.length > 0 ? (
                <ul className="list-group">
                {filteredDocuments.map((doc) => (
                    <li
                    key={doc.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => handleSelect(doc)}
                    style={{ cursor: "pointer" }}
                    >
                    <span>
                        <Row className="align-items-center">
                            <Col xs={2} >
                            <i className={`bi ${props.iconMap[doc.type]} me-2`} style={{ fontSize: '18px' }}></i>
                            </Col>
                            <Col xs={10}>
                                {doc.title}
                            </Col>
                        </Row>   
                    </span>
                    <i className="bi bi-arrow-right-circle-fill"></i>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="text-muted text-center py-3">No documents available</div>
            )}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)} style={{ backgroundColor: "#006d77" }}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default MyModal;