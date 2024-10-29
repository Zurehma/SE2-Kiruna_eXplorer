import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';
import { MyPopup } from './MyPopup';

// Custom icon for markers
const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Sample data with latitude and longitude fields
const data = [
    {
        type : "Action",
        title: "Town Hall Demolition",
        stakeholders: "LKAB",
        scale: "Blueprints/Effects",
        issuanceDate: "04/2019",
        connections: 3,
        description: "Demolition of old town hall. I need this description to be longer to simulate what will happen in the real case where descriptions could reach a length between 150 and 200 characters, or at least this is at I suppose. I hope this is enough.",
        latitude: 67.850,
        longitude: 20.217
    },
    {
        type: "Design",
        title: "New Building Construction",
        stakeholders: "City of Kiruna",
        scale: "Large",
        issuanceDate: "06/2020",
        connections: 5,
        description: "Construction of new infrastructure. I need this description to be longer to simulate what will happen in the real case where descriptions could reach a length between 150 and 200 characters, or at least this is at I suppose. I hope this is enough.",
        latitude: 67.853,
        longitude: 20.220
    },
    {
        type: "Conflict",
        title: "Placeholder Example",
        stakeholders: "Unknown",
        scale: "N/A",
        issuanceDate: "N/A",
        connections: 0,
        description: "This is a placeholder with null coordinates. I need this description to be longer to simulate what will happen in the real case where descriptions could reach a length between 150 and 200 characters, or at least this is at I suppose. I hope this is enough.",
        latitude: null,
        longitude: null
    }
];

function getRandomOffset() {
    const offset = 0.002; // Adjusted for visible spread
    return [
        (Math.random() - 0.5) * offset, 
        (Math.random() - 0.5) * offset
    ];
}

function Map2() {
    const cornerPosition = [67.834, 20.135]; // Corner position

    return (
        <MapContainer center={[67.850, 20.217]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
                attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.map((item, index) => {
                const position = item.latitude !== null && item.longitude !== null 
                    ? [item.latitude, item.longitude] 
                    : [cornerPosition[0] + getRandomOffset()[0], cornerPosition[1] + getRandomOffset()[1]];
                return (
                    <Marker key={index} position={position} icon={icon}>
                        <Popup maxWidth={600}>
                            <MyPopup doc={item} />
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export { Map2 };
