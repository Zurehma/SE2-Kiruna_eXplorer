import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from "react-leaflet";
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
        type="button"
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
      <Button type="button" variant="secondary" size="sm" className="clear-position-button" onClick={() => clearPosition()}>
        Clear
      </Button>
    </>
  );
};

const DropdownMapMode = (props) => {
  const { modeList, currentMode, setCurrentMode } = props;

  return (
    <>
      <Dropdown drop="up" size="sm" onSelect={(eventKey) => setCurrentMode(eventKey)} className="map-mode-dropdown">
        <Dropdown.Toggle variant="light" id="dropdown-map-mode-button">
          {currentMode || "Change mode"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          {modeList.map((mode) => (
            <Dropdown.Item key={mode} eventKey={mode} className="dropdown-item">
              {mode}
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
  const [overlay, setOverlay] = useState("without-overlay");

  const predefinedPoint = "Predefined point";
  const predefinedArea = "Predefined area";
  const customPoint = "Custom point";
  const customArea = "Custom area";
  const modeList = [predefinedPoint, predefinedArea, customPoint, customArea];
  const [currentMode, setCurrentMode] = useState(undefined);

  const [position, setPosition] = useState(props.position || undefined);

  const newPoint = (lat, long, name = null) => setPosition({ type: "Point", lat: lat, long: long, name: name });
  const newArea = (coordinates, name) => setPosition({ type: "Area", coordinates: coordinates, name: name });
  const clearPosition = () => setPosition(undefined);

  const resetOnChange = () => {
    clearPosition();
  };

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
    props.setPosition(position);
  }, [position]);

  useEffect(() => {
    if (isFullscreen) {
      setMapSizeClass(mapFullscreenClass);
      setOverlay("overlay");
      setInitalZoom(12);
    } else {
      setMapSizeClass(mapContainerClass);
      setOverlay("without-overlay");
      setInitalZoom(11);
    }
  }, [isFullscreen]);

  return (
    <div className={overlay}>
      <div className={mapSizeClass}>
        <MapContainer key={isFullscreen} center={initialPosition} zoom={initialZoom} style={{ height: "100%", width: "100%" }}>
          <ResizeButton isFullscreen={isFullscreen} toggleResize={() => setIsFullscreen(!isFullscreen)} />
          {isFullscreen && (
            <DropdownMapMode
              modeList={modeList}
              currentMode={currentMode}
              setCurrentMode={(mode) => {
                if (currentMode !== mode) {
                  resetOnChange();
                  setCurrentMode(mode);
                }
              }}
            />
          )}
          {isFullscreen && currentMode === predefinedPoint && <MapLayoutPredefinedPoint newPoint={newPoint} />}
          {isFullscreen && currentMode === predefinedArea && <MapLayoutPredefinedArea newArea={newArea} />}
          {isFullscreen && currentMode === customPoint && <MapLayoutCustomPoint position={position} newPoint={newPoint} />}
          {isFullscreen && currentMode === customArea && <></>}
          {position && position.type === "Point" && (
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
            </>
          )}
          {position && position.type === "Area " && (
            <Polygon positions={position.coordinates} color="black" weight={3} fillColor="lightblue" zIndexOffset={10}>
              {position.name && <Popup>Name: {position.name}</Popup>}
            </Polygon>
          )}
          {position && <ClearPositionButton clearPosition={clearPosition} />}
          <TileLayer url={mapStyles[mapView]} />
          <ResizeMap />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapForm;
