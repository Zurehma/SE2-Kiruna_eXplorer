import { useState } from "react";
import { Modal, Button, Offcanvas, Accordion } from "react-bootstrap";
import Legend from "./Legend";

const FilterAndLegendSidebar = ({ documentTypes, stakeholders }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <>
      <div className="sidebar-toggle-btn">
        <Button variant="primary" onClick={handleSidebarShow}>
          <i className="bi bi-funnel"></i> Filters & Legend
        </Button>
      </div>

      {/* Offcanvas Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleSidebarClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Legend</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <hr />

          {/* Advanced Filters Accordion */}
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filters</Accordion.Header>
              <Accordion.Body>
                {/* The filter component that already exist not usable here because is specifically designed to work with the list of document */}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />

          {/* Legend */}
          <Legend documentTypes={documentTypes} stakeholders={stakeholders} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FilterAndLegendSidebar;
