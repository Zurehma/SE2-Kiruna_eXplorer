import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup, Spinner, Card, Offcanvas, Button } from "react-bootstrap";
import { MyPopup } from "./MyPopup";
import "../styles/Filtering.css";
import Filters from "./Filters/Filters.jsx"; // Import the new Filters component

const FilteringDocuments = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const limit = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    const actualnum = newPage * limit;
    if (newPage >= 0 && actualnum < totalDocuments) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Container fluid className="mt-4" style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        {/* Responsive Filters Toggle */}
        <Col xs={12} className="d-md-none text-end mb-3">
          <i
            className="bi bi-funnel text-black cursor-pointer"
            style={{ fontSize: "30px" }}
            onClick={() => setShowFilters(true)}
          />
          <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filter Documents</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Filters
                limit={limit}
                currentPage={currentPage}
                onLoadingChange={setLoading}
                onDocumentsUpdate={(newDocs, total) => {
                  setDocuments(newDocs);
                  setTotalDocuments(total);
                }}
              />
              <Button
                id="close-button-resp"
                onClick={() => {
                  setShowFilters(false);
                }}
              >
                Close filtering page
              </Button>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>

        {/* Sidebar Filters (Desktop) */}
        <Col md={3} className="d-none d-md-block sidebar-section">
          <Card className="filter-card">
            <Card.Body>
              <h5 className="filter-title">Filter Documents</h5>
              <Filters
                limit={limit}
                currentPage={currentPage}
                onLoadingChange={setLoading}
                onDocumentsUpdate={(newDocs, total) => {
                  setDocuments(newDocs);
                  setTotalDocuments(total);
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Results Section */}
        <Col xs={12} md={9} className="filtered-result">
          <div className="search-section-modern">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input-modern"
              />
              <div className="icons-container">
                <i className="bi bi-x-lg clear-icon" onClick={() => setSearchQuery("")}></i>
              </div>
            </InputGroup>
          </div>

          <div className="documents-list mt-2">
            <h4 className="text-center">PAGE {currentPage + 1}</h4>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : filteredDocs.length > 0 ? (
              filteredDocs.map((doc, index) => (
                <MyPopup key={index} doc={doc} loggedIn={props.loggedIn} />
              ))
            ) : (
              <p>No documents found</p>
            )}
          </div>

          {/* Pagination */}
          {totalDocuments > 0 && (
            <div className="pagination-controls text-center mt-3">
              <Row className="mt-3">
                <Col className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="btn-page"
                  >
                    Previous
                  </Button>
                  <span>Page {currentPage + 1}</span>
                  <Button
                    variant="primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={(currentPage + 1) * limit >= totalDocuments}
                    className="btn-page"
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FilteringDocuments;
