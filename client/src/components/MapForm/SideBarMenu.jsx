import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Form, Row, Col } from 'react-bootstrap';
import '../../styles/SideBarMenu.css';

const MapControlPanel = ({ modeList, currentMode, setCurrentMode, clearPosition, position, newPoint, validateCoordinates }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setError('');
        if (position.coordinates?.lat && position.coordinates?.long) {
            setLatitude(position.coordinates.lat);
            setLongitude(position.coordinates.long);
        } else {
            setLatitude('');
            setLongitude('');
        }
    }, [position.coordinates]);

    const handleLatitudeChange = (e) => {
        const value = e.target.value;
        if (!value || value.match(/^\d*\.?\d*$/)) {
            setLatitude(value);
            if (longitude !== '') {
                if (validateCoordinates(parseFloat(value), parseFloat(longitude))) {
                    newPoint(value, longitude);
                    setError(null);
                } else {
                    setError("Invalid coordinates");
                    clearPosition();
                }
            }
        }
    };

    const handleLongitudeChange = (e) => {
        const value = e.target.value;
        if (!value || value.match(/^\d*\.?\d*$/)) {
            setLongitude(value);
            if (latitude !== '') {
                if (validateCoordinates(parseFloat(latitude), parseFloat(value))) {
                    newPoint(latitude, value);
                    setError(null);
                } else {
                    setError("Invalid coordinates");
                    clearPosition();
                }
            }
        }
    };

    return (
        <div className="map-control-panel">
            <div className="button-container">
                <ButtonGroup>
                    {modeList.map(mode => (
                        <Button 
                            key={mode}
                            variant="light"
                            onClick={() => {setCurrentMode(mode); if(mode !== 'Explore') clearPosition();}}
                            className={`mode-button ${currentMode === mode ? "active" : ""}`}>
                            {mode}
                        </Button>
                    ))}
                </ButtonGroup>
                {currentMode === 'Custom point' && (
                    <Row className="align-items-center justify-content-center mt-2 mb-2">
                        <Col xs="auto">
                            <Form.Label className="input-label">Lat:</Form.Label>
                            <Form.Control
                                id="inlineFormInputLatitude"
                                className={`mb-2 ${error ? 'input-error' : ''}`}
                                type="text"
                                value={latitude}
                                onChange={handleLatitudeChange}
                                placeholder="Latitude"
                            />
                            {error && <div className="error-message">{error}</div>}
                        </Col>
                        <Col xs="auto">
                            <Form.Label className="input-label">Long:</Form.Label>
                            <Form.Control
                                id="inlineFormInputLongitude"
                                className={`mb-2 ${error ? 'input-error' : ''}`}
                                type="text"
                                value={longitude}
                                onChange={handleLongitudeChange}
                                placeholder="Longitude"
                            />
                            {error && <div className="error-message">{error}</div>}
                        </Col>
                    </Row>
                )}
                {position.coordinates && (
                    <div className="clear-button-container">
                        <Button variant="secondary" onClick={clearPosition} className="clear-button">
                            Clear
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapControlPanel;
