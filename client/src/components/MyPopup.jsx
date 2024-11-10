import React from 'react';
import { Row, Col, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyPopup(props) {
  // Determine the icon based on the document type
  const renderIcon = () => {
    const iconMap = {
      Design: 'bi-file-earmark-text',
      Informative: 'bi-info-circle',
      Prescriptive: 'bi-arrow-right-square',
      Technical: 'bi-file-earmark-code',
      Agreement: 'bi-people-fill',
      Conflict: 'bi-x-circle',
      Consultation: 'bi-chat-dots',
      Action: 'bi-exclamation-triangle',
      Material: 'bi-file-earmark-binary',
    };
    const iconClass = iconMap[props.doc.type] || '';

    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${props.doc.type}`}>{props.doc.type}</Tooltip>}
      >
        <i className={`bi ${iconClass} my-icons text-black`} data-testid={`my-icon-${props.doc.type}`}></i>
      </OverlayTrigger>
    );
  };

  // Helper function to display "-" if value is null
  const displayValue = (value) => (value !== null ? value : '-');

  return (
    <Row>
      {/* Icon Column */}
      <Col xs={12} md={2} className="myPopup text-center mb-3">
        {renderIcon()}
      </Col>
      <Col xs={12} md={5} className="myPopup mb-3">
        <h6>{props.doc.title}</h6>
        <p className="small">
          <strong>Stakeholders: </strong> {props.doc.stakeholder} <br />
          <strong>Scale: </strong>{' '}
          {props.doc.scale &&
          typeof props.doc.scale === 'string' &&
          props.doc.scale.toUpperCase() !== 'TEXT' &&
          props.doc.scale.toUpperCase() !== 'BLUEPRINT/EFFECTS'
            ? `1:${props.doc.scale}`
            : props.doc.scale}{' '}
          <br />
          <strong>Issuance Date: </strong> {props.doc.issuanceDate} <br />
          <strong>Type: </strong> {props.doc.type} <br />
          <strong>Connections: </strong> {props.doc.connections} <br />
          <strong>Language: </strong> {props.doc.language} <br />
          <strong>Number of pages: </strong> {displayValue(props.doc.pages)} <br />
          <strong>Pages: </strong>{' '}
          {props.doc.pageFrom && props.doc.pageTo
            ? `${props.doc.pageFrom}-${props.doc.pageTo}`
            : displayValue(props.doc.pageFrom)}{' '}
          <br />
          <strong>Position: </strong>{' '}
          {props.doc.lat ? `${props.doc.lat} - ${props.doc.long}` : 'entire municipality'}
        </p>
      </Col>
      <Col xs={12} md={5} className="position-relative">
        <p className="mt-3 small">
          <strong>Description:</strong> {props.doc.description}
        </p>
        {/* Edit Button in Bottom-Right Corner */}
        <Button
          variant="light"
          className="position-absolute"
          style={{ bottom: 0, right: 0 }}
        >
          <i className="bi bi-pencil-square text-primary"></i>
        </Button>
      </Col>
    </Row>
  );
}

export { MyPopup };
