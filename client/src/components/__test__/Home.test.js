import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../Home';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Home Component', () => {

  it('renders with initial state and buttons', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Check initial title and buttons
    expect(screen.getByText("Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic")).toBeInTheDocument();
    expect(screen.getByText("Relocation of Kiruna")).toBeInTheDocument();
    expect(screen.getByText("Why we need this relocation?")).toBeInTheDocument();
  });

  it('changes background and title when "Why we need this relocation?" is clicked', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText('Why we need this relocation?'));

    // Check for background image change (use querySelector for class-based selection)
    const homeBackground = document.querySelector('.home-background');
    expect(homeBackground).toHaveStyle('background-image: url("../public/kirunadocs.png")');

    // Check title text update
    expect(screen.getByText('Why we do this?')).toBeInTheDocument();
  });

  it('shows "Back to Home" button after showing info', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText('Why we need this relocation?'));

    // Check if "Back to Home" is shown
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('returns to initial state when "Back to Home" is clicked', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText('Why we need this relocation?'));
    fireEvent.click(screen.getByText('Back to Home'));

    // Check for return to initial state (background and title)
    const homeBackground = document.querySelector('.home-background');
    expect(homeBackground).toHaveStyle('background-image: url("../public/kiruna.jpg")');
    expect(screen.getByText("Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic")).toBeInTheDocument();
  });

  it('navigates to /map when "Relocation of Kiruna" is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText('Relocation of Kiruna'));

    // Check if navigate is called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

});
