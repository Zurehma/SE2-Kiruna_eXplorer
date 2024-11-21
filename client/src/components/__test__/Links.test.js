import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Links from '../Links'; // Percorso corretto
import '@testing-library/jest-dom/';
import API from '../../../API';

// Mocking API functions
jest.mock('../../../API', () => ({
  getDocuments: jest.fn(),
  getTypeLinks: jest.fn(),
  getLinksDoc: jest.fn(),
  setLink: jest.fn(),
}));

// Mocking react-bootstrap components
jest.mock('react-bootstrap', () => ({
  ...jest.requireActual('react-bootstrap'),
}));

// Mocking react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Links Component', () => {
  const mockNavigate = jest.fn();
  const mockSetNewDoc = jest.fn();

  beforeEach(() => {
      jest.clearAllMocks();
      require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });



  test('validates form inputs before submission', async () => {
      API.getDocuments.mockResolvedValue([
          { id: 1, title: 'Document 1' },
          { id: 2, title: 'Document 2' },
      ]);
      API.getTypeLinks.mockResolvedValue([
          { name: 'Type A' },
          { name: 'Type B' },
      ]);

      render(<Links newDoc={null} setNewDoc={mockSetNewDoc} />);

      // Trigger form submission without filling inputs
      fireEvent.click(screen.getByRole('button', { name: /Save Link/i }));

      // Check for validation errors
      expect(await screen.findByText(/You must select a document./i)).toBeInTheDocument();
      expect(await screen.findByText(/You must select at least one document./i)).toBeInTheDocument();
      expect(await screen.findByText(/You must select a type of link./i)).toBeInTheDocument();
  });




});

