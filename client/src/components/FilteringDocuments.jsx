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
  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSingleDate, setIsSingleDate] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (date) => (date ? format(date, 'dd/MM/yyyy') : null);

  // Fetch document types and stakeholders
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const stakeholders = await API.getStakeholders();
        const documentTypes = await API.getDocumentTypes();
        setStakeholdersList(stakeholders);
        setDocumentTypesList(documentTypes);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const fetchFilteredDocuments = async () => {
    setLoading(true);

    const filters = {
      stakeholder,
      type: documentType,
      date: isSingleDate ? formatDate(selectedDate) : null,
      startDate: !isSingleDate ? formatDate(startDate) : null,
      endDate: !isSingleDate ? formatDate(endDate) : null,
    };

    console.log('Filters:', filters);

    try {
      const response = await API.getDocuments(filters);
      setDocuments(response);
    } catch (error) {
      console.error('Error fetching filtered documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredDocuments();
  }, [stakeholder, documentType, selectedDate, startDate, endDate, isSingleDate]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleDateToggle = () => {
    setIsSingleDate(!isSingleDate);
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
    console.log('Single Date Mode:', isSingleDate);
  };

  const handleSingleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Selected Single Date:', date);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    console.log('Selected Date Range:', { startDate: start, endDate: end });
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="mt-4" style={{ height: '100vh' }}>
      <Row style={{ height: '100%' }}>
        
        {/* Responsive Filter Button */}
        <Col xs={12} className="d-md-none text-end mb-3" >
          <i 
            className="bi bi-funnel text-black cursor-pointer" 
            style={{ fontSize: '30px' }} 
            onClick={() => setShowFilters(true)} 
          />
        </Col>

        <Col md={3} className="d-none d-md-block sidebar-section">
          <h5>Filter Documents</h5>
          <Form>
            {/* Stakeholder Dropdown */}
            <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control 
                as="select" 
                value={stakeholder} 
                onChange={(e) => setStakeholder(e.target.value)}
              >
                <option value="">All Stakeholders</option>
                {stakeholdersList.map((stakeholderItem) => (
                  <option key={stakeholderItem.id} value={stakeholderItem.id}>
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
              >
                <option value="">All Document Types</option>
                {documentTypesList.map((typeItem) => (
                  <option key={typeItem.id} value={typeItem.id}>
                    {typeItem.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Date Selection */}
            <Form.Group controlId="sidebarFilterDateType" className="mt-3">
              <Form.Check type="radio" label="Single Date" checked={isSingleDate} onChange={handleDateToggle}
              />
              <Form.Check type="radio" label="Date Range" checked={!isSingleDate} onChange={handleDateToggle}
              />
            </Form.Group>

            <Form.Group controlId="sidebarFilterDate" className="mt-3">
              <Form.Label>{isSingleDate ? 'Select Date' : 'Select Date Range'}</Form.Label>
              {isSingleDate ? (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleSingleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Select Date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              ) : (
                <DatePicker
                  selected={startDate}
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Select Date Range"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            </Form.Group>

          </Form>
        </Col>

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
