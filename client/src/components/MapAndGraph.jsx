import React from 'react';
import DocumentChartStatic from './Graph.jsx'
import MapNavigation from './MapNavigation/MapNavigation.jsx';

function MapAndGraph(props){
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div>
        <MapNavigation setError={props.setError} loggedIn={props.loggedIn}/>
      </div>
      <div>
        <DocumentChartStatic />
      </div>
    </div>
  );
};

export default MapAndGraph;
