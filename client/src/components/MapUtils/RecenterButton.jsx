import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Custom hook to recenter the map
const RecenterMap = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom); // Set the map view to the new position and zoom
    }, [map, position, zoom]);

    return null;
}

function RecenterButton(props) { //it takes setPositionActual,setZoomLevel,positionActual,zoomLevel as props
  
    // Function to recenter the map on Kiruna with zoom reset to 13
    const recenterMap = () => {
        const validZoom = (zoom) => zoom >= 0;
        const validPosition = (position) => 
            Array.isArray(position) && 
            position.length === 2 && 
            position.every(coord => typeof coord === 'number' && coord >= -90 && coord <= 90);

        if (validPosition(props.initialPosition) && validZoom(11)) {
            props.setPositionActual(props.initialPosition);
            props.setZoomLevel(11);
        } else {
            console.error('Invalid position or zoom level');
        }
    };

    return(
        <>
            {/*Button to recenter the map*/}
            <RecenterMap position={props.positionActual} zoom={props.zoomLevel} />
            <button onClick={recenterMap} className='myRecenterButton'>
                <i className="bi bi-compass myMapIcons"></i>
            </button>
        </>

    );
};

export default RecenterButton;