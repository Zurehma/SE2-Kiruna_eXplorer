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
    jest.clearAllMocks();
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
  
});
