import React from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyPopup(props) {
  // Determine the icon based on the document type
  const renderIcon = () => {
    switch (props.doc.type) {
      case 'Design':
        return <i className="bi bi-file-earmark-text my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Informative':
        return <i className="bi bi-info-circle my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Prescriptive':
        return <i className="bi bi-arrow-right-square my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Technical':
        return <i className="bi bi-file-earmark-code my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Agreement':
        return <i className="bi bi-people-fill my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Conflict':
        return <i className="bi bi-x-circle my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Consultation':
        return <i className="bi bi-chat-dots my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
      case 'Action':
        return <i className="bi bi-exclamation-triangle my-icons text-black" data-testid={`my-icon-${props.doc.type}`}></i>;
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
      <Col xs={12} md={5} className='myPopup mb-3'>
        <h6>{props.doc.title}</h6>
        <p className='small'>
          <strong>Stakeholders:</strong> {props.doc.stakeholder} <br />
          <strong>Scale:</strong> {props.doc.scale} <br />
          <strong>Issuance Date:</strong> {props.doc.issuanceDate} <br />
          <strong>Type:</strong> {props.doc.type} <br />
          <strong>Connections:</strong> {props.doc.connections} <br />
          <strong>Language:</strong> {props.doc.language} <br />
          <strong>Pages:</strong> {displayValue(props.doc.pages)} <br />
          <strong>From page:</strong> {displayValue(props.doc.pageFrom)} <br />
          <strong>To page:</strong> {displayValue(props.doc.pageTo)} <br />
          <strong>Position:</strong> {props.doc.lat ? `${props.doc.lat} - ${props.doc.long}` : 'entire municipality'}
        </p>
      </Col>
      <Col xs={12} md={5}>
        <p className='mt-3 small'><strong>Description:</strong> {props.doc.description}</p>
        
      </Col>
    </Row>
  );
}

export { MyPopup };
