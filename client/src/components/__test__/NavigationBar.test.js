import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationBar } from '../NavigationBar.jsx';
import { BrowserRouter } from 'react-router-dom'; // For Link rendering
import '@testing-library/jest-dom';

// Mock useNavigate and useLocation from react-router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('NavigationBar component', () => {
  const mockNavigate = jest.fn();
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue({ pathname: '/' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the brand name correctly', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Guest" />
      </BrowserRouter>
    );
    expect(screen.getByText('Kiruna')).toBeInTheDocument();
  });

  it('shows login button if role is not Urban Planner', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Guest" />
      </BrowserRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows welcome message and dropdown menu if role is Urban Planner', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Urban Planner" username="John Doe" handleLogout={mockHandleLogout} />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('navigates to /login when login button is clicked', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Guest" />
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /map when Map dropdown item is clicked', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Urban Planner" handleLogout={mockHandleLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Menu')); // Open dropdown
    fireEvent.click(screen.getByText('Map'));
    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

  it('calls handleLogout when Logout dropdown item is clicked', () => {
    render(
      <BrowserRouter>
        <NavigationBar role="Urban Planner" handleLogout={mockHandleLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Menu')); // Open dropdown
    fireEvent.click(screen.getByText('Logout'));
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
