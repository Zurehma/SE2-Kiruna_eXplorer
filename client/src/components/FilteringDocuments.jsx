import React, { useState, useEffect } from "react";
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
import API from "../../API";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import modern calendar styles
import "../styles/Filtering.css";
import { format } from "date-fns";

const FilteringDocuments = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSingleDate, setIsSingleDate] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 3; // Numero massimo di documenti per pagina
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0); // Totale documenti

  // Lists fetched from the backend
  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);

  const formatDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

  // Fetch stakeholders and document types from the backend
  const fetchDefaultLists = async () => {
    try {
      const [stakeholders, documentTypes] = await Promise.all([
        API.getStakeholders(),
        API.getDocumentTypes(),
      ]);
      setStakeholdersList(stakeholders);
      setDocumentTypesList(documentTypes);
    } catch (error) {
      console.error("Error fetching stakeholders or document types:", error);
    }
  };

  // Fetch filtered documents from the backend
  const fetchFilteredDocuments = async () => {
    setLoading(true);

    if (!totalDocuments) {
      const filters = {
        type: documentType || undefined,
        stakeholder: stakeholder || undefined,
        issuanceDateFrom: isSingleDate ? formatDate(selectedDate) : formatDate(startDate),
        issuanceDateTo: isSingleDate ? formatDate(selectedDate) : formatDate(endDate),
      };
      // Remove undefined or empty filter values
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
      );
      try {
        const response = await API.filterDocuments(filteredParams);
        setTotalDocuments(response.length);
      } catch (error) {
        console.error("Error fetching filtered documents from backend:", error);
      }
    }

    const filters = {
      type: documentType || undefined,
      stakeholder: stakeholder || undefined,
      issuanceDateFrom: isSingleDate ? formatDate(selectedDate) : formatDate(startDate),
      issuanceDateTo: isSingleDate ? formatDate(selectedDate) : formatDate(endDate),
      limit: limit,
      offset: currentPage * limit,
    };

    // Remove undefined or empty filter values
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
    );

    try {
      const response = await API.filterDocuments(filteredParams);
      setDocuments(response);
    } catch (error) {
      console.error("Error fetching filtered documents from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stakeholders, document types, and filtered documents on component mount
  useEffect(() => {
    fetchDefaultLists();
  }, []);

  // Trigger fetching of filtered documents when filter values change
  useEffect(() => {
    console.log("bbbbb");
    fetchFilteredDocuments();
  }, [stakeholder, documentType, selectedDate, startDate, endDate, isSingleDate, currentPage]);

  const handleDateToggle = () => {
    setIsSingleDate(!isSingleDate);
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSingleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleResetDate = () => {
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    const actualnum = currentPage * limit;
    console.log("actualnum", currentPage);
    console.log("totalDocuments", totalDocuments);
    if (newPage >= 0 && actualnum < totalDocuments) {
      setCurrentPage(newPage);
      console.log("dddd");
    }
  };

  return (
    <Container fluid className="mt-4" style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
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
              <Card className="filter-card">
                <Card.Body>
                  <h5 className="filter-title">Filter Documents</h5>

                  {/* Stakeholder Dropdown */}
                  <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
                    <Form.Label>Stakeholder</Form.Label>
                    <Form.Control
                      as="select"
                      value={stakeholder}
                      onChange={(e) => setStakeholder(e.target.value)}
                      className="filter-input"
                    >
                      <option value="">All Stakeholders</option>
                      {stakeholdersList.map((stakeholderItem, index) => (
                        <option key={index} value={stakeholderItem.name}>
                          {stakeholderItem.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Document Type Dropdown */}
                  <Form.Group controlId="sidebarFilterDocumentType" className="mt-3">
                    <Form.Label>Document Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="filter-input"
                    >
                      <option value="">All Document Types</option>
                      {documentTypesList.map((typeItem, index) => (
                        <option key={index} value={typeItem.name}>
                          {typeItem.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Date Selection Toggle */}
                  <Form.Group controlId="sidebarFilterDateType" className="mt-3">
                    <Form.Label className="filter-label">Select Date Type</Form.Label>
                    <div className="custom-toggle-container">
                      <div
                        className={`custom-toggle ${isSingleDate ? "active" : ""}`}
                        onClick={() => setIsSingleDate(true)}
                      >
                        <div className={`toggle-button ${isSingleDate ? "active" : ""}`}></div>
                        <span className="toggle-label">Single Date</span>
                      </div>
                      <div
                        className={`custom-toggle ${!isSingleDate ? "active" : ""}`}
                        onClick={() => setIsSingleDate(false)}
                      >
                        <div className={`toggle-button ${!isSingleDate ? "active" : ""}`}></div>
                        <span className="toggle-label">Date Range</span>
                      </div>
                    </div>
                  </Form.Group>

                  {/* Date Picker with Reset Icon */}
                  <Form.Group controlId="sidebarFilterDate" className="mt-3 position-relative">
                    <Form.Label>{isSingleDate ? "Select Date" : "Select Date Range"}</Form.Label>
                    {isSingleDate ? (
                      <div
                        className="d-flex align-items-center position-relative"
                        style={{ gap: "5px" }}
                      >
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleSingleDateChange}
                          dateFormat="yyyy-MM-dd"
                          className="form-control date-picker-input"
                          placeholderText="Select Date"
                          calendarClassName="custom-calendar"
                          showYearDropdown
                          yearDropdownItemNumber={15}
                          scrollableYearDropdown
                        />
                        {selectedDate && (
                          <i
                            className="bi bi-x-lg"
                            style={{ cursor: "pointer" }}
                            onClick={handleResetDate}
                          ></i>
                        )}
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center position-relative"
                        style={{ gap: "5px" }}
                      >
                        <DatePicker
                          selected={startDate}
                          onChange={handleDateRangeChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          className="form-control date-picker-input"
                          placeholderText="Select Date Range"
                          calendarClassName="custom-calendar-range"
                          showYearDropdown
                          yearDropdownItemNumber={15}
                          scrollableYearDropdown
                        />
                        {(startDate || endDate) && (
                          <i
                            className="bi bi-x-lg"
                            style={{ cursor: "pointer" }}
                            onClick={handleResetDate}
                          ></i>
                        )}
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
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

        <Col md={3} className="d-none d-md-block sidebar-section">
          <Card className="filter-card">
            <Card.Body>
              <h5 className="filter-title">Filter Documents</h5>

              {/* Stakeholder Dropdown */}
              <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
                <Form.Label>Stakeholder</Form.Label>
                <Form.Control
                  as="select"
                  value={stakeholder}
                  onChange={(e) => setStakeholder(e.target.value)}
                  className="filter-input"
                >
                  <option value="">All Stakeholders</option>
                  {stakeholdersList.map((stakeholderItem, index) => (
                    <option key={index} value={stakeholderItem.name}>
                      {stakeholderItem.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Document Type Dropdown */}
              <Form.Group controlId="sidebarFilterDocumentType" className="mt-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Control
                  as="select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="filter-input"
                >
                  <option value="">All Document Types</option>
                  {documentTypesList.map((typeItem, index) => (
                    <option key={index} value={typeItem.name}>
                      {typeItem.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Date Selection Toggle */}
              <Form.Group controlId="sidebarFilterDateType" className="mt-3">
                <Form.Label className="filter-label">Select Date Type</Form.Label>
                <div className="custom-toggle-container">
                  <div
                    className={`custom-toggle ${isSingleDate ? "active" : ""}`}
                    onClick={() => setIsSingleDate(true)}
                  >
                    <div className={`toggle-button ${isSingleDate ? "active" : ""}`}></div>
                    <span className="toggle-label">Single Date</span>
                  </div>
                  <div
                    className={`custom-toggle ${!isSingleDate ? "active" : ""}`}
                    onClick={() => setIsSingleDate(false)}
                  >
                    <div className={`toggle-button ${!isSingleDate ? "active" : ""}`}></div>
                    <span className="toggle-label">Date Range</span>
                  </div>
                </div>
              </Form.Group>

              {/* Date Picker with Reset Icon */}
              <Form.Group controlId="sidebarFilterDate" className="mt-3 position-relative">
                <Form.Label>{isSingleDate ? "Select Date" : "Select Date Range"}</Form.Label>
                {isSingleDate ? (
                  <div
                    className="d-flex align-items-center position-relative"
                    style={{ gap: "5px" }}
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleSingleDateChange}
                      dateFormat="yyyy-MM-dd"
                      className="form-control date-picker-input"
                      placeholderText="Select Date"
                      calendarClassName="custom-calendar"
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                    />
                    {selectedDate && (
                      <i
                        className="bi bi-x-lg"
                        style={{ cursor: "pointer" }}
                        onClick={handleResetDate}
                      ></i>
                    )}
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center position-relative"
                    style={{ gap: "5px" }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateRangeChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      isClearable
                      dateFormat="yyyy-MM-dd"
                      className="form-control date-picker-input"
                      placeholderText="Select Date Range"
                      calendarClassName="custom-calendar-range"
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                    />
                    {(startDate || endDate) && (
                      <i
                        className="bi bi-x-lg"
                        style={{ cursor: "pointer" }}
                        onClick={handleResetDate}
                      ></i>
                    )}
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

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
            <h5 className="text-center">PAGE: {currentPage + 1}</h5>
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

          {/* Paginazione */}
          <div className="pagination-controls text-center mt-3">
            <Button
              variant="primary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="me-2"
            >
              Previous
            </Button>
            <span>Page {currentPage + 1}</span>
            <Button
              variant="primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={(currentPage + 1) * limit >= totalDocuments}
              className="ms-2"
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FilteringDocuments;
