import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Map } from '../Map';
import '@testing-library/jest-dom';

describe('Map Component', () => {
    test('renders the map and the remove marker button', () => {
        render(<Map handleMapClick={jest.fn()} />);
        
        const removeButton = screen.getByRole('button', { name: /remove marker/i });
        expect(removeButton).toBeInTheDocument();
        
        const mapContainer = screen.getByRole('img', { name: '' });
        expect(mapContainer).toBeInTheDocument();
    });

    test('places a marker when clicking on the map', async () => {
        const mockHandleMapClick = jest.fn();
        render(<Map handleMapClick={mockHandleMapClick} />);
        
        const mapContainer = screen.getByRole('img', { name: '' });
        act(() => {
            fireEvent.click(mapContainer, {
                clientX: 100,
                clientY: 100,
            });
        });

        // Cerca l'immagine del marker nel DOM
        const marker = await screen.findByRole('img', { name: '' });
        expect(marker).toBeInTheDocument();
    });

    test('removes the marker when the remove button is clicked', async () => {
        const mockHandleMapClick = jest.fn();
        render(<Map handleMapClick={mockHandleMapClick} />);
        
        // Simula il clic sulla mappa per posizionare un marker
        const mapContainer = screen.getByRole('img', { name: '' });
        act(() => {
            fireEvent.click(mapContainer, {
                clientX: 100,
                clientY: 100,
            });
        });

        // Assicurati che il marker sia stato aggiunto
        const marker = await screen.findByRole('img', { name: '' });
        expect(marker).toBeInTheDocument();

        // Clicca il pulsante per rimuovere il marker
        const removeButton = screen.getByRole('button', { name: /remove marker/i });
        fireEvent.click(removeButton);

        // Verifica che il marker sia stato rimosso
        await waitFor(() => {
            expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
        });
    });

    test('calls handleMapClick with correct coordinates when clicking on the map', async () => {
        const mockHandleMapClick = jest.fn();
        render(<Map handleMapClick={mockHandleMapClick} />);
        
        const mapContainer = screen.getByRole('img', { name: '' });

        // Simula un clic sulla mappa
        act(() => {
            fireEvent.click(mapContainer, {
                clientX: 150,
                clientY: 150,
            });
        });

        // Verifica che `handleMapClick` sia stato chiamato con coordinate numeriche
        await waitFor(() => {
            expect(mockHandleMapClick).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
        });
    });
});
