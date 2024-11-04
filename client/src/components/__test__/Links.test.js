import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Links from '../Links';
import '@testing-library/jest-dom/';
import API from '../../../API';


jest.mock('../../../API');

describe('Links Component', () => {
  const mockSetNewDoc = jest.fn();
  const newDoc = { id: 'doc1', title: 'Document 1' };
  
  beforeEach(async () => {
    API.getDocuments.mockResolvedValue([{ title: 'Document 1' }, { title: 'Document 2' }]);
    API.getTypeLinks.mockResolvedValue(['Type A', 'Type B']);
  
    await act(async () => {
      render(
        <MemoryRouter>
          <Links newDoc={newDoc} setNewDoc={mockSetNewDoc} />
        </MemoryRouter>
      );
    });
  });

  test('renders the Links component with form fields', async () => {
    expect(await screen.findByText(/ADD NEW LINK/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Document 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Document 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Link Type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Link/i })).toBeInTheDocument();
  });
  

  test('displays error messages when fields are empty and save button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Save Link/i }));
    
    expect(await screen.findByText(/You must select a document/i)).toBeInTheDocument();
    expect(screen.getAllByText(/You must select a document/i).length).toBe(1);
    expect(screen.getByText(/You must select a type of link/i)).toBeInTheDocument();
  });
});
