import React, { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { Marker, Popup, useMap } from "react-leaflet";
import { MyPopup } from "./MyPopup";

const icons = {};

// Fetching or creating the icon for clusters
const fetchIcon = (count, size) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="display: flex; align-items: center; justify-content: center; 
              width: ${size}px; height: ${size}px; background: rgba(0, 123, 255, 0.6); 
              border-radius: 50%; color: white; font-size: 14px;">
                ${count}
             </div>`,
      className: 'cluster-icon', // Make sure this matches your CSS or remove if not needed
    });
  }
  return icons[count];
};

function ShowDocuments({ data, createCustomIcon,setSelectedDoc, setRenderNumeber,renderNumber }) {
  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);
  const map = useMap();

  // Function to update map bounds
  const updateMap = () => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom()); 
  };

  const onMove = useCallback(updateMap, [map]);

  useEffect(() => {
    updateMap();
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  const points = data.map((doc) => ({
    type: "Feature",
    properties: { cluster: false, docId: doc.id, type: doc.type },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(doc.long), parseFloat(doc.lat)],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points: points,
    bounds: bounds,
    zoom: zoom,
    options: { radius: 75, maxZoom: 17 },
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(pointCount, 10 + (pointCount / points.length) * 30)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    maxZoom
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }

        // Single document marker
        const doc = data.find((d) => d.id === cluster.properties.docId);
        const customIcon = createCustomIcon(doc.type);
        return (
          <Marker key={doc.id} position={[doc.lat, doc.long]} icon={customIcon}
          eventHandlers={{
            click: () => {
              // Quando un marker viene cliccato, aggiorniamo lo stato del documento selezionato
              setSelectedDoc(doc); // Passiamo il documento selezionato a Map2
              setRenderNumeber((renderNumber) => renderNumber + 1); // Aggiorniamo il numero di render
            },
          }}
          >
          </Marker>
        );
      })}
    </>
  );
}

export { ShowDocuments };
