import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { booleanPointInPolygon, point } from "@turf/turf";

import "../../styles/MapForm.css";

import { Button } from "react-bootstrap";
import MapLayoutCustomPoint from "./MapLayoutCustomPoint";
import MapLayoutPredefinedPosition from "./MapLayoutPredefinedPosition";
import KirunaMunicipality from "../MapUtils/KirunaMunicipality";
import MapFormLayoutCustomArea from "./MapFormLayoutCustomArea";
import LoadGeoJson from "../MapUtils/LoadGeoJson";
import MapControlPanel from "./SideBarMenu";
import RecenterButton from '../MapUtils/RecenterButton';


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
      <Button type="button" variant="light" size="sm" className="resize-button"
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



const MapForm = (props) => {
  const [initialPosition, setInitalPosition] = useState([67.85, 20.217]);
  const [initialZoom, setInitalZoom] = useState(7);
  const [mapView, setMapView] = useState("satellite");
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null); 
  const KirunaCenter = [67.85, 20.217];


  //validate coordinates: verify they're in the Kiruna Municipality
  const validateCoordinates = (lat, long) => {
    if (!geoJsonData) return false;

    const multiPolygon = geoJsonData.features[0];

    if (!(lat && long)) {
      return false;
    }

    // Converte le coordinate in un oggetto punto GeoJSON
    const p = point([long, lat]);
    // Verifica se il punto è dentro il MultiPolygon
    return booleanPointInPolygon(p, multiPolygon);
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

  const predefinedPosition = "Predefined position";
  const customPoint = "Custom point";
  const customArea = "Custom area";
  const explore = "Explore";
  const modeList = [explore, predefinedPosition, customPoint, customArea];
  const [currentMode, setCurrentMode] = useState(explore);

  const [position, setPosition] = useState(props.position || { type: null, coordinates: null, name: null });

  const handleSetPoint = (lat, long, name = null) => {
    setPosition({ type: "Point", coordinates: { lat: lat, long: long }, name: name });
  };

  const handleSetArea = (coordinates, name = null) => {
    setPosition({ type: "Area", coordinates: coordinates, name: name });
  };
  const clearPosition = () => {setPosition({ type: null, coordinates: null, name: null }); setSelectedDoc(null);};

  const ResizeMap = () => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        map.invalidateSize();
        /*map.setView(initialPosition, initialZoom);*/
      }
    }, [map]);

    return null;
  };

  useEffect(() => {
    props.setPosition(position);
  }, [position.coordinates, position.type]);

  useEffect(() => {
    setInitalZoom(11);
    if (isFullscreen) {
      setMapSizeClass(mapFullscreenClass);
      setOverlay("overlay");
    } else {
      setMapSizeClass(mapContainerClass);
      setOverlay("without-overlay");
    }
  }, [isFullscreen]);

  return (
    <div className={overlay}>
      <div className={mapSizeClass}>
        <MapContainer key={isFullscreen} center={initialPosition} zoom={initialZoom} maxZoom={18} style={{ height: "100%", width: "100%" }}>
          <ResizeButton isFullscreen={isFullscreen} toggleResize={() => setIsFullscreen(!isFullscreen)} />
          
          {isFullscreen && <MapControlPanel modeList={modeList} currentMode={currentMode} setCurrentMode={setCurrentMode} clearPosition={clearPosition} position={position} newPoint={handleSetPoint} validateCoordinates={validateCoordinates}  />}
          {isFullscreen && currentMode === predefinedPosition && <MapLayoutPredefinedPosition selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} newPoint={handleSetPoint} newArea={handleSetArea} />}
          {isFullscreen && currentMode === customPoint && (
            <MapLayoutCustomPoint position={position} newPoint={handleSetPoint} validateCoordinates={validateCoordinates} />
          )}
          {isFullscreen && currentMode === customArea && (
            <MapFormLayoutCustomArea isFullscreen={isFullscreen} position={position} newArea={handleSetArea} validateCoordinates={validateCoordinates} />
          )}
          {/* Show the borders only when a custom point or area is concerned */}
          <LoadGeoJson setGeoJsonData={setGeoJsonData} geoJsonData={geoJsonData} />
          {geoJsonData && isFullscreen && (currentMode === customArea || currentMode === customPoint) && (
            <KirunaMunicipality  geoJsonData={geoJsonData} />
          )}
          {/** Show the marker or area on the map, but if it's a predefined position, show it only if the map is small */}
          {position && position.type === "Point" && (!isFullscreen || currentMode!==predefinedPosition) &&(
            <Marker position={[position.coordinates.lat, position.coordinates.long]} data-testid="map-marker" zIndexOffset={10}>
            </Marker>
          )}
          {position && position.type === "Area" && (
            <Polygon positions={position.coordinates} color="black" weight={3} fillColor="blue">
              {position.name && <Popup>Name: {position.name}</Popup>}
            </Polygon>
          )}
          {position && position.coordinates && !isFullscreen && <ClearPositionButton clearPosition={clearPosition} />}
          <TileLayer url={mapStyles[mapView]} />
          <RecenterButton initialPosition={KirunaCenter} positionActual={KirunaCenter} setPositionActual={setInitalPosition} zoomLevel={initialZoom} setZoomLevel={setInitalZoom} draw={currentMode === 'Custom area'} />
          <ResizeMap />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapForm;
