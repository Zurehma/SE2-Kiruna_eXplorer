import React from 'react';
import DocumentChartStatic from './Graph.jsx'
import MapNavigation from './MapNavigation/MapNavigation.jsx';

const MapAndGraph = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* MapNavigation Component (top) */}
      <div style={{ flex: 1, padding: '10px', backgroundColor: '#f4f4f4' }}>
        <MapNavigation />
      </div>

      {/* Graph Component (bottom) */}
      <div style={{ flex: 1, padding: '10px', backgroundColor: '#e0e0e0' }}>
        <DocumentChartStatic />
      </div>
    </div>
  );
};

export default MapAndGraph;
