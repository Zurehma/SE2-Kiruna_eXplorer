import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { MyPopup } from './MyPopup'; // Import MyPopup component
import API from '../../API';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Filtering.css'

const FilteringDocuments = () => {
  // State to hold search query, filtered documents, and loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]

  useEffect(() => {
    // Fetch documents when the component is mounted
    const fetchDocuments = async () => {
      try {
        const response = await API.getDocuments();
        console.log('API response:', response); // Log the response to check the structure
        setDocuments(response); // Assuming response.data contains the documents
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchDocuments(); // Fetch documents
  }, []); // Empty dependency array ensures the effect runs only once (on component mount)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  // Filter documents based on search query (client-side)
  const filteredDocs = documents.filter((doc) => {
    return doc.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Container fluid className="mt-4" style={{ height: '100vh', overflow: 'hidden' }}>
      <Row style={{ height: '100%' }}>
        {/* Left Column (md=3) for Filters */}
        <Col md={3} className="sidebar-section" style={{ position: 'fixed', top: '2cm', bottom: 0, overflowY: 'auto', height: '100vh' }}>
          <h5>Filter Documents</h5>
          <Form>
            {/* Stakeholder Filter */}
            <Form.Group controlId="filterStakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control
                as="select"
                name="stakeholder"
              >
                <option value="">All</option>
                <option value="Stakeholder A">Stakeholder A</option>
                <option value="Stakeholder B">Stakeholder B</option>
                {/* Add other stakeholders dynamically here if available */}
              </Form.Control>
            </Form.Group>

            {/* Date Range Filter */}
            <Form.Group controlId="filterDate" className="mt-3">
              <Form.Label>Date Range</Form.Label>
              <DatePicker
                selected={dateRange[0]}
                onChange={handleDateChange}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                selectsRange
                isClearable
                dateFormat="MM/dd/yyyy"
                className="form-control"
                placeholderText="Select Date Range"
              />
            </Form.Group>

            {/* Language Filter */}
            <Form.Group controlId="filterLanguage" className="mt-3">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                name="language"
              >
                <option value="English">All</option>
                <option value="English">English</option>
                <option value="Swedish">Swedish</option>
                {/* Add more languages as needed */}
              </Form.Control>
            </Form.Group>

            {/* Scale Filter */}
            <Form.Group controlId="filterScale" className="mt-3">
              <Form.Label>Scale</Form.Label>
              <Form.Control
                as="select"
                name="scale"
              >
                <option value="All">All</option>
                <option value="Blueprint/Effects">Blueprint/Effects</option>
                <option value="Text">Text</option>
                <option value="1:n">1:n</option>
              </Form.Control>
            </Form.Group>

            {/* Type Filter */}
            <Form.Group controlId="filterType" className="mt-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
              >
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

        {/* Right Column (md=9) for Search Bar & Documents */}
        <Col md={9} className="filtered-result" style={{ marginLeft: '25%', paddingLeft: '15px', overflowY: 'auto', height: '100vh' }}>
          {/* Top: Modernized Search Bar */}
          <div className="search-section-modern">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search documents..."
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search documents"
                className="search-input-modern"
              />
              <div className="icons-container">
                {/* Clear icon is always visible, but only clears input when there is text */}
                <i
                  className="bi bi-x-lg clear-icon"
                  onClick={() => setSearchQuery('')}
                ></i>
                {/* Search icon is always visible */}
                <i className="bi bi-search search-icon"></i>
              </div>
            </InputGroup>
          </div>

          {/* Bottom: Display Documents */}
          <div className="documents-list mt-4">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              filteredDocs.length > 0 ? (
                filteredDocs.map((doc, index) => (
                  <MyPopup key={index} doc={doc} />
                ))
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
