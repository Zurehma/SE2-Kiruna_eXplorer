import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import API from "../../../API";

function Filters({ setFilters, onLoadingChange }) {
  const [stakeholder, setStakeholder] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSingleDate, setIsSingleDate] = useState(true);

  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);

  const formatDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

  // Fetch stakeholders and document types on component mount
  useEffect(() => {
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

    fetchDefaultLists();
  }, []);

  // Update filters whenever any filter state changes
  useEffect(() => {
    const updateFilters = () => {
      const filters = {
        type: documentType || undefined,
        stakeholder: stakeholder || undefined,
        issuanceDateFrom: isSingleDate ? formatDate(selectedDate) : formatDate(startDate),
        issuanceDateTo: isSingleDate ? formatDate(selectedDate) : formatDate(endDate),
      };

      // Remove undefined or empty string values
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
      );

      setFilters(filteredParams);
    };

    updateFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakeholder, documentType, selectedDate, startDate, endDate, isSingleDate]);

  return (
    <Card className="filter-card">
      <Card.Body>
        {/* Stakeholder Filter */}
        <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
          <Form.Label>Stakeholder</Form.Label>
          <Form.Control
            as="select"
            value={stakeholder}
            onChange={(e) => setStakeholder(e.target.value)}
            className="filter-input"
          >
            <option value="">All Stakeholders</option>
            {stakeholdersList.map((stakeholderItem) => (
              <option key={stakeholderItem.id} value={stakeholderItem.name}>
                {stakeholderItem.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Document Type Filter */}
        <Form.Group controlId="sidebarFilterDocumentType" className="mt-3">
          <Form.Label>Document Type</Form.Label>
          <Form.Control
            as="select"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="filter-input"
          >
            <option value="">All Document Types</option>
            {documentTypesList.map((typeItem) => (
              <option key={typeItem.id} value={typeItem.name}>
                {typeItem.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Date Type Toggle */}
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

        {/* Date Picker */}
        <Form.Group controlId="sidebarFilterDate" className="mt-3 position-relative">
          <Form.Label>{isSingleDate ? "Select Date" : "Select Date Range"}</Form.Label>
          {isSingleDate ? (
            <div className="d-flex align-items-center position-relative" style={{ gap: "5px" }}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
                  onClick={() => setSelectedDate(null)}
                ></i>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center position-relative" style={{ gap: "5px" }}>
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
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
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
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
