import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker, Popup } from 'react-leaflet';
import { Tooltip } from 'react-leaflet';

import '../../styles/MapNavigation.css';
import fetchData from '../MapUtils/DataFetching';
import  {createCustomIcon}  from '../MapUtils/CustomIcon';
import SearchBar from "./SearchBar";

//It takes newPoint and newArea as props, which are functions to set the new point or area in the parent component 
function MapLayoutPredefinedPosition(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renderNumber,setRenderNumeber] = useState(0);
    const [error, setError] = useState(null);
    const [filteredDocuments,setFilteredDocuments] = useState([]);
    const [filtering,setFiltering] = useState(false);

    // Fetch documents from the API
    useEffect(() => {
        setLoading(true);    
        fetchData('All',setData, setError, setLoading);
    }, []);
    // Filter documents with coordinates
    const coordDocuments = !filtering ? data.filter(doc => doc.lat != null && doc.long != null) : filteredDocuments.filter(doc => doc.lat != null && doc.long != null);

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
                        }}>
                            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                                {doc.title} 
                            </Tooltip>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                <SearchBar documents={data} setFilteredDocuments={setFilteredDocuments} setFiltering={setFiltering} />
                
                {/* Popup with the document title, we will add also pos */}
                {props.selectedDoc!==null && ((() => {
                        const pos = [props.selectedDoc.lat, props.selectedDoc.long];
                        const myKey = props.selectedDoc.id+renderNumber;
                        return (
                            <Popup position={pos} maxWidth={800} key={myKey}  closeButton={true} autoClose={false} closeOnEscapeKey={false} closeOnClick={false}>
                                <p>
                                    {props.selectedDoc.title}
                                    <br></br>
                                    {props.selectedDoc?.area ? `Area` : `Position:${props.selectedDoc.lat}-${props.selectedDoc.long}`}
                                </p>
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
