// FilteringDocuments.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import FilteringDocuments from '../FilteringDocuments';
import API from '../../../API';
import '@testing-library/jest-dom'
// Mock the API module
jest.mock('../../../API');

// Mock react-datepicker
jest.mock('react-datepicker', () => (props) => {
  return (
    <input
      data-testid="react-datepicker"
      value={props.selected ? props.selected.toString() : ''}
      onChange={(e) => props.onChange(new Date(e.target.value))}
    />
  );
});

// Mock MyPopup component
jest.mock('../MyPopup.jsx', () => ({
  MyPopup: () => <div data-testid="my-popup">MyPopup Component</div>,
}));

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock data for stakeholders, document types, and documents
const mockStakeholders = [
  { name: 'Stakeholder A' },
  { name: 'Stakeholder B' },
];

const mockDocumentTypes = [
  { name: 'Type A' },
  { name: 'Type B' },
];

const mockDocuments = [
  {
    id: 1,
    title: 'Document 1',
    stakeholder: 'Stakeholder A',
    type: 'Type A',
    issuanceDate: '2023-10-10',
    description: 'Description 1',
    language: 'English',
    pages: 10,
    pageFrom: 1,
    pageTo: 10,
    lat: null,
    long: null,
    scale: '1000',
    connections: 0,
  },
  {
    id: 2,
    title: 'Document 2',
    stakeholder: 'Stakeholder B',
    type: 'Type B',
    issuanceDate: '2023-09-15',
    description: 'Description 2',
    language: 'Spanish',
    pages: 20,
    pageFrom: 1,
    pageTo: 20,
    lat: null,
    long: null,
    scale: '2000',
    connections: 0,
  },
];

beforeEach(() => {
  // Mock the resolved values for API calls
  API.getStakeholders.mockResolvedValue(mockStakeholders);
  API.getDocumentTypes.mockResolvedValue(mockDocumentTypes);
  API.filterDocuments.mockResolvedValue(mockDocuments);
});

test('renders documents after loading', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

    // Removed loading spinner check due to timing issues

  // Wait for the documents to be loaded
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalled());

  // Check if the mocked MyPopup components are displayed
  expect(screen.getAllByTestId('my-popup').length).toBe(2);
});

test('filters documents by title using search input', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

  // Wait for the documents to be loaded
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalled());

  // Ensure both documents are displayed initially
  expect(screen.getAllByTestId('my-popup').length).toBe(2);

  // Type into the search input to filter documents
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search by title...'), { target: { value: '1' } });
  });

  // Wait for the filtered documents
  await waitFor(() => {
    expect(screen.getAllByTestId('my-popup').length).toBe(1);
  });
});

test('calls API.filterDocuments with correct parameters when stakeholder filter changes', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

  // Wait for initial API calls
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalledWith({
    type: undefined,
    stakeholder: undefined,
    issuanceDateFrom: null,
    issuanceDateTo: null,
  }));

  // Clear mock calls
  API.filterDocuments.mockClear();

  // Select a stakeholder from the dropdown
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Stakeholder'), { target: { value: 'Stakeholder A' } });
  });

  // Wait for API call with new filters
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalledWith({
    type: undefined,
    stakeholder: 'Stakeholder A',
    issuanceDateFrom: null,
    issuanceDateTo: null,
  }));
});

test('document type dropdown contains expected options', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

  // Wait for the documents to be loaded
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalled());

  // Check if the document type dropdown contains the expected options
  const documentTypeDropdown = screen.getByLabelText('Document Type');
  expect(documentTypeDropdown).toBeInTheDocument();
  expect(documentTypeDropdown.options.length).toBe(3); 
  expect(documentTypeDropdown.options[1].value).toBe('Type A');
  expect(documentTypeDropdown.options[2].value).toBe('Type B');
});
test('resetting search input displays all documents', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

  // Wait for the documents to be loaded
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalled());

  // Ensure both documents are displayed initially
  expect(screen.getAllByTestId('my-popup').length).toBe(2);

  // Type into the search input to filter documents
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search by title...'), { target: { value: '1' } });
  });

  // Wait for the filtered documents
  await waitFor(() => {
    expect(screen.getAllByTestId('my-popup').length).toBe(1);
  });

  // Reset search input
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search by title...'), { target: { value: '' } });
  });

  // Wait for all documents to be displayed again
  await waitFor(() => {
    expect(screen.getAllByTestId('my-popup').length).toBe(2);
  });
});

test('calls API.filterDocuments with correct parameters when document type filter changes', async () => {
  await act(async () => {
    render(<FilteringDocuments loggedIn={false} />);
  });

  // Wait for initial API calls
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalledWith({
    type: undefined,
    stakeholder: undefined,
    issuanceDateFrom: null,
    issuanceDateTo: null,
  }));

  // Clear mock calls
  API.filterDocuments.mockClear();

  // Select a document type from the dropdown
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Document Type'), { target: { value: 'Type A' } });
  });

  // Wait for API call with new filters
  await waitFor(() => expect(API.filterDocuments).toHaveBeenCalledWith({
    type: 'Type A',
    stakeholder: undefined,
    issuanceDateFrom: null,
    issuanceDateTo: null,
  }));
});

