import React from 'react'; // Importazione di React
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyPopup } from '../MyPopup';

describe('MyPopup Component', () => {
    const mockDoc = {
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

    test('renders document details correctly', () => {
        render(<MyPopup doc={mockDoc} />);

        // Helper function to check presence of label and its value
        const checkTextPresence = (label, value) => {
            expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
            expect(screen.getByText((content) => content.includes(value.toString()))).toBeInTheDocument();
        };

        checkTextPresence('Stakeholders:', mockDoc.stakeholder);
        checkTextPresence('Scale:', mockDoc.scale);
        checkTextPresence('Issuance Date:', mockDoc.issuanceDate);
        checkTextPresence('Type:', mockDoc.type);
        checkTextPresence('Connections:', mockDoc.connections);
        checkTextPresence('Language:', mockDoc.language);
        checkTextPresence('Pages:', mockDoc.pages);
        checkTextPresence('From page:', mockDoc.pageFrom);
        checkTextPresence('To page:', mockDoc.pageTo);
        checkTextPresence('Position:', `${mockDoc.lat} - ${mockDoc.long}`);
        checkTextPresence('Description:', mockDoc.description);
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
            render(<MyPopup doc={{ ...mockDoc, type }} />);
            const iconElement = screen.getByTestId(`my-icon-${type}`);
            expect(iconElement).toHaveClass(icon);
        });
    });

    test('renders null for an unknown document type', () => {
        const unknownDoc = { ...mockDoc, type: 'Unknown Type' };
        render(<MyPopup doc={unknownDoc} />);
        
        // Check that no icon is rendered for an unknown type
        expect(screen.queryByTestId(/my-icon-unknown/i)).toBeNull();
    });
});
