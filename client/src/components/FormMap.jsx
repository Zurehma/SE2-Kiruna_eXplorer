import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "../styles/FormMap.css";

import { Button, Dropdown } from "react-bootstrap";

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
      <Button
        variant="danger"
        size="sm"
        className="clear-position-button"
        onClick={(e) => {
          e.stopPropagation();
          clearPosition();
        }}
      >
        Remove marker
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

const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  return null;
};

const FormMap = (props) => {
  const initialPosition = [67.85, 20.217];
  const initialZoom = 11;
  const mapContainerRef = useRef(null);
  const [mapView, setMapView] = useState("satellite");
  const mapStyles = {
    satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
    streets: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    terrain: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    outdoor: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerSize = { height: "100%", width: "100%" };
  const [mapSizeClass, setMapSizeClass] = useState("map-container");

  const options = ["Predefined point", "Predefined area", "Custom point", "Custom area"];
  const [currentOption, setCurrentOption] = useState("");

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const clickOnMap = e.originalEvent.target.className.startsWith("leaflet-container");

        if (clickOnMap && currentOption === "Custom point") {
          const newLat = e.latlng.lat;
          const newLong = e.latlng.lng;

          setLat(newLat);
          setLong(newLong);
        }
      },
    });
    return null;
  };

  const resetOption = () => {
    setLat(null);
    setLong(null);
  };

  useEffect(() => {
    if (isFullscreen) {
      setMapSizeClass("map-fullscreen");
    } else {
      setMapSizeClass("map-container");
    }
  }, [isFullscreen]);

  return (
    <div style={{ height: "50vh", width: "50vw" }}>
      <div className={mapSizeClass} ref={mapContainerRef}>
        <MapContainer center={initialPosition} zoom={initialZoom} style={containerSize}>
          <ResizeMap />
          <ResizeButton
            isFullscreen={isFullscreen}
            toggleResize={() => {
              setIsFullscreen(!isFullscreen);
            }}
          />
          {currentOption === "Custom point" && (
            <ClearPositionButton
              clearPosition={() => {
                setLat(null);
                setLong(null);
              }}
            />
          )}
          <DropdownMapOptions
            options={options}
            currentOption={currentOption}
            setCurrentOption={(option) => {
              resetOption();
              setCurrentOption(option);
            }}
          />
          <MapClickHandler />
          {lat && long && (
            <Marker position={[lat, long]} data-testid="map-marker">
              <Popup>
                Latitude: {lat}
                <br />
                Longitude: {long}
              </Popup>
            </Marker>
          )}
          <TileLayer url={mapStyles[mapView]} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FormMap;
