

function Filters(props){
    ({setStakeholder, setDocumentType, setIsSingleDate, setStartDate, setEndDate, setSelectedDate, stakeholdersList, documentTypesList} = props);
    //We need:
    //setStakeholder, setDocumentType, setIsSingleDate, setStartDate, setEndDate, setSelectedDate
    //stakeholdersList, documentTypesList



    return(
        <>
        <Card className="filter-card">
            <Card.Body>
                <h5 className="filter-title">Filter Documents</h5>
                {/* Stakeholder Dropdown */}
                <Form.Group controlId="sidebarFilterStakeholder" className="mt-3">
                    <Form.Label>Stakeholder</Form.Label>
                    <Form.Control as="select" value={stakeholder} onChange={(e) => setStakeholder(e.target.value)} className="filter-input">
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
                    <Form.Control as="select" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="filter-input">
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
                      <div className={`custom-toggle ${isSingleDate ? "active" : ""}`}
                        onClick={() => setIsSingleDate(true)}
                      >
                        <div className={`toggle-button ${isSingleDate ? "active" : ""}`}></div>
                        <span className="toggle-label">Single Date</span>
                      </div>
                      <div className={`custom-toggle ${!isSingleDate ? "active" : ""}`}
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
                          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={handleResetDate}></i>
                        )}
                      </div>
                    )}
                    </Form.Group>
                </Card.Body>
            </Card> 
        </>
    )
}

export default Filters;