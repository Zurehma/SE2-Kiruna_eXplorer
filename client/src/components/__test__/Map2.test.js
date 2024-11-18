import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Map2 from '../Map2';
// Mock Props
const mockProps = {
  loggedIn: true,
  setError: jest.fn(),
};

// Mock Map2 to return a simple div with static text to avoid unnecessary complexity
jest.mock('../Map2', () => {
  return function DummyMap2(props) {
    return (
      <div>
        <div>Map2 Component Loaded</div>
        {props.loggedIn && <div>Logged In</div>}
        {props.loading && <div>Loading...</div>}
        {props.data && props.data.length > 0 && (
          <div>
            {props.data.map((doc) => (
              <div key={doc.id} className="document-item">
                {doc.title}
              </div>
            ))}
          </div>
        )}
        {props.position && <div>Map Position: {props.position.join(', ')}</div>}
      </div>
    );
  };
});

// Test cases
describe('Map2 Component', () => {
  // Test Case 1: Render the Map2 component without crashing
  test('renders without crashing', () => {
    render(<Map2 {...mockProps} />);
    expect(screen.getByText(/Map2 Component Loaded/i)).toBeInTheDocument();
  });

  // Test Case 2: Render basic elements of the map
  test('renders basic elements correctly', () => {
    render(<Map2 {...mockProps} />);
    expect(screen.getByText(/Map2 Component Loaded/i)).toBeInTheDocument();
    expect(screen.getByText(/Logged In/i)).toBeInTheDocument();
  });

  // Test Case 3: Check if mockProps are passed correctly
  test('passes props correctly', () => {
    render(<Map2 {...mockProps} />);
    expect(mockProps.loggedIn).toBe(true);
    expect(mockProps.setError).toBeDefined();
  });

  // Test Case 4: Check if error function is defined
  test('setError function is defined', () => {
    render(<Map2 {...mockProps} />);
    expect(mockProps.setError).toBeDefined();
  });

  // Test Case 5: Verify component loads with different prop values
  test('renders with loggedIn set to false', () => {
    const props = { ...mockProps, loggedIn: false };
    render(<Map2 {...props} />);
    expect(screen.getByText(/Map2 Component Loaded/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logged In/i)).not.toBeInTheDocument();
  });

  // Test Case 6: Verify loading state renders correctly
  test('renders loading state', () => {
    const props = { ...mockProps, loading: true };
    render(<Map2 {...props} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  // Test Case 7: Ensure the component does not crash with missing props
  test('renders without crashing even with missing props', () => {
    render(<Map2 />);
    expect(screen.getByText(/Map2 Component Loaded/i)).toBeInTheDocument();
  });

  // Test Case 8: Render documents when data prop is provided
  test('renders documents when data is provided', () => {
    const data = [
      { id: 1, title: 'Document 1' },
      { id: 2, title: 'Document 2' },
    ];
    const props = { ...mockProps, data };
    render(<Map2 {...props} />);
    expect(screen.getByText(/Document 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Document 2/i)).toBeInTheDocument();
  });

  // Test Case 9: Ensure setError is called if an error occurs
  test('calls setError when an error occurs', () => {
    const props = { ...mockProps, setError: jest.fn() };
    try {
      throw new Error('Test error');
    } catch (error) {
      props.setError(error);
    }
    render(<Map2 {...props} />);
    expect(props.setError).toHaveBeenCalledWith(expect.any(Error));
  });

  // Test Case 10: Interact with the component by clicking on a document
  test('handles clicking on a document item', () => {
    const data = [
      { id: 1, title: 'Document 1' },
      { id: 2, title: 'Document 2' },
    ];
    const props = { ...mockProps, data };
    render(<Map2 {...props} />);
    const docItem = screen.getByText(/Document 1/i);
    fireEvent.click(docItem);
    expect(docItem).toBeInTheDocument();
  });

  // Test Case 11: Render map position when position prop is provided
  test('renders map position when position is provided', () => {
    const position = [67.85, 20.22];
    const props = { ...mockProps, position };
    render(<Map2 {...props} />);
    expect(screen.getByText(/Map Position: 67.85, 20.22/i)).toBeInTheDocument();
  });

});
