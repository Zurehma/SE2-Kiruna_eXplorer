import React, { useEffect } from 'react';
import { Polygon } from 'react-leaflet';

function KirunaMunicipality(props) { //it takes geoJsonData, setGeoJsonData and setHighestPoint as props
    //fetch the geojson file and set the data
    useEffect(() => {
        const loadGeoJson = async () => {
            try {
                const response = await fetch('/assets/KirunaMunicipality.geojson'); 
                const data = await response.json();
                props.setGeoJsonData(data);
            } catch (error) {
                console.error('Errore durante il caricamento del GeoJSON:', error);
            }
        };

        loadGeoJson();
    }, []);
    
    //Flat it, since it is a multipolygon
    const getCoordinates = () => {
        if (!props.geoJsonData) return [];
        const multiPolygonCoordinates = props.geoJsonData.features[0].geometry.coordinates;
        return multiPolygonCoordinates.flatMap(polygon =>
            polygon.map(ring => ring.map(coord => [coord[1], coord[0]]))
        );
    };

    return (
        <>
        {/* Draw the entire municipality, as stated in the FAQ, it should be always be visible */}
        {props.geoJsonData && (
            <Polygon pathOptions={{ color: 'blue' }} positions={getCoordinates()} />
        )}
        </>
    );
}

export default KirunaMunicipality;