import React from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyPopup(props) {
  // Determine the icon based on the document type
  const renderIcon = () => {
    switch (props.doc.type) {
      case 'Design':
        return <i className="bi bi-file-earmark-text my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Informative':
        return <i className="bi bi-info-circle my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Prescriptive':
        return <i className="bi bi-arrow-right-square my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Technical':
        return <i className="bi bi-file-earmark-code my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Agreement':
        return <i className="bi bi-people-fill my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Conflict':
        return <i className="bi bi-x-circle my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Consultation':
        return <i className="bi bi-chat-dots my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Action':
        return <i className="bi bi-exclamation-triangle my-icons" data-testid={`my-icon-${props.doc.type}`}></i>;
      default:
        return null;
    }
  };

  // Helper function to display "-" if value is null
  const displayValue = (value) => (value !== null ? value : '-');

  return (
    <Row>
      {/* Icon Column */}
      <Col xs={12} md={2} className='myPopup text-center mb-3'>
        {renderIcon()}
      </Col>

      {/* Text Details Column */}
      <Col xs={12} md={5} className='myPopup mb-3'>
        <h5>{props.doc.title}</h5>
        <p><strong>Stakeholders:</strong> {props.doc.stakeholder}</p>
        <p><strong>Scale:</strong> {props.doc.scale}</p>
        <p><strong>Issuance Date:</strong> {props.doc.issuanceDate}</p>
        <p><strong>Type:</strong> {props.doc.type}</p>
        <p><strong>Connections:</strong> {props.doc.connections}</p>
        <p><strong>Language:</strong> {props.doc.language}</p>
        <p><strong>Pages:</strong> {displayValue(props.doc.pages)}</p>
        <p><strong>From page:</strong> {displayValue(props.doc.pageFrom)}</p>
        <p><strong>To page:</strong> {displayValue(props.doc.pageTo)}</p>
        <p><strong>Position:</strong> [{displayValue(props.doc.lat)} - {displayValue(props.doc.long)}]</p>
      </Col>

      {/* Description Column */}
      <Col xs={12} md={5}>
        <p className='mt-4'><strong>Description:</strong></p>
        <p>{props.doc.description}</p>
      </Col>
    </Row>
  );
}

export { MyPopup };
