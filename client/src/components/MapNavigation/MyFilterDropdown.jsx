import React from 'react';
import { Dropdown } from 'react-bootstrap';

function MyFilterDropdown(props){ //loggedIn,set

    return(
        <>
            {/* Filter dropdown on the top-right corner */}
            {props.loggedIn && (
                <Dropdown drop='down-centered' onSelect={(eventKey) => {props.setSelectedType(eventKey); props.setSelectedDoc(null);}} className='myDropdownFilter'>
                    <Dropdown.Toggle drop='down-centered' variant="light" id="dropdown-filter-button" className='myFilterMenu'>
                        <i className="bi bi-filter me-1" style={{ fontSize: '18px' }}></i>
                        Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu" style={{ backgroundColor: 'white' }}>
                    <Dropdown.Item eventKey="All">{props.selectedType==="All" && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>}All</Dropdown.Item>
                    {props.typeDoc.map((type, index) => (
                        <Dropdown.Item key={index} eventKey={type.name} className='text-small'>
                            {props.selectedType===type.name && <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '12px' }}></i>}{type.name}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
                )}
        </>
    );
};

export default MyFilterDropdown;