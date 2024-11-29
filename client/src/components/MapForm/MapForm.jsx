import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { booleanPointInPolygon } from "@turf/turf";


import "../../styles/MapForm.css";

import { Button, Dropdown } from "react-bootstrap";
import MapLayoutCustomPoint from "./MapLayoutCustomPoint";
import MapLayoutPredefinedPoint from "./MapFormLayoutPredefinedPoint";
import MapLayoutPredefinedArea from "./MapFormLayoutPredefinedArea";
import KirunaMunicipality from "../MapUtils/KirunaMunicipality";
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
  const [initialZoom, setInitalZoom] = useState(7);
  const [mapView, setMapView] = useState("satellite");
  const [geoJsonData, setGeoJsonData] = useState(null);

  //validate coordinates: verify they're in the Kiruna Municipality
  const validateCoordinates = (coord) => {
    if (!geoJsonData) return false;
    const multiPolygon = geoJsonData.features[0]; 
    if (coord.type === "Point") {
      // Converte le coordinate in un oggetto punto GeoJSON
      const point = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coord.coordinates, // [lng, lat]
        },
      };
      // Verifica se il punto è dentro il MultiPolygon
      return booleanPointInPolygon(point, multiPolygon);
    } else {
      // TODO: Verifica per un'area (multi-coordinates)
      return false;
    }
  };
  

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

  const [position, setPosition] = useState(props.position || { type: null, coordinates: null, name: null });

  const handleSetPoint = (lat, long, name) => {
    setPosition({ type: "Point", coordinates: { lat: lat, long: long }, name: name });
  };
  const handleSetArea = (coordinates, name) => {
    setPosition({ type: "Area", coordinates: coordinates, name: name });
  };
  const clearPosition = () => setPosition({ type: null, coordinates: null, name: null });

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
  }, [...Object.values(position)]);

  useEffect(() => {
    if (isFullscreen) {
      setMapSizeClass(mapFullscreenClass);
      setOverlay("overlay");
      if (currentMode === predefinedArea) {
        setInitalZoom(7);
      } else {
        setInitalZoom(11);
      }
    } else {
      setMapSizeClass(mapContainerClass);
      setOverlay("without-overlay");
      setInitalZoom(8);
    }
  }, [isFullscreen, currentMode]);

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
          {isFullscreen && currentMode === predefinedPoint && <MapLayoutPredefinedPoint position={position} newPoint={handleSetPoint} />}
          {isFullscreen && currentMode === predefinedArea && <MapLayoutPredefinedArea position={position} newArea={handleSetArea} />}
          {isFullscreen && currentMode === customPoint && <MapLayoutCustomPoint position={position} newPoint={handleSetPoint} validateCoordinates={validateCoordinates} />}
          {isFullscreen && currentMode === customArea && <></>}
          {/* Show the borders only when a custom point or area is concerned */}
          {isFullscreen && (currentMode === predefinedArea || currentMode ===customPoint) && <KirunaMunicipality setGeoJsonData={setGeoJsonData} geoJsonData={geoJsonData} />}
          {position && position.type === "Point" && (
            <Marker position={[position.coordinates.lat, position.coordinates.long]} data-testid="map-marker" zIndexOffset={10}>
              <Popup>
                {position.name && (
                  <>
                    {`Name: ${position.name}`}
                    <br />
                  </>
                )}
                Latitude: {position.coordinates.lat}
                <br />
                Longitude: {position.coordinates.long}
              </Popup>
            </Marker>
          )}
          {position && position.type === "Area" && (
            <Polygon positions={position.coordinates} color="black" weight={3} fillColor="blue">
              {position.name && <Popup>Name: {position.name}</Popup>}
            </Polygon>
          )}
          {position && position.coordinates && <ClearPositionButton clearPosition={clearPosition} />}
          <TileLayer url={mapStyles[mapView]} />
          <ResizeMap />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapForm;
