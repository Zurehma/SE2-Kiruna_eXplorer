import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

import { Button, Modal, Form,Row,Col } from 'react-bootstrap';
import '../App.css';
import { MyPopup } from './MyPopup';
import API from '../../API';
import { Dropdown } from 'react-bootstrap';
//import kirunaCoordinates from '../assets/KirunaMunicipality.geojson';


// Icon mapping based on document type
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

// Function to create a custom divIcon with a specific icon inside
const createCustomIcon = (type) => {
    const iconClass = iconMap[type] || 'bi-file-earmark';
    return L.divIcon({
        html: `<div style="display: flex; align-items: center; justify-content: center; background: white; width: 25px; height: 25px; border-radius: 50%; border: 2px solid black;">
                    <i class="bi ${iconClass}" style="color: black; font-size: 12px;"></i>
               </div>`,
        className: '' // Clear default class
    });
};


// Custom hook to recenter the map
const RecenterMap = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom); // Set the map view to the new position and zoom
    }, [map, position, zoom]);

    return null;
}

function Map2(props) {
    const initialPosition = [67.850, 20.217];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positionActual, setPositionActual] = useState(initialPosition);
    const [zoomLevel, setZoomLevel] = useState(11);
    const [selectedDoc, setSelectedDoc] = useState(null); // To manage the selected document for showing MyPopup
    const [renderNumber,setRenderNumeber] = useState(0);
    const [typeDoc,setTypeDoc] = useState([]);
    const [selectedType, setSelectedType] = useState('All'); // New state for selected type
    
    //Handle views in the map
    const [mapView, setMapView] = useState("satellite");
    const mapStyles = {
        satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
        streets: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
        terrain: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        outdoor: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
    };

    const [show, setShow] = useState(false); // State for the modal
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

    const handleSelect = (doc) => {
        setShow(false); 
        setSelectedDoc(doc);
    };
    

    useEffect(()=>{
        setLoading(true);
        const fetchTypes = async () =>{
            try{
                if(props.loggedIn){
                    const data = await API.getDocumentTypes();
                    setTypeDoc(data);
                }                 
            }
            catch(error){
                props.setError(error);
            }finally{
                setLoading(false)
            }
        }
        fetchTypes()
    }, [])    

    // Fetch data from the API
    useEffect(() => {
        setLoading(true);
        setSelectedDoc(null); // Clear the selected document whenever the filter changes
    
        const fetchData = async () => {
            try {
                const filters = selectedType === 'All' ? {} : { type: selectedType };
                const documents = await API.filterDocuments(filters);
                const updatedDocuments = documents.map(doc => {
                    if (!doc.coordinates) {
                        return { ...doc, lat: null, long: null };
                    } else {
                        const { lat, long } = doc.coordinates;
                        return { ...doc, lat, long };
                    }
                });
                setData(updatedDocuments);
            } catch (error) {
                props.setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedType]); // Fetch documents when selectedType changes
    // Filter documents without coordinates
    const noCoordDocuments = data.filter(doc => doc.lat == null && doc.long == null);
    // Filter documents with coordinates
    const coordDocuments = data.filter(doc => doc.lat != null && doc.long != null);
    // Filter documents inside the modal
    const filteredDocuments = noCoordDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to recenter the map on Kiruna with zoom reset to 13
    const recenterMap = () => {
        const validZoom = (zoom) => zoom >= 0;
        const validPosition = (position) => 
            Array.isArray(position) && 
            position.length === 2 && 
            position.every(coord => typeof coord === 'number' && coord >= -90 && coord <= 90);

        if (validPosition(initialPosition) && validZoom(11)) {
            setPositionActual(initialPosition);
            setSelectedDoc(null);
            setZoomLevel(11);
        } else {
            console.error('Invalid position or zoom level');
        }
    };
    const classNameEntireMunicipality = props.loggedIn ? 'myDropdownDocuments' : 'myDropdownFilter';
    
    /*
    Things to do:
    Improve placement of the doc-without-coordinates button- remove style in-line
    Import Kiruna coordinates and draw them when a noCoordinates element is opened
    Increase z-index of the MyPopup component to make it stay over the dropdowns->doesn't work
    <Polygon positions={kirunaCoordinates} color="blue" fillOpacity={0.3} />
    */
    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && 
            <MapContainer center={positionActual} zoom={zoomLevel} style={{ height: '92vh', width: '100%' }}>
                <TileLayer
                    url={mapStyles[mapView]}
                />
                {/*Dropdown to handle views-> place the check smaller!!*/}
                <Dropdown drop="up" onSelect={(eventKey) => setMapView(eventKey)} className="myDropdownView">
                <Dropdown.Toggle variant="light" id="dropdown-view-button" className="myFilterMenu">
                    <i className="bi bi-globe me-1"></i> View
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu" style={{ backgroundColor: "white" }}>
                    <Dropdown.Item eventKey="satellite">
                    {mapView === "satellite" && <i className="bi bi-check-circle-fill me-2"></i>} Satellite
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="streets">
                    {mapView === "streets" && <i className="bi bi-check-circle-fill me-2"></i>} Streets
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="terrain">
                    {mapView === "terrain" && <i className="bi bi-check-circle-fill me-2"></i>} Terrain
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="outdoor">
                    {mapView === "outdoor" && <i className="bi bi-check-circle-fill me-2"></i>} Outdoor
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                {/* Filter dropdown on the top-right corner */}
                {props.loggedIn && (
                <Dropdown drop='down-centered' onSelect={(eventKey) => setSelectedType(eventKey)} className='myDropdownFilter'>
                    <Dropdown.Toggle drop='down-centered' variant="light" id="dropdown-filter-button" className='myFilterMenu'>
                        <i className="bi bi-filter me-1" style={{ fontSize: '18px' }}></i>
                        Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu" style={{ backgroundColor: 'white' }}>
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    {typeDoc.map((type, index) => (
                        <Dropdown.Item key={index} eventKey={type.name} className='text-small'>{type.name}</Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
                )}

                {/* Show documents without coordinates with a button that opens a modal */}
                <Button variant="light" onClick={() => setShow(true)} className={classNameEntireMunicipality}>
                    <i className="bi bi-folder2-open me-1"></i> Entire municipality
                </Button>
                <Modal show={show} onHide={() => setShow(false)} size="lg" centered className="modal-dialog-scrollable">
                    <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-folder2-open me-2"></i> Documents
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {/* Barra di ricerca */}
                    <Form.Control
                        type="text"
                        placeholder="Search documents (entire municiality)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-3"
                    />
                    {/* Lista dei documenti */}
                    {filteredDocuments.length > 0 ? (
                        <ul className="list-group">
                        {filteredDocuments.map((doc) => (
                            <li
                            key={doc.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            onClick={() => handleSelect(doc)}
                            style={{ cursor: "pointer" }}
                            >
                            <span>
                                <Row className="align-items-center">
                                    <Col xs={2} >
                                    <i className={`bi ${iconMap[doc.type]} me-2`} style={{ fontSize: '18px', color: "#006d77" }}></i>
                                    </Col>
                                    <Col xs={10}>
                                        {doc.title}
                                    </Col>
                                </Row>   
                            </span>
                            <i className="bi bi-arrow-right-circle-fill"></i>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <div className="text-muted text-center py-3">No documents available</div>
                    )}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>

                {/* Draw clusters or icons depending on the zoom: also the exact same position is managed in this case */}
                <MarkerClusterGroup>
                    {coordDocuments.map((doc) => (
                        <Marker key={doc.id} position={[doc.lat, doc.long]} icon={createCustomIcon(doc.type)}
                            eventHandlers={{
                                click: () => {
                                    setSelectedDoc(doc);
                                },
                            }}
                        />
                    ))}
                </MarkerClusterGroup>
                
                {/* If a document is selected, show MyPopup in a popup */}
                {/*Done in this way to avoid visual problems dued to continue re-rendering because of clustering */}
                {selectedDoc!==null && (
                    (() => {
                        const pos = selectedDoc.lat ? [selectedDoc.lat, selectedDoc.long] : highestPoint;
                        const myKey = selectedDoc.id+renderNumber;
                        return (
                            <Popup position={pos} maxWidth={800} key={myKey} onClose={() => setSelectedDoc(null)} >
                                <MyPopup doc={selectedDoc} setError={props.setError} loggedIn={props.loggedIn} className='popupProp' />
                            </Popup>
                        );
                    })()
                )}

                {/*Button to recenter the map*/}
                <RecenterMap position={positionActual} zoom={zoomLevel} />
                <button onClick={recenterMap} className='myRecenterButton'>
                    <i className="bi bi-compass myMapIcons"></i>
                </button>
            </MapContainer>}
        </>
    );
}

export default Map2
