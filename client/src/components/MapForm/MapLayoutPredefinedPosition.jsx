import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import '../../styles/MapNavigation.css';
import API from '../../../API';

// Icon mapping based on document type
const iconMap = {
    Design: 'bi-file-earmark-text',
    Informative: 'bi-info-circle',
    Prescriptive: 'bi-arrow-right-square',
    Technical: 'bi-file-earmark-code',
    Agreement: 'bi-people-fill',
    Conflict: 'bi-x-circle',
    Consultation: 'bi-chat-dots',
    Action: 'bi-exclamation-triangle',
    Material: 'bi-file-earmark-binary',
};

// Function to create a custom divIcon with a specific icon inside
const createCustomIcon = (type, selected) => {
    const iconClass = iconMap[type] || 'bi-file-earmark';
    const backgroundColor = selected ? 'yellow' : 'white'; // Cambia il colore di sfondo

    return L.divIcon({
        html: `
            <div style="display: flex; align-items: center; justify-content: center; background: ${backgroundColor}; 
                width: 25px; height: 25px; border-radius: 50%; border: 2px solid black;">
                <i class="bi ${iconClass}" style="color: black; font-size: 12px;"></i>
            </div>`,
        className: '' // Clear default class
    });
};



//It takes newPoint and newArea as props, which are functions to set the new point or area in the parent component 
function MapLayoutPredefinedPosition(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renderNumber,setRenderNumeber] = useState(0);

    // Fetch documents from the API
    useEffect(() => {
        setLoading(true);    
        const fetchData = async () => {
            try {
                const documents = await API.filterDocuments('All');
                const updatedDocuments = documents.map(doc => {
                    console.log(documents)
                    if (!doc.coordinates || doc.coordinates.length === 0) {
                        return { ...doc, lat: null, long: null };
                    } else {
                        if (doc.coordinates.length > 1) {
                            // Function to find the highest point in a polygon, where the popup and the marker will be shown
                            const highestPoint = doc.coordinates.reduce((max, [lat, long]) => {
                                return lat > max.lat ? { lat, long } : max;
                            }, { lat: doc.coordinates[0][0], long: doc.coordinates[0][1] });
            
                            const area = doc.coordinates.map(([lat, long]) => [lat, long]);
            
                            return {
                                ...doc, lat: highestPoint.lat, long: highestPoint.long,area};
                        } else {
                            // Single coordinate
                            const { lat, long } = doc.coordinates;
                            return { 
                                ...doc, lat, long
                            };
                        }
                    }
                });
                setData(updatedDocuments);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    // Filter documents with coordinates
    const coordDocuments = data.filter(doc => doc.lat != null && doc.long != null);

    const handleClick = (doc) => {
        props.setSelectedDoc(doc); 
        setRenderNumeber(renderNumber+1);
        if(doc.area){
            //set the area
            props.newArea(doc.area);
        }else{
            //set the point
            props.newPoint(doc.lat, doc.long);
        }
    }
    
    return (
        <>
            {loading && (<p>Loading...</p>)}
            {!loading && (
                <>
                {/* Draw clusters or icons depending on the zoom: also the exact same position is managed in this case */}
                <MarkerClusterGroup>
                    {coordDocuments.map((doc) => (
                        <Marker key={doc.id} position={[doc.lat, doc.long]} 
                            icon={doc.id === props.selectedDoc?.id ? createCustomIcon(doc.type, true) : createCustomIcon(doc.type, false)}
                            eventHandlers={{click: () => {handleClick(doc)}
                        }}/>
                    ))}
                </MarkerClusterGroup>
                
                {/* Popup with the document title, we will add also pos */}
                {props.selectedDoc!==null && ((() => {
                        const pos = [props.selectedDoc.lat, props.selectedDoc.long];
                        const myKey = props.selectedDoc.id+renderNumber;
                        return (
                            <Popup position={pos} maxWidth={800} key={myKey}  closeButton={true} autoClose={false} closeOnEscapeKey={false} closeOnClick={false}>
                                <p>{props.selectedDoc.title}</p>
                            </Popup>
                        );
                    })()
                )}
                </>
            )}
        </>
    );
}

export default MapLayoutPredefinedPosition;
