import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Offcanvas, Button } from 'react-bootstrap';
import { MyPopup } from './MyPopup';
import API from '../../API';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Filtering.css';
import { format } from 'date-fns';

const FilteringDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stakeholder, setStakeholder] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [isSingleDate, setIsSingleDate] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to format date
  const formatDate = (date) => (date ? format(date, 'dd/MM/yyyy') : null);

  // Fetch documents with filters applied
  const fetchFilteredDocuments = async () => {
    setLoading(true);

    const filters = {
      stakeholder,
      type: documentType,
      date: isSingleDate ? formatDate(dateRange[0]) : null,
      startDate: !isSingleDate ? formatDate(dateRange[0]) : null,
      endDate: !isSingleDate ? formatDate(dateRange[1]) : null,
    };

    try {
      const response = await API.getDocuments(filters);
      setDocuments(response);
    } catch (error) {
      console.error('Error fetching filtered documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchFilteredDocuments();
  }, [stakeholder, documentType, dateRange, isSingleDate]);

  // Handlers for input changes
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleStakeholderChange = (e) => setStakeholder(e.target.value);
  const handleTypeChange = (e) => setDocumentType(e.target.value);
  const handleDateChange = (dates) => setDateRange(dates);
  const handleSingleDateToggle = () => setIsSingleDate(!isSingleDate);

  // Client-side filtering using search query
  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="mt-4" style={{ height: '100vh' }}>
      <Row style={{ height: '100%' }}>
        
        {/* Filter Button for Small Screens */}
        <Col xs={12} className="d-md-none text-right mb-3">
          <i 
            className="bi bi-funnel text-black cursor-pointer " 
            style={{ fontSize: '30px' }} 
            onClick={() => setShowFilters(true)} 
          />
        </Col>

        {/* Left Column (md=3) for Filters - visible on larger screens */}
        <Col md={3} className="d-none d-md-block sidebar-section">
          <h5>Filter Documents</h5>
          <Form>
            {/* Stakeholder Filter */}
            <Form.Group controlId="filterStakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control as="select" value={stakeholder} onChange={handleStakeholderChange}>
                <option value="">All</option>
                <option value="Stakeholder A">Stakeholder A</option>
                <option value="Stakeholder B">Stakeholder B</option>
              </Form.Control>
            </Form.Group>

            {/* Single Date or Date Range Toggle */}
            <Form.Group controlId="filterDateType" className="mt-3">
              <Form.Check
                type="radio"
                label="Single Date"
                checked={isSingleDate}
                onChange={handleSingleDateToggle}
              />
              <Form.Check
                type="radio"
                label="Date Range"
                checked={!isSingleDate}
                onChange={handleSingleDateToggle}
              />
            </Form.Group>

            {/* Date Picker */}
            <Form.Group controlId="filterDate" className="mt-3">
              <Form.Label>{isSingleDate ? 'Select Date' : 'Select Date Range'}</Form.Label>
              <DatePicker
                selected={dateRange[0]}
                onChange={handleDateChange}
                startDate={dateRange[0]}
                endDate={isSingleDate ? null : dateRange[1]}
                selectsRange={!isSingleDate}
                isClearable
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText={isSingleDate ? 'Select Date' : 'Select Date Range'}
              />
            </Form.Group>

            {/* Type Filter */}
            <Form.Group controlId="filterType" className="mt-3">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" value={documentType} onChange={handleTypeChange}>
                <option value="">All</option>
                <option value="Material">Material</option>
                <option value="Informative">Informative</option>
                <option value="Prescriptive">Prescriptive</option>
                <option value="Design">Design</option>
                <option value="Technical">Technical</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>

        {/* Offcanvas Filter Menu for Small Screens */}
        <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filter Documents</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form>
              {/* Same form content as above */}
              <Form.Group controlId="filterStakeholder">
                <Form.Label>Stakeholder</Form.Label>
                <Form.Control as="select" value={stakeholder} onChange={handleStakeholderChange}>
                  <option value="">All</option>
                  <option value="Stakeholder A">Stakeholder A</option>
                  <option value="Stakeholder B">Stakeholder B</option>
                </Form.Control>
              </Form.Group>
              
              <Form.Group controlId="filterDateType" className="mt-3">
                <Form.Check
                  type="radio"
                  label="Single Date"
                  checked={isSingleDate}
                  onChange={handleSingleDateToggle}
                />
                <Form.Check
                  type="radio"
                  label="Date Range"
                  checked={!isSingleDate}
                  onChange={handleSingleDateToggle}
                />
              </Form.Group>

              <Form.Group controlId="filterDate" className="mt-3">
                <Form.Label>{isSingleDate ? 'Select Date' : 'Select Date Range'}</Form.Label>
                <DatePicker
                  selected={dateRange[0]}
                  onChange={handleDateChange}
                  startDate={dateRange[0]}
                  endDate={isSingleDate ? null : dateRange[1]}
                  selectsRange={!isSingleDate}
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText={isSingleDate ? 'Select Date' : 'Select Date Range'}
                />
              </Form.Group>

              <Form.Group controlId="filterType" className="mt-3">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" value={documentType} onChange={handleTypeChange}>
                  <option value="">All</option>
                  <option value="Material">Material</option>
                  <option value="Informative">Informative</option>
                  <option value="Prescriptive">Prescriptive</option>
                  <option value="Design">Design</option>
                  <option value="Technical">Technical</option>
                </Form.Control>
              </Form.Group>
            </Form>
            {/* Close Filters Button */}
            <div className="text-center mt-4">
              <Button variant="secondary" onClick={() => setShowFilters(false)}>
                Close Filters
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Right Column (md=9) for Search Bar & Documents */}
        <Col xs={12} md={9} className="filtered-result">
        <div className="search-section-modern">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title..."
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search documents"
                className="search-input-modern"
              />
              <div className="icons-container">
                <i className="bi bi-x-lg clear-icon" onClick={() => setSearchQuery('')}></i>
              </div>
            </InputGroup>
          </div>

          <div className="documents-list mt-2">
            <h5>Documents:</h5>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              filteredDocs.length > 0 ? (
                filteredDocs.map((doc, index) => <MyPopup key={index} doc={doc} />)
              ) : (
                <p>No documents found</p>
              )
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FilteringDocuments;
