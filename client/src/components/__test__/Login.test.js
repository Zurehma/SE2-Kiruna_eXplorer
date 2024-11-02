import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from '../Login';
import { BrowserRouter } from 'react-router-dom';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
  const setLoggedIn = jest.fn();
  const setCurrentUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form elements', () => {
    render(
      <BrowserRouter>
        <Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    render(
      <BrowserRouter>
        <Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setLoggedIn).toHaveBeenCalledWith(true);
      expect(setCurrentUser).toHaveBeenCalledWith('admin');
      expect(mockedNavigate).toHaveBeenCalledWith('/e');
    });
  });

  test('login failure shows error message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid username or password' }),
      })
    );

    render(
      <BrowserRouter>
        <Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      expect(setLoggedIn).not.toHaveBeenCalled();
      expect(setCurrentUser).not.toHaveBeenCalled();
    });
  });

  test('displays an error when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(
      <BrowserRouter>
        <Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred during login/i)).toBeInTheDocument();
      expect(setLoggedIn).not.toHaveBeenCalled();
      expect(setCurrentUser).not.toHaveBeenCalled();
    });
  });
});
