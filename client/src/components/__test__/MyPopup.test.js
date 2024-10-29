import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyPopup } from '../MyPopup'; // Adjust the import path as needed

describe('MyPopup Component', () => {
    const mockDoc = {
        title: 'Test Document',
        stakeholders: 'Stakeholder A, Stakeholder B',
        scale: 'Global',
        issuanceDate: '2024-10-01',
        type: 'Design',
        connections: 'Connection 1, Connection 2',
        description: 'This is a test description for the document.',
    };

    test('renders document details correctly', () => {
        render(<MyPopup doc={mockDoc} />);

        // Check if title is rendered
        expect(screen.getByText(mockDoc.title)).toBeInTheDocument();
        
        // Check if stakeholders are rendered
        expect(screen.getByText(/Stakeholders:/i)).toBeInTheDocument(); 
        expect(screen.getByText(mockDoc.stakeholders)).toBeInTheDocument();

        // Check if scale is rendered
        expect(screen.getByText(/Scale:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.scale)).toBeInTheDocument();

        // Check if issuance date is rendered
        expect(screen.getByText(/Issuance Date:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.issuanceDate)).toBeInTheDocument();

        // Check if type is rendered
        expect(screen.getByText(/Type:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.type)).toBeInTheDocument();

        // Check if connections are rendered
        expect(screen.getByText(/Connections:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.connections)).toBeInTheDocument();

        // Check if description is rendered
        expect(screen.getByText(/Description:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.description)).toBeInTheDocument();
    });

    test('renders the correct icon for each document type', () => {
        const types = [
            { type: 'Design', icon: 'bi-file-earmark-text' },
            { type: 'Informative', icon: 'bi-info-circle' },
            { type: 'Prescriptive', icon: 'bi-arrow-right-square' },
            { type: 'Technical', icon: 'bi-file-earmark-code' },
            { type: 'Agreement', icon: 'bi-people-fill' },
            { type: 'Conflict', icon: 'bi-x-circle' },
            { type: 'Consultation', icon: 'bi-chat-dots' },
            { type: 'Action', icon: 'bi-exclamation-triangle' },
        ];
    
        types.forEach(({ type, icon }) => {
            render(<MyPopup doc={{ title: 'Test Document', stakeholders: 'Stakeholder A, Stakeholder B', scale: 'Global', issuanceDate: '2024-10-01', connections: 'Connection 1, Connection 2', type }} />);
            
            // Check that the correct icon is rendered with the expected class
            const iconElement = screen.getByTestId(`my-icon-${type}`);
            expect(iconElement).toHaveClass(icon);
        });
    });
    

    test('renders null for an unknown document type', () => {
        const unknownDoc = { ...mockDoc, type: 'Unknown Type' };
        render(<MyPopup doc={unknownDoc} />);
        
        // Check that no icon is rendered for an unknown type
        expect(screen.queryByRole('img')).toBeNull(); 
    });
    test('renders document details correctly', () => {
        const mockDoc = {
            title: 'Test Document',
            stakeholders: 'Stakeholder A, Stakeholder B',
            scale: 'Global',
            issuanceDate: '2024-10-01',
            type: 'Design',
            connections: 'Connection 1, Connection 2',
            description: 'This is a test description for the document.'
        };
    
        render(<MyPopup doc={mockDoc} />);
    
        // Check that the title is rendered correctly
        expect(screen.getByText(mockDoc.title)).toBeInTheDocument();
    
        // Check that stakeholders are rendered correctly
        expect(screen.getByText(/Stakeholders:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.stakeholders)).toBeInTheDocument();
    
        // Check that scale is rendered correctly
        expect(screen.getByText(/Scale:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.scale)).toBeInTheDocument();
    
        // Check that issuance date is rendered correctly
        expect(screen.getByText(/Issuance Date:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.issuanceDate)).toBeInTheDocument();
    
        // Check that type is rendered correctly
        expect(screen.getByText(/Type:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.type)).toBeInTheDocument();
    
        // Check that connections are rendered correctly
        expect(screen.getByText(/Connections:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.connections)).toBeInTheDocument();
    
        // Check that description is rendered correctly
        expect(screen.getByText(/Description:/i)).toBeInTheDocument();
        expect(screen.getByText(mockDoc.description)).toBeInTheDocument();
    });
    
});
