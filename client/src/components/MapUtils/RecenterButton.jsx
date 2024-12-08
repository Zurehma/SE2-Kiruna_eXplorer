import React from 'react';
import { useMap } from 'react-leaflet';

function RecenterButton(props) {
    const map = useMap(); // Ottenere l'accesso all'istanza della mappa
    const buttonClass = props.draw === true ? 'myRecenterButtonCustomArea' : 'myRecenterButton';

    const recenterMap = () => {
        const validZoom = (zoom) => zoom >= 0;
        const validPosition = (position) => 
            Array.isArray(position) && 
            position.length === 2 && 
            position.every(coord => typeof coord === 'number' && coord >= -90 && coord <= 90);

        if (validPosition(props.initialPosition) && validZoom(11)) {
            console.log('Recentering map to initial position');
            map.setView(props.initialPosition, 11); // Imposta direttamente la vista della mappa
        } else {
            console.error('Invalid position or zoom level');
        }
    };

    return(
        <>
            {/*Bottone per ricentrare la mappa*/}
            <button onClick={(event) => { recenterMap(); event.preventDefault(); }} className={buttonClass} type="button">
                <i className="bi bi-compass myMapIcons"></i>
            </button>
        </>
    );
};

export default RecenterButton;
