import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, OverlayTrigger, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/MapNavigation.css';

import API from '../../API';


function MyPopup(props) {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [showLinks, setShowLinks] = useState(false); // State to control visibility of the dropdown
  const widthLastColumn = props.loggedIn ? 4 : 5;
  const remainingWidth = 12 -3 -4 - widthLastColumn;
  const location = useLocation(); 
  const [isOnMap, setIsOnMap] = useState(false);

  // Check if the user is on the map page
  useEffect(() => {
    setIsOnMap(location.pathname.includes('map'));
  }, [location]);

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
  
  
  const handleEditClick = () => {
    if (props.doc && props.doc.id && props.doc.id > 0) {
      navigate(`/documents/${props.doc.id}`, { state: { docId: props.doc.id } });
    } else {
      props.setError('Invalid document data');
    }
  };

  const handleNavigation = (id) => {
    navigate(`/document/${id}`);
  };
  const handleDeleteClick = () => {
    if (props.doc && props.doc.id && props.doc.id > 0) {
      API.deleteDocument(props.doc.id).then(() => {
        const path = window.location.pathname.split('/');
        if(path.length === 3 && path[1] === 'document' && !isNaN(parseInt(path[2]))){
          navigate(-1);}
        else{
          props.setReload(!props.reload);
        }
      }).catch((error) => {
        props.setError(error);
      });  
    }else{
      props.setError('Invalid document data');
    }
  };
  const stakeholderList=(stakeholderArray)=>{
    let stakeholderList='';
    stakeholderArray.forEach((stakeholder,index)=>{
    stakeholderList += `${stakeholder}`;
      if(index<stakeholderArray.length-1){
        stakeholderList+='/';
      }
    });
    return stakeholderList;
  }
  // Helper function to display "-" if value is null
  const displayValue = (value) => ((value !== null && value !== undefined) ? value : '-');
  const listOfStakeholders = stakeholderList(props.doc.stakeholders);

  // Function to navigate to diagram page
  const handleShowOnDiagram = () => {
    navigate(`/graph/?id=${props.doc.id}`);
  };

  //Function to navigate to map page
  const handleShowOnMap = () => {
    navigate(`/map/?id=${props.doc.id}`);
  };
  
  return (
    <Row className="p-3 border rounded shadow-sm popupProp popupBackStyle">
      {/* Icon Column */}
      <Col xs={12} md={3} className="myPopup mt-1 attachmentStyle">
        <div className='iconPupoupStyle'>
          {renderIcon()}
        </div>
        <h6 className="fw-bold text-secondary mb-2 mt-2">Attachments:</h6>
        {attachments.length === 0 && <p className="small text-muted mt-2">No attachments added yet</p>}
        <ul className="list-unstyled">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="mb-2">
              <a href="#"
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
        <div className="small text-muted m-0">
          <strong className="text-dark">Stakeholders:</strong> {listOfStakeholders} <br />
          <strong className="text-dark">Scale:</strong>{' '}
          {props.doc.scale &&
            typeof props.doc.scale === 'string' &&
            props.doc.scale.toUpperCase() !== 'TEXT' &&
            props.doc.scale.toUpperCase() !== 'BLUEPRINT/EFFECTS'
              ? `1:${props.doc.scale}`: props.doc.scale}{' '}<br />
          <strong className="text-dark">Issuance Date:</strong> {props.doc.issuanceDate} <br />
          <strong className="text-dark">Type:</strong> {props.doc.type} <br />
        </div>
        {/* Display connections */}
        <div className="small text-muted m-0 d-flex align-items-center">
            <strong className="text-dark">Connections:</strong> {props.doc.connections}
            {props.doc.connections > 0 && !loading && (
              <Dropdown className="d-inline ms-2">
                <Dropdown.Toggle variant="link" aria-label="connections" id="dropdown-toggle-connection" className="p-0 dropStyle"
                  onClick={() => setShowLinks(!showLinks)}
                  data-testid="connections-toggle-button "
                >
                </Dropdown.Toggle>
              </Dropdown>
            )}
          </div>

        {/* Display the dropdown list of connections if it's open */}
        {showLinks && (
          <ul className="small text-muted ms-3">
            {links.map((link) => (
              <li key={link.linkedDocID}>
                <span className='linkStyle'
                  onClick={() => handleNavigation(link.linkedDocID)}
                >{link.title}
                </span>{" "} - {link.type}
              </li>))}
          </ul>
        )}
        <p className='text-muted small m-0'>
          <strong className="text-dark">Language:</strong> {props.doc.language} <br />
          <strong className="text-dark">Pages:</strong> {displayValue(props.doc.pages)} <br />
          <strong className="text-dark">Position:</strong>{' '}
          {props.doc.area? 'Area' : props.doc.lat ? `${props.doc.lat} - ${props.doc.long}` : 'entire municipality'  }
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
        <Row>
          <Col xs={6} className="d-flex justify-content-center">
            <Button
              name="edit-button"
              variant="link" 
              className="icon-button" 
              aria-label="edit"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
          </Col>
          <Col xs={6} className="d-flex justify-content-center">
            <Button
              name="delete-button"
              variant="link" 
              className="icon-button" 
              aria-label="delete"
              onClick={handleDeleteClick}
            >
              <i className="bi bi-trash"></i> 
            </Button>
          </Col>
        </Row>
      </Col>)}

          {/* Add Show on Diagram Button */}
          <Col xs={12} className="mt-1 d-flex">
            {isOnMap ? (
              <>
                <a 
                  href="#" 
                  className="link me-1" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleShowOnDiagram();
                  }}
                >
                  <i className="bi bi-bezier"></i>
                  View on Diagram
                </a>
              </>
            ) : (
              <>
                {/* Diagram Link with Icon */}
                <a 
                  href="#" 
                  className="link showDiagram me-3" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleShowOnDiagram();
                  }}
                >
                  <i className="bi bi-bezier"></i>
                  View on Diagram
                </a>
          
                {/* Map Link with Icon */}
                <a 
                  href="#" 
                  className="link viewOnMap" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleShowOnMap();
                  }}
                >
                  <i className="bi bi-geo-alt"></i>
                  View on Map
                </a>
            </>
            )}
        </Col>
    </Row>
  );
}

export { MyPopup };
