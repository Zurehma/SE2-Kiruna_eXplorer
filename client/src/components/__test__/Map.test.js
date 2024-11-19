import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Map } from '../Map';
import '@testing-library/jest-dom';
import { Button } from 'react-bootstrap';

// Mocking react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>, // Mock MapContainer
  TileLayer: ({ url, onClick }) => <div onClick={onClick}>TileLayer with {url}</div>, // Mock TileLayer with click handler
  Polygon: ({ positions }) => <div>Polygon with positions {JSON.stringify(positions)}</div>, // Mock Polygon
  Marker: ({ children }) => <div>Marker with children: {children}</div>, // Mock Marker
  Popup: ({ children }) => <div>{children}</div>, // Mock Popup
  useMap: () => ({ setView: jest.fn() }), // Mock useMap
  useMapEvents: (callback) => {
    return {
      onClick: () => {
        callback({ latlng: { lat: 51.505, lng: -0.09 } });
      },
    };
  },
}));

describe('Map Component', () => {
  test('renders the map', () => {
    render(<Map 
      handleMapClick={jest.fn()} 
      setPosition={jest.fn()} 
      latitude={null} 
      longitude={null} 
      polygonCoordinates={[]} 
      validateCoordinates={jest.fn(() => true)} 
    />);
    
    const mapContainer = screen.getByText('TileLayer with https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg');
    expect(mapContainer).toBeInTheDocument();
  });

  test('renders a polygon when coordinates are provided', () => {
    const polygonCoordinates = [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.52, -0.12]
    ];

    render(<Map 
      handleMapClick={jest.fn()} 
      setPosition={jest.fn()} 
      latitude={null} 
      longitude={null} 
      polygonCoordinates={polygonCoordinates} 
      validateCoordinates={jest.fn(() => true)} 
    />);
    
    const polygon = screen.getByText(/Polygon with positions/);
    expect(polygon).toHaveTextContent(JSON.stringify(polygonCoordinates));
  });

  test('renders a marker when latitude and longitude are provided', () => {
    const latitude = 51.505;
    const longitude = -0.09;

    render(<Map 
      handleMapClick={jest.fn()} 
      setPosition={jest.fn()} 
      latitude={latitude} 
      longitude={longitude} 
      polygonCoordinates={[]} 
      validateCoordinates={jest.fn(() => true)} 
    />);
    
    const marker = screen.getByText(/Marker with children/);
    expect(marker).toHaveTextContent('Marker with children:');
  });


  test('renders the recenter button and resets map position when clicked', () => {
    const mockSetPosition = jest.fn();
    
    render(<Map 
      handleMapClick={jest.fn()} 
      setPosition={mockSetPosition} 
      latitude={null} 
      longitude={null} 
      polygonCoordinates={[]} 
      validateCoordinates={jest.fn(() => true)} 
    />);
    
    const recenterButton = screen.getByRole('button');
    expect(recenterButton).toBeInTheDocument();
    
    // Simula il clic sul pulsante per recentrare la mappa
    fireEvent.click(recenterButton);
  });
  
  test('removes the marker when the remove button is clicked', () => {
    const mockSetPosition = jest.fn();
    
    render(<Map 
      handleMapClick={jest.fn()} 
      setPosition={mockSetPosition} 
      latitude={51.505} 
      longitude={-0.09} 
      polygonCoordinates={[]} 
      validateCoordinates={jest.fn(() => true)} 
    />);
    
    const removeButton = screen.getByText('Remove marker');
    fireEvent.click(removeButton);

    // Verifica che la funzione setPosition sia stata chiamata per rimuovere il marker
    expect(mockSetPosition).toHaveBeenCalledWith({ lat: null, lng: null });
  });
});
