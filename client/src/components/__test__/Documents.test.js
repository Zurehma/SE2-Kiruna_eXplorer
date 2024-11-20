import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Documents from '../Documents';
import '@testing-library/jest-dom/';
import API from '../../../API';
import { useNavigate } from 'react-router-dom';

// Mock API
jest.mock('../../../API', () => ({
  getTypeDocuments: jest.fn(),
  getTypeScale: jest.fn(),
  saveDocument: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Documents Component', () => {
  const mockNavigate = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders the Documents component', () => {
    render(<Documents />);
    expect(screen.getByText(/Add New Document/i)).toBeInTheDocument();
  });
 
  test('allows title input and validation', async () => {
    render(<Documents />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    expect(titleInput.value).toBe('Test Title');
  });

  test('validates Step 1 on Next', async () => {
    render(<Documents />);
    const nextButton = screen.getByRole('button', { name: /Next/i });

    // Test validation failure
    fireEvent.click(nextButton);
    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();

    // Fill required fields and test success
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(nextButton);

    // Ensure no validation error messages
    await waitFor(() => {
      expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
    });
  });
  test('sets all fields and validates them correctly', async () => {
    render(<Documents />);

    // Test: Impostiamo il campo "Title"
    const titleInput = screen.getByLabelText(/Title\*/i);
    fireEvent.change(titleInput, { target: { value: 'Test Document Title' } });
    expect(titleInput.value).toBe('Test Document Title'); // Verifica che il valore sia stato impostato

    const issuanceDateInput = screen.getByPlaceholderText(/Select a date/i);

    // Simula la modifica del campo
    fireEvent.change(issuanceDateInput, { target: { value: '2024-11-19' } });

    // Verifica che la data sia stata impostata correttamente
    expect(issuanceDateInput.value).toBe('2024-11-18');
    // Seleziona il campo Stakeholders tramite la sua etichetta
    const stakeholderSelect = screen.getByLabelText(/Stakeholders\*/i);

    // Simula la selezione di un'opzione
    fireEvent.change(stakeholderSelect, { target: { value: 'Some stakeholder' } });

    // Test: Impostiamo il campo "Description"
    const descriptionInput = screen.getByLabelText(/Description\*/i);
    fireEvent.change(descriptionInput, { target: { value: 'This is a test description for the document.' } });
    expect(descriptionInput.value).toBe('This is a test description for the document.'); // Verifica che la descrizione sia stata impostata
    const nextButton = screen.getByRole('button', { name: /Next/i });

    // Test validation failure
    fireEvent.click(nextButton);

    // Verifica che non ci siano errori di validazione
    await waitFor(() => {
      expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Description is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Issuance Date is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Stakeholders is required/i)).not.toBeInTheDocument();
    });
  });
  
  
  
});
