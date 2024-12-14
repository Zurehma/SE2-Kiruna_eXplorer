import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, set } from "date-fns";
import API from "../../../API";

function Filters(props) {
  const [stakeholder, setStakeholder] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSingleDate, setIsSingleDate] = useState(true);

  // Lists fetched from the backend
  const [stakeholdersList, setStakeholdersList] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);
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
    const searchQuery = props.searchQuery && props.searchQuery !== "" ? props.searchQuery : null;
    props.onSetLoading(true);
    const filters = {
      type: documentType || undefined,
      stakeholder: stakeholder || undefined,
      issuanceDateFrom: isSingleDate ? formatDate(selectedDate) : formatDate(startDate),
      issuanceDateTo: isSingleDate ? formatDate(selectedDate) : formatDate(endDate),
      searchQuery: searchQuery,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
    );

    try {
      //if limit and current page are passed as props, use them, otherwise no
      const currentPage = props.currentPage || undefined;
      const all = props.currentPage !== null ? false : true;
      const paginatedFilters = { ...filteredParams, pageNo: currentPage };
      let response = await API.getDocuments(paginatedFilters, all);

      if (response.totalPages < currentPage + 1) {
        //reset to page zero if you exceeded
        props.setCurrentPage(0);
      }
      props.setDocuments(response.elements);
      props.setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching filtered documents:", error);
      props.setDocuments([]);
    } finally {
      props.onSetLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultLists();
  }, []);

  useEffect(() => {
    fetchFilteredDocuments();
  }, [
    stakeholder,
    documentType,
    selectedDate,
    startDate,
    endDate,
    isSingleDate,
    props.currentPage,
    props.searchQuery,
    props.reload,
  ]);

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
    <Card.Body>
      {/* Stakeholder Dropdown */}
      <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
        <Form.Label className="filter-label">Stakeholder</Form.Label>
        <Form.Select
          name="stakeholder"
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
        </Form.Select>
      </Form.Group>

      {/* Document Type Dropdown */}
      <Form.Group controlId="sidebarFilterDocumentType" className="mt-3">
        <Form.Label className="filter-label">Document Type</Form.Label>
        <Form.Select
          name="documentType"
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
        </Form.Select>
      </Form.Group>

      {/* Date Selection Checkbox */}
      <Form.Group controlId="sidebarFilterDateType" className="mt-3">
        <Form.Label className="filter-label">Select Date</Form.Label>
        <div className="d-flex align-items-center" style={{ gap: "15px" }}>
          <Form.Check
            type="checkbox"
            label="Date"
            checked={isSingleDate}
            onChange={() => setIsSingleDate(true)}
            className="custom-checkbox"
          />
          <Form.Check
            type="checkbox"
            label="Range"
            checked={!isSingleDate}
            onChange={() => setIsSingleDate(false)}
            className="custom-checkbox"
          />
        </div>
      </Form.Group>

      {/* Date Picker with Reset Icon */}
      <Form.Group controlId="sidebarFilterDate" className="mt-3 position-relative">
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
              <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={handleResetDate}></i>
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
              <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={handleResetDate}></i>
            )}
          </div>
        )}
      </Form.Group>
    </Card.Body>
  );
}

export default Filters;
