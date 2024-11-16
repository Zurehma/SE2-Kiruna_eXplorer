import React from 'react';
import { render, screen,fireEvent,waitFor,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyPopup } from '../MyPopup';
import API from '../../../API';

// Mocking API functions
jest.mock('../../../API', () => ({
    getLinksDoc: jest.fn(),
    getAttachments: jest.fn(),
    downloadAttachment: jest.fn(),
}));

// Mocking react-bootstrap components
jest.mock('react-bootstrap', () => ({
    ...jest.requireActual('react-bootstrap'),
    OverlayTrigger: ({ children }) => <>{children}</>,
    Tooltip: ({ children }) => <>{children}</>,
}));

// Mocking useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Mantieni tutti gli altri hook da react-router-dom
    useNavigate: jest.fn(),
}));

describe('MyPopup Component', () => {
    const mockDoc = {
        id: 1,
        title: 'Test Document',
        stakeholder: 'Stakeholder A, Stakeholder B',
        scale: 'Global',
        issuanceDate: '2024-10-01',
        type: 'Design',
        connections: 2,
        language: 'English',
        pages: 10,
        pageFrom: 1,
        pageTo: 5,
        lat: 67.850,
        long: 20.217,
        description: 'This is a test description for the document.',
    };


    const mockSetError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders document details correctly', async () => {
        const mockLinks = [
            { linkedDocID: 1, title: 'Link 1', type: 'Design' },
            { linkedDocID: 2, title: 'Link 2', type: 'Technical' },
        ];
    
        // Mock della funzione API.getLinksDoc per restituire i collegamenti
        API.getLinksDoc = jest.fn().mockResolvedValue(mockLinks);
        const mockAttachments = [
            { id: 1, name: 'Attachment1.pdf' },
            { id: 2, name: 'Attachment2.docx' },
        ];
        API.getAttachments = jest.fn().mockResolvedValue(mockAttachments);
        await act(async () => {
            render(<MyPopup doc={mockDoc} setError={mockSetError} />);
        });
    
        // Aspetta che gli aggiornamenti di stato siano stati completati
        await waitFor(() => expect(screen.getByText(/Stakeholders:/i)).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText(/Scale:/i)).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText(/Issuance Date:/i)).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText(/Connections:/i)).toBeInTheDocument());
    });
    
    test('does not render edit button when loggedIn is false', async () => {
        const mockLinks = [
            { linkedDocID: 1, title: 'Link 1', type: 'Design' },
            { linkedDocID: 2, title: 'Link 2', type: 'Technical' },
        ];
    
        // Mock della funzione API.getLinksDoc per restituire i collegamenti
        API.getLinksDoc = jest.fn().mockResolvedValue(mockLinks);
        const mockAttachments = [
            { id: 1, name: 'Attachment1.pdf' },
            { id: 2, name: 'Attachment2.docx' },
        ];
        API.getAttachments = jest.fn().mockResolvedValue(mockAttachments);
        await act(async () => {
            render(<MyPopup doc={mockDoc} setError={mockSetError} loggedIn={false} />);
        });
        const editButton = screen.queryByRole('button', { name: /edit/i });
        expect(editButton).not.toBeInTheDocument();
    });
    /*
    test('renders the edit button when loggedIn is true', () => {
        act(() => {
            render(<MyPopup doc={mockDoc} setError={mockSetError} loggedIn={true} />);
        });
        

        const editButton = screen.getByRole('button', { name: /edit/i });
        expect(editButton).toBeInTheDocument();
    });*/
    /*
    test('renders attachments correctly and triggers download', async () => {
        const mockAttachments = [
            { id: 1, name: 'Attachment1.pdf' },
            { id: 2, name: 'Attachment2.docx' },
        ];
    
        // Mock delle funzioni API
        API.getAttachments = jest.fn().mockResolvedValue(mockAttachments);
        const mockDownloadAttachment = jest.fn(() => Promise.resolve(new Blob()));
        API.downloadAttachment = mockDownloadAttachment;
    
        render(
            <MyPopup 
                doc={mockDoc} 
                setError={mockSetError} 
                loggedIn={true} 
            />
        );
    
        // Aspetta che gli allegati vengano caricati (se necessario)
        await screen.findByText('Attachment1.pdf'); // Aspetta che il primo allegato appaia
    
        // Controlla che i link degli allegati siano presenti
        const attachmentLinks = screen.getAllByRole('link');
        expect(attachmentLinks).toHaveLength(mockAttachments.length); // Controlla che ci siano due link
    
        attachmentLinks.forEach((link, index) => {
            expect(link).toHaveTextContent(mockAttachments[index].name); // Verifica che i link contengano il nome degli allegati
            fireEvent.click(link); // Simula il click per il download
        });
    
        // Verifica che la funzione di download sia stata chiamata per ogni allegato
        expect(mockDownloadAttachment).toHaveBeenCalledTimes(mockAttachments.length);
    });*/
    /*
    test('renders connections dropdown and toggles visibility with API', async () => {
    
        // Mock della risposta dell'API getLinksDoc
        const mockLinks = [
            { linkedDocID: 1, title: 'Link 1', type: 'Design' },
            { linkedDocID: 2, title: 'Link 2', type: 'Technical' },
        ];
    
        // Mock della funzione API.getLinksDoc per restituire i collegamenti
        API.getLinksDoc = jest.fn().mockResolvedValue(mockLinks);
    
        // Rende il componente con il documento che ha collegamenti
        render(
            <MyPopup 
                doc={mockDoc} 
                setError={mockSetError} 
                loggedIn={true} 
            />
        );
        console.log(screen.debug());
        const toggleButton = screen.getByTestId('connections-toggle-button');
        expect(toggleButton).toBeInTheDocument();
        fireEvent.click(toggleButton);
        // Verifica che i collegamenti siano stati caricati
        await waitFor(() => {
            // Qui aspettiamo che i collegamenti siano presenti nel DOM
            expect(screen.getByText('Link 1')).toBeInTheDocument();
            expect(screen.getByText('Link 2')).toBeInTheDocument();
        });
    
        // Controlla che il pulsante per aprire la dropdown esista
        
    
        // Verifica che la lista dei collegamenti non sia visibile inizialmente
        let linkList = screen.queryByText('Link 1');
        expect(linkList).not.toBeInTheDocument();
    
        // Clicca sul pulsante per aprire la dropdown
        fireEvent.click(toggleButton);
    
        // Verifica che i collegamenti siano visibili dopo il click
        linkList = screen.getByText('Link 1');
        expect(linkList).toBeInTheDocument();
    
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });*/
    
    
    
      
});
