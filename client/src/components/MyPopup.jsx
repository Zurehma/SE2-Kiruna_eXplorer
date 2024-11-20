import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, OverlayTrigger, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API from '../../API';



function MyPopup(props) {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [showLinks, setShowLinks] = useState(false); // State to control visibility of the dropdown
  const widthLastColumn = props.loggedIn ? 4 : 5;
  const remainingWidth = 12 -3 -4 - widthLastColumn;


  //fetch links and available attachments for the document 
  useEffect(() => { //As soon as the id of the doc changes, fetch its links and attachments
    setLoading(true);
    const fetchData = async () => {
      try {
        const links = await API.getLinksDoc(props.doc.id);
        setLinks(links);
        //call the getAttachments API
        const attachments = await API.getAttachments(props.doc.id);
        setAttachments(attachments);
      } catch (error) {
        props.setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.doc.id]);


  //Handle download of attachment
  const handleDownload = async (docID, attachmentID) => {
    try {
        // Obtain the blob object from the server
        const blob = await API.downloadAttachment(docID, attachmentID);
        //find the name of the file from the attachmentID
        const name = attachments.find(attachment => attachment.id === attachmentID).name;
        // Create a URL object from the blob object
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}`; // Use the name of the file to make it the default name when the user downloads it 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean the URL object after the download is complete
        URL.revokeObjectURL(url);
    } catch (error) {
        props.setError('Error downloading attachment');
    }
  };

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
        <i
          className={`bi ${iconClass} my-icons text-secondary`}
          data-testid={`my-icon-${props.doc.type}`}
          style={{ fontSize: '2rem', color: '#555' }}
        ></i>
      </OverlayTrigger>
    );
  };

  const navigate = useNavigate();

  const handleClick = () => {
    if (props.doc && props.doc.id && props.doc.id > 0) {
      navigate(`/documents/${props.doc.id}`, { state: { docId: props.doc.id } });
    } else {
      props.setError('Invalid document data');
    }
  };
  
  // Helper function to display "-" if value is null
  const displayValue = (value) => (value !== null ? value : '-');

  return (
    <Row className="p-3 border rounded shadow-sm popupProp" style={{ backgroundColor: '#f9f9f9' }}>
      {/* Icon Column */}
      <Col
        xs={12}
        md={3}
        className="myPopup mt-1"
        style={{
          display: 'flex',
          flexDirection: 'column',  // Disposizione verticale per gli altri elementi
          alignItems: 'flex-start',  // Allineamento a sinistra per la lista
          paddingTop: '0.5rem',
        }}
      >
        {/* Icona centrata orizzontalmente */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {renderIcon()}
        </div>

        <h6 className="fw-bold text-secondary mb-2 mt-2">Attachmets:</h6>
        {attachments.length === 0 && <p className="small text-muted mt-2">No attachments added yet</p>}
        <ul className="list-unstyled">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="mb-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(props.doc.id, attachment.id);
                }}
                className="text-decoration-none d-flex align-items-center ms-2"
              >
                <i className="bi bi-file-earmark-arrow-down me-1"></i>
                {attachment.name}
              </a>
            </li>
          ))}
        </ul>
      </Col>



      {/* Details Column */}
      <Col xs={12} md={4} className="myPopup">
        <h6 className="fw-bold text-secondary mb-2">{props.doc.title}</h6>
        <p className="small text-muted m-0">
          <strong className="text-dark">Stakeholders:</strong> {props.doc.stakeholder} <br />
          <strong className="text-dark">Scale:</strong>{' '}
          {props.doc.scale &&
          typeof props.doc.scale === 'string' &&
          props.doc.scale.toUpperCase() !== 'TEXT' &&
          props.doc.scale.toUpperCase() !== 'BLUEPRINT/EFFECTS'
            ? `1:${props.doc.scale}`
            : props.doc.scale}{' '}
          <br />
          <strong className="text-dark">Issuance Date:</strong> {props.doc.issuanceDate} <br />
          <strong className="text-dark">Type:</strong> {props.doc.type} <br />
        </p>
        {/* Display connections */}
        <p className="small text-muted m-0 d-flex align-items-center">
            <strong className="text-dark">Connections:</strong> {props.doc.connections}
            {props.doc.connections > 0 && !loading && (
              <Dropdown className="d-inline ms-2">
                <Dropdown.Toggle
                  variant="link"
                  aria-label="connections"
                  id="dropdown-toggle-connection"
                  className="p-0"
                  onClick={() => setShowLinks(!showLinks)}
                  style={{ color: 'black', fontSize: '1rem' }}
                  data-testid="connections-toggle-button"
                >
                </Dropdown.Toggle>
              </Dropdown>
            )}
          </p>

        {/* Display the dropdown list of connections if it's open */}
        {showLinks && (
          <ul className="small text-muted ms-3">
            {links.map((link) => (
              <li key={link.linkedDocID}>
                {link.title} - {link.type}
              </li>
            ))}
          </ul>
        )}
        <p className='text-muted small m-0'>
          <strong className="text-dark">Language:</strong> {props.doc.language} <br />
          <strong className="text-dark">Number of pages:</strong> {displayValue(props.doc.pages)} <br />
          <strong className="text-dark">Pages:</strong>{' '}
          {props.doc.pageFrom && props.doc.pageTo
            ? `${props.doc.pageFrom}-${props.doc.pageTo}`
            : displayValue(props.doc.pageFrom)}{' '}
          <br />
          <strong className="text-dark">Position:</strong>{' '}
          {props.doc.lat ? `${props.doc.lat} - ${props.doc.long}` : 'entire municipality'}
        </p>
      </Col>

      {/* Description Column */}
      <Col xs={12} md={widthLastColumn} className="position-relative">
        <p className="mt-3 small text-muted">
          <strong className="text-dark">Description:</strong> {props.doc.description}
        </p>
      </Col>

      {/* Edit Button Column */}
      {props.loggedIn && (
      <Col xs={12} md={remainingWidth} className="d-flex align-items-start justify-content-center">
        <Button
          variant="outline-primary"
          className="shadow-sm edit-button" // Added custom class for targeted CSS
          aria-label="edit" 
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
          }}
          onClick={handleClick}
        >
          <i className="bi bi-pencil-square edit-icon" style={{ fontSize: '1.25rem' }}></i>
        </Button>
      </Col>)}
    </Row>
  );
}

export { MyPopup };
