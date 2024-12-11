import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import API from "../../../API";

function Filters({ limit, currentPage, onDocumentsUpdate, onLoadingChange }) {
  const [stakeholder, setStakeholder] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSingleDate, setIsSingleDate] = useState(true);

  // Lists fetched from the backend
  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);

  const [totalDocuments, setTotalDocuments] = useState(0);

  const formatDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

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

  const fetchFilteredDocuments = async () => {
    onLoadingChange(true);
    const filters = {
      type: documentType || undefined,
      stakeholder: stakeholder || undefined,
      issuanceDateFrom: isSingleDate ? formatDate(selectedDate) : formatDate(startDate),
      issuanceDateTo: isSingleDate ? formatDate(selectedDate) : formatDate(endDate),
    };

    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
    );

    try {
      // First fetch all docs to get total count
      const allDocs = await API.filterDocuments(filteredParams);
      setTotalDocuments(allDocs.length);

      // Then fetch only the requested page
      const paginatedFilters = { ...filteredParams, limit, offset: currentPage * limit };
      const response = await API.filterDocuments(paginatedFilters);

      onDocumentsUpdate(response, allDocs.length);
    } catch (error) {
      console.error("Error fetching filtered documents:", error);
      onDocumentsUpdate([], 0);
    } finally {
      onLoadingChange(false);
    }
  };

  useEffect(() => {
    fetchDefaultLists();
  }, []);

  useEffect(() => {
    fetchFilteredDocuments();
  }, [stakeholder, documentType, selectedDate, startDate, endDate, isSingleDate, currentPage]);

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

  return (
    <Card className="filter-card">
      <Card.Body>
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
            <div className="d-flex align-items-center position-relative" style={{ gap: "5px" }}>
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
            <div className="d-flex align-items-center position-relative" style={{ gap: "5px" }}>
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
  );
}

export default Filters;