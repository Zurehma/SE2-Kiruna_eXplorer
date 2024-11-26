import React from 'react';
import { Dropdown } from 'react-bootstrap';

function MyViewDropdown(props){
    
    return(
        <>
            {/*Dropdown to handle views-> place the check smaller!!*/}
            <Dropdown drop="up" onSelect={(eventKey) => {props.setMapView(eventKey); props.setSelectedDoc(null)}} className="myDropdownView">
                <Dropdown.Toggle variant="light" id="dropdown-view-button" className="myFilterMenu">
                    <i className="bi bi-globe me-1" style={{ fontSize: '18px' }}></i> View
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu" style={{ backgroundColor: "white" }}>
                    <Dropdown.Item eventKey="satellite">
                    {props.mapView === "satellite" && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>} Satellite
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="streets">
                    {props.mapView === "streets" && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>} Streets
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="terrain">
                    {props.mapView === "terrain" && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>} Terrain
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="outdoor">
                    {props.mapView === "outdoor" && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>} Outdoor
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
        
        </>
    );
};

export default MyViewDropdown;