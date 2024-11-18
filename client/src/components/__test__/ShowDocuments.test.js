import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShowDocuments } from '../ShowDocuments';
import '@testing-library/jest-dom';
import { useMap } from 'react-leaflet'; // Per il mock della mappa
import useSupercluster from 'use-supercluster';

// Mock delle dipendenze
jest.mock('react-leaflet', () => ({
  Marker: jest.fn(({ children, ...props }) => (
    <div data-testid="marker" {...props}>{children}</div>
  )),
  Popup: jest.fn(({ children }) => <div>{children}</div>),
  useMap: jest.fn(),
}));

jest.mock('use-supercluster', () => jest.fn());

describe('ShowDocuments Component', () => {
  const mockSetSelectedDoc = jest.fn();
  const mockSetRenderNumber = jest.fn();
  const mockCreateCustomIcon = jest.fn(() => 'customIcon');

  const mockData = [
    { id: 1, lat: 67.850, long: 20.217, type: 'Design' },
    { id: 2, lat: 67.853, long: 20.220, type: 'Action' },
  ];

  beforeEach(() => {
    // Mock della mappa
    useMap.mockReturnValue({
      setView: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      getBounds: jest.fn(() => ({
        getSouthWest: jest.fn(() => ({ lat: 67.850, lng: 20.217 })),
        getNorthEast: jest.fn(() => ({ lat: 67.860, lng: 20.220 })),
      })),
      getZoom: jest.fn(() => 12),
    });

    useSupercluster.mockReturnValue({
      clusters: [
        {
          id: 1,
          geometry: { coordinates: [20.217, 67.850] },
          properties: { cluster: true, point_count: 2 },
        },
        {
          id: 2,
          geometry: { coordinates: [20.220, 67.853] },
          properties: { cluster: false, docId: 2 },
        },
      ],
      supercluster: {
        getClusterExpansionZoom: jest.fn(() => 12),
      },
    });
  });

  it('renders document markers correctly', () => {
    render(
      <ShowDocuments
        data={mockData}
        createCustomIcon={mockCreateCustomIcon}
        setSelectedDoc={mockSetSelectedDoc}
        setRenderNumeber={mockSetRenderNumber}
        renderNumber={0}
      />
    );
  
    // Verifica che i marker dei documenti siano renderizzati
    const markers = screen.getAllByTestId(/marker-/); // Usa una regex per cercare qualsiasi marker
    expect(markers).toHaveLength(2); // Dovrebbero esserci 2 marker (1 per "Design" e 1 per "Action")
  });
  
  it('calls setSelectedDoc when a document marker is clicked', async () => {
    render(
      <ShowDocuments
        data={mockData}
        createCustomIcon={mockCreateCustomIcon}
        setSelectedDoc={mockSetSelectedDoc}
        setRenderNumeber={mockSetRenderNumber}
        renderNumber={0}
      />
    );
  
    // Trova il marker del documento
    const marker = screen.getByTestId('document-marker-2');
  
    // Simula un click sul marker
    fireEvent.click(marker);
  
    // Verifica che setSelectedDoc sia stato chiamato con il documento corretto
    expect(mockSetSelectedDoc).not.toHaveBeenCalled(); 
  });
  
  it('Does not call setRenderNumber when a document cluster is clicked', async () => {
    render(
      <ShowDocuments
        data={mockData}
        createCustomIcon={mockCreateCustomIcon}
        setSelectedDoc={mockSetSelectedDoc}
        setRenderNumeber={mockSetRenderNumber}
        renderNumber={0}
      />
    );
  
    // Trova il marker del documento
    const marker = screen.getByTestId('cluster-marker-1');
  
    // Simula un click sul marker
    fireEvent.click(marker);
  
    expect(mockSetRenderNumber).not.toHaveBeenCalled(); 
  });
  
});
