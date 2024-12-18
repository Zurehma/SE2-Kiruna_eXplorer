import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Card,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { MyPopup } from "./MyPopup";
import "../styles/Filtering.css";
import Filters from "./Filters/Filters.jsx"; // Import the new Filters component

const FilteringDocuments = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentSearchQuery, setSentSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [reload, setReload] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const executeSearch = () => {
    setSentSearchQuery(searchQuery);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="viewall-background">
      <Container fluid className="mt-4">
        <Row style={{ height: "100%" }}>
          {/* Mobile Filters */}
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
                  setDocuments={setDocuments}
                  onSetLoading={setLoading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setTotalPages={setTotalPages}
                  searchQuery={sentSearchQuery}
                  reload={reload}
                />
                <Button id="close-button-resp" onClick={() => setShowFilters(false)}>
                  Close filtering page
                </Button>
              </Offcanvas.Body>
            </Offcanvas>
          </Col>

          {/* Desktop Filters */}
          <Col md={3} className="d-none d-md-block sidebar-section">
            <Card className="filter-card">
              <Card.Body>
                <h5 className="filter-title">Filter Documents</h5>
                <Filters
                  setDocuments={setDocuments}
                  onSetLoading={setLoading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setTotalPages={setTotalPages}
                  searchQuery={sentSearchQuery}
                  reload={reload}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Results Section */}
          <Col xs={12} md={9} className="filtered-result">
            {/* Search Bar */}
            <div className="mt-3">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="searchbar"
                />
                <Button onClick={executeSearch} className="search-btn">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </div>

            {/* Documents List */}
            <div className="documents-list mt-2">
              {/* Top Pagination */}
              {documents?.length > 0 && (
                <div className="pagination-controls text-center mt-3 mb-3">
                  <Row className="mt-3 mb-3">
                    <Col className="text-center">
                      <Button
                        variant="primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="btn-page me-2"
                      >
                        Previous
                      </Button>
                      <span className="myPageColor">Page {currentPage + 1}</span>
                      <Button
                        variant="primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                        className="btn-page ms-2"
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Loading and Documents Display */}
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : documents?.length > 0 ? (
                documents.map((doc, index) => (
                  <div key={index} className="popupFiltering">
                    <MyPopup
                      key={index}
                      doc={doc}
                      loggedIn={props.loggedIn}
                      reload={reload}
                      setReload={setReload}
                    />
                  </div>
                ))
              ) : (
                <p>No documents found</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FilteringDocuments;
