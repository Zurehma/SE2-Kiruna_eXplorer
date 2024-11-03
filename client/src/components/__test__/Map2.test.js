import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Map2 } from '../Map2';
import '@testing-library/jest-dom';
import API from '../../../API';

jest.mock('react-leaflet', () => ({
    MapContainer: jest.fn(({ children }) => <div>{children}</div>),
    TileLayer: jest.fn(),
    Marker: jest.fn(({ children }) => <div>{children}</div>),
    Popup: jest.fn(({ children }) => <div>{children}</div>),
    useMap: jest.fn(() => ({
        setView: jest.fn(),
    })),
}));

jest.mock('../../../API', () => ({
    getDocuments: jest.fn()
}));

describe('Map2 Component', () => {
    const mockData = [
        {
            id: 1,
            type: "Action",
            title: "Town Hall Demolition",
            stakeholders: "LKAB",
            scale: "Blueprints/Effects",
            issuanceDate: "04/2019",
            connections: 3,
            description: "Demolition of old town hall...",
            lat: 67.850,
            long: 20.217,
        },
        {
            id: 2,
            type: "Design",
            title: "New Building Construction",
            stakeholders: "City of Kiruna",
            scale: "Large",
            issuanceDate: "06/2020",
            connections: 5,
            description: "Construction of new infrastructure...",
            lat: 67.853,
            long: 20.220,
        },
        {
            id: 3,
            type: "Conflict",
            title: "Placeholder Example",
            stakeholders: "Unknown",
            scale: "N/A",
            issuanceDate: "N/A",
            connections: 0,
            description: "This is a placeholder with null coordinates.",
            lat: null,
            long: null,
        }
    ];

    const mockSetError = jest.fn();
    beforeEach(() => {
        API.getDocuments.mockResolvedValue(mockData);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders markers and popups correctly with data from API', async () => {
        render(<Map2 setError={mockSetError} />);
        await waitFor(() => {
            expect(screen.getByText(/Town Hall Demolition/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/New Building Construction/i)).toBeInTheDocument();
    });

    it('handles markers with null coordinates by using a random position', async () => {
        render(<Map2 setError={mockSetError} />);

        // Wait for the placeholder example to render
        await waitFor(() => {
            expect(screen.getByText(/Placeholder Example/i)).toBeInTheDocument();
        });
    });

    it('displays loading message while fetching data', async () => {
        render(<Map2 setError={mockSetError} />);
        
        // Check that the loading message is displayed
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // Wait for the loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
    });

    it('calls setError on API fetch error', async () => {
        API.getDocuments.mockRejectedValueOnce(new Error('API error'));

        render(<Map2 setError={mockSetError} />);

        // Wait for setError to be called with an error
        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith(expect.any(Error));
        });
    });

});
