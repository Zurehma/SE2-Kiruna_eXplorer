import React, { useState, useEffect, useMemo } from "react";
import {Container,Row,Col,Form,InputGroup,Spinner,Card,Offcanvas,Button,Alert,} 
from "react-bootstrap";
import Filters from "./Filters/Filters.jsx";
import { MyPopup } from "./MyPopup";
import "../styles/Filtering.css";
import API from "../../API.js";

const FilteringDocuments = (props) => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 3; // Number of documents per page

  // Debounce search input to optimize API calls
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPageNo(1); // Reset to first page on search
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Combine filters and searchQuery using useMemo to prevent unnecessary re-renders
  const combinedFilters = useMemo(() => ({
    ...filters,
    title: debouncedSearch || undefined, // Use undefined to exclude from query params if empty
  }), [filters, debouncedSearch]);

  // Function to fetch documents from API
  const fetchDocuments = async (currentPage) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const params = {
        ...combinedFilters,
        pageNo: currentPage,limit
      };

      // Remove undefined or empty string values
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
      );

      const response = await API.getDocuments(filteredParams);

      // Validate response structure
      if (
        response &&
        typeof response.pageNo === "number" &&
        typeof response.totalPages === "number" &&
        Array.isArray(response.elements)
      ) {
        setDocuments(response.elements);
        setPageNo(response.pageNo);
        setTotalPages(response.totalPages);
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to fetch documents. Please try again later.");
      setDocuments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents whenever combinedFilters or pageNo changes
  useEffect(() => {
    fetchDocuments(pageNo);
  }, [combinedFilters, pageNo]); // Removed ESLint disable

  // Handle filter changes
  const handleFiltersUpdate = (newFilters) => {
    setFilters(newFilters);
    setPageNo(1); // Reset to first page on filter change
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNo(newPage);
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
              <Filters setFilters={handleFiltersUpdate} onLoadingChange={setLoading} />
              <Button
                id="close-button-resp"
                onClick={() => setShowFilters(false)}
                className="mt-3"
              >
                Close Filtering
              </Button>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>

        {/* Sidebar Filters (Desktop) */}
        <Col md={3} className="d-none d-md-block sidebar-section">
          <Card className="filter-card">
            <Card.Body>
              <h5 className="filter-title">Filter Documents</h5>
              <Filters setFilters={handleFiltersUpdate} onLoadingChange={setLoading} />
            </Card.Body>
          </Card>
        </Col>

        {/* Results Section */}
        <Col xs={12} md={9} className="filtered-result">
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <div className="search-section-modern">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-modern"
              />
              {searchQuery && (
                <Button variant="outline-secondary" onClick={() => setSearchQuery("")}>
                  <i className="bi bi-x-lg"></i>
                </Button>
              )}
            </InputGroup>
          </div>

          {/* Documents List */}
          <div className="documents-list mt-2">
            <h4 className="text-center">PAGE {pageNo} of {totalPages}</h4>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <MyPopup key={doc.id} doc={doc} loggedIn={props.loggedIn} />
              ))
            ) : (
              <p className="text-center">No documents found</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls text-center mt-3">
              <Row className="mt-3">
                <Col className="text-center d-flex justify-content-center align-items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handlePageChange(pageNo - 1)}
                    disabled={pageNo === 1}
                    className="btn-page"
                  >
                    Previous
                  </Button>
                  <span>
                    Page {pageNo} of {totalPages}
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => handlePageChange(pageNo + 1)}
                    disabled={pageNo === totalPages}
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
