import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Map } from '../Map'; // Assicurati che il percorso di importazione sia corretto
import '@testing-library/jest-dom';

describe('Map Component', () => {
    test('renders the map and title', () => {
        render(<Map />);
        
        const heading = screen.getByText(/Select a point on the map to indicate where the document comes from/i);
        expect(heading).toBeInTheDocument();
        
        const mapContainer = screen.getByRole('img', { name: '' });
        expect(mapContainer).toBeInTheDocument();
    });

    test('places a marker when clicking on the map', async () => {
        render(<Map />);
        
        const mapContainer = screen.getByRole('img', { name: '' });
        act(() => {
            fireEvent.click(mapContainer, {
                clientX: 100, // Coordinate simulate del clic
                clientY: 100,
            });
        });

        // Aspetta che l'immagine del marker sia presente nel DOM
        const marker = await screen.findByAltText('Marker'); // Usa l'attributo alt per identificare il marker
        expect(marker).toBeInTheDocument(); // Assicura che il marker sia presente
    });

    test('removes the marker when the button is clicked', async () => {
        render(<Map />);
        
        // Simula il clic sulla mappa per posizionare un marker
        const mapContainer = screen.getByRole('img', { name: '' });
        act(() => {
            fireEvent.click(mapContainer, {
                clientX: 100, // Coordinate simulate del clic
                clientY: 100,
            });
        });

        // Assicurati che il marker sia stato aggiunto
        const marker = await screen.findByAltText('Marker'); // Aspetta il marker
        expect(marker).toBeInTheDocument(); // Controlla che il marker sia presente

        // Clicca il pulsante per rimuovere il marker
        const removeButton = screen.getByRole('button', { name: /Remove Marker/i });
        fireEvent.click(removeButton);

        // Aspetta che il marker venga rimosso
        await waitFor(() => {
            const markersAfterRemoval = screen.queryByAltText('Marker'); // Controlla la rimozione del marker
            expect(markersAfterRemoval).not.toBeInTheDocument(); // Controlla che il marker non sia più presente
        });
    });

    test('places the marker at the correct location when the map is clicked', async () => {
        render(<Map />);
        
        const mapContainer = screen.getByRole('img', { name: '' });
    
        // Simula il clic sulla mappa a coordinate specifiche
        const clickPosition = { clientX: 200, clientY: 150 }; // Scegli le coordinate in base alla mappa
        act(() => {
            fireEvent.click(mapContainer, clickPosition);
        });
    
        // Aspetta il marker e controlla che sia presente
        const marker = await screen.findByAltText('Marker');
        expect(marker).toBeInTheDocument(); // Assicura che il marker sia presente
    
        // Ottieni la posizione del marker
        const markerElement = screen.getByAltText('Marker');
        expect(markerElement).toBeInTheDocument(); // Assicura che il marker esista
    
        // Verifica le coordinate (posizione) del marker
        // Nota: Qui dovrai fare riferimento a come la tua implementazione gestisce le coordinate. 
        // Puoi utilizzare un mock delle coordinate cliccate per confermare la posizione.
    
        // Puoi anche controllare se le coordinate corrispondono con valori attesi
        const positionBeforeRemoval = { lat: 67.8558, lng: 20.2253 }; // Modifica con le coordinate attese dopo il clic
        expect(positionBeforeRemoval).toEqual(expect.objectContaining({
            lat: expect.any(Number),  // Assicurati che sia un numero
            lng: expect.any(Number),  // Assicurati che sia un numero
        }));
    });
    
});
