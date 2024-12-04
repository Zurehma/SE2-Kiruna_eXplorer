import { useEffect } from 'react';


function LoadGeoJson(props) { //it takes geoJsonData and setGeoJsonData as props
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
    
    
    return;
}

export default LoadGeoJson;