import React from 'react';
import { render, screen } from '@testing-library/react';
import { Map2 } from '../Map2';
import '@testing-library/jest-dom';

jest.mock('react-leaflet', () => ({
    MapContainer: jest.fn(({ children }) => <div>{children}</div>),
    TileLayer: jest.fn(),
    Marker: jest.fn(({ children }) => <div>{children}</div>),
    Popup: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('Map2 Component', () => {
    it('renders markers and popups correctly', () => {
        render(<Map2 />);

        // Check if markers for each entry in the sample data are rendered
        expect(screen.getByText(/Town Hall Demolition/i)).toBeInTheDocument();
        expect(screen.getByText(/New Building Construction/i)).toBeInTheDocument();
        expect(screen.getByText(/Placeholder Example/i)).toBeInTheDocument();

        // Use getAllByText for elements that may have multiple matches
        const stakeholders = screen.getAllByText(/Stakeholders:/i);
        expect(stakeholders.length).toBeGreaterThan(0); // Check at least one instance exists

        // Verify specific details from the first stakeholder (or iterate over as needed)
        expect(screen.getByText(/LKAB/i)).toBeInTheDocument();
        expect(screen.getByText(/Blueprints\/Effects/i)).toBeInTheDocument();
        expect(screen.getByText(/04\/2019/i)).toBeInTheDocument();
    });

    it('handles markers with null coordinates by using a random position', () => {
        render(<Map2 />);

        // Check for the placeholder example with null coordinates
        const placeholderPopup = screen.getByText(/Placeholder Example/i);
        expect(placeholderPopup).toBeInTheDocument();
    });
    
        
});