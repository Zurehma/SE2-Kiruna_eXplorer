import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../../styles/MapForm.css";

import { Button, Dropdown } from "react-bootstrap";
import MapLayoutCustomPoint from "./MapLayoutCustomPoint";
import MapLayoutPredefinedPoint from "./MapFormLayoutPredefinedPoint";
import MapLayoutPredefinedArea from "./MapFormLayoutPredefinedArea";

/**
 * Button component to resize the map
 * @param {*} isFullScreen boolean to tell is the map occupies the whole screen or the container size
 * @param {*} toggleResize function to change from fullscreen to container size
 * @returns
 */
const ResizeButton = (props) => {
  const { isFullscreen, toggleResize } = props;

  return (
    <>
      <Button
        variant="light"
        size="sm"
        className="resize-button"
        onClick={(e) => {
          e.stopPropagation();
          toggleResize();
        }}
      >
        {isFullscreen ? <i className="bi bi-arrows-angle-contract" /> : <i className="bi bi-arrows-angle-expand" />}
      </Button>
    </>
  );
};

/**
 * Button component to remove the current marker
 * @param {*} clearPosition function to clear the position marker
 * @returns
 */
const ClearPositionButton = (props) => {
  const { clearPosition } = props;

  return (
    <>
      <Button variant="secondary" size="sm" className="clear-position-button" onClick={() => clearPosition()}>
        Clear
      </Button>
    </>
  );
};

const DropdownMapOptions = (props) => {
  const { options, currentOption, setCurrentOption } = props;

  return (
    <>
      <Dropdown drop="up" size="sm" onSelect={(eventKey) => setCurrentOption(eventKey)} className="map-options-dropdown">
        <Dropdown.Toggle variant="light" id="dropdown-map-option-button">
          {currentOption || "Change selection"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          {options.map((option) => (
            <Dropdown.Item key={option} eventKey={option} className="dropdown-item">
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const MapForm = (props) => {
  const [initialPosition, setInitalPosition] = useState([67.85, 20.217]);
  const [initialZoom, setInitalZoom] = useState(11);
  const [mapView, setMapView] = useState("satellite");
  const mapStyles = {
    satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
    streets: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    terrain: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    outdoor: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapContainerClass = "map-container";
  const mapFullscreenClass = "map-fullscreen";
  const [mapSizeClass, setMapSizeClass] = useState(mapContainerClass);

  const predefinedPoint = "Predefined point";
  const predefinedArea = "Predefined area";
  const customPoint = "Custom point";
  const customArea = "Custom area";
  const options = [predefinedPoint, predefinedArea, customPoint, customArea];
  const [currentOption, setCurrentOption] = useState(undefined);

  const [position, setPosition] = useState({ lat: null, long: null, name: null });
  const [area, setArea] = useState([]);

  const newPosition = (lat, long, name = null) => setPosition({ lat: lat, long: long, name: name });
  const clearPosition = () => setPosition({ lat: null, long: null, name: null });

  const resetOptionOnChange = () => clearPosition();

  const ResizeMap = () => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        map.invalidateSize();
        map.setView(initialPosition, initialZoom);
      }
    }, [map]);

    return null;
  };

  useEffect(() => {
    if (isFullscreen) {
      setMapSizeClass(mapFullscreenClass);
      setInitalZoom(12);
    } else {
      setMapSizeClass(mapContainerClass);
      setInitalZoom(11);
    }
  }, [isFullscreen]);

  return (
    <div style={{ height: "50vh", width: "50vw" }}>
      <div className={mapSizeClass}>
        <MapContainer key={isFullscreen} center={initialPosition} zoom={initialZoom} style={{ height: "100%", width: "100%" }}>
          <ResizeButton isFullscreen={isFullscreen} toggleResize={() => setIsFullscreen(!isFullscreen)} />
          {isFullscreen && (
            <DropdownMapOptions
              options={options}
              currentOption={currentOption}
              setCurrentOption={(option) => {
                if (currentOption !== option) {
                  resetOptionOnChange();
                  setCurrentOption(option);
                }
              }}
            />
          )}
          {isFullscreen && currentOption === predefinedPoint && <MapLayoutPredefinedPoint position newPosition={newPosition} />}
          {isFullscreen && currentOption === predefinedArea && <MapLayoutPredefinedArea />}
          {isFullscreen && currentOption === customPoint && <MapLayoutCustomPoint position={position} newPosition={newPosition} />}
          {isFullscreen && currentOption === customArea && <></>}
          {position.lat && position.long && (
            <>
              <Marker position={[position.lat, position.long]} data-testid="map-marker" zIndexOffset={10}>
                <Popup>
                  {position.name && (
                    <>
                      {`Name: ${position.name}`}
                      <br />
                    </>
                  )}
                  Latitude: {position.lat}
                  <br />
                  Longitude: {position.long}
                </Popup>
              </Marker>
              <ClearPositionButton clearPosition={clearPosition} />
            </>
          )}
          <TileLayer url={mapStyles[mapView]} />
          <ResizeMap />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapForm;
