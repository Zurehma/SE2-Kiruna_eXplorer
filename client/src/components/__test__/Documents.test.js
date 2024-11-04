import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Documents from '../Documents';
import '@testing-library/jest-dom/';
import API from '../../../API';

jest.mock('../../../API');

describe('Documents Component', () => {
  const mockSetNewDoc = jest.fn();

  beforeEach(async () => {
    API.getTypeDocuments.mockResolvedValue(['Type A', 'Type B']);
    API.getTypeScale.mockResolvedValue(['1:100', '1:n']);
    API.saveDocument.mockResolvedValue({ id: 'newDocId' });

    await act(async () => {
      render(
        <MemoryRouter>
          <Documents setNewDoc={mockSetNewDoc} />
        </MemoryRouter>
      );
    });
  });

  test('renders the Documents component with form fields', async () => {
    expect(await screen.findByText(/ADD NEW DOCUMENT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stakeholder/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Scale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Issuance Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pages/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitude/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Document/i })).toBeInTheDocument();
  });

  test('displays error messages when required fields are empty and save button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Save Document/i }));

    expect(await screen.findByText(/Title is required and cannot be empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Stakeholder is required and cannot be empty/i)).toBeInTheDocument();
    expect(screen.getByText(/You must select a scale/i)).toBeInTheDocument();
    expect(screen.getByText(/You must select a type/i)).toBeInTheDocument();
    expect(screen.getByText(/Issuance Date must be in a valid format/i)).toBeInTheDocument();
    expect(screen.getByText(/Language is required and cannot be empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required and cannot be empty/i)).toBeInTheDocument();
  });

  test('submits the form when all required fields are filled in correctly', async () => {
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Document' } });
    fireEvent.change(screen.getByLabelText(/Stakeholder/i), { target: { value: 'Test Stakeholder' } });
    fireEvent.change(screen.getByLabelText(/Scale/i), { target: { value: '1:100' } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'Type A' } });
    fireEvent.change(screen.getByLabelText(/Issuance Date/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'English' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test description.' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Document/i }));

    await waitFor(() => expect(API.saveDocument).toHaveBeenCalledTimes(1));
    expect(mockSetNewDoc).toHaveBeenCalledWith(expect.objectContaining({ id: 'newDocId' }));
  });
});
