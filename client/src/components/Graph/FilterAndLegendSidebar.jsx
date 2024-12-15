import { useState } from "react";
import { Modal, Button, Offcanvas, Accordion } from "react-bootstrap";
import Legend from "./Legend";
import Filters from "../Filters/Filters";
import '../../styles/FilterAndSidebar.css'

const FilterAndLegendSidebar = ({ documentTypes, stakeholders,setDocuments,onSetLoading}) => {
    
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <>
      <div className="sidebar-toggle-btn">
        <Button className='button' onClick={handleSidebarShow}>
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
              <Accordion.Header>Advanced filters</Accordion.Header>
              <Accordion.Body>
                <Filters setDocuments={setDocuments} onSetLoading={onSetLoading}/>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />

          {/* Legend */}
          <Legend documentTypes={documentTypes} stakeholders={stakeholders} />
          <Button className='button' onClick={()=>setShowSidebar(false)}>Close Filter&Legend</Button>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FilterAndLegendSidebar;
