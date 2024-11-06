import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Login';
import '@testing-library/jest-dom/';

describe('Login Component', () => {
  const mockHandleLogin = jest.fn();
  const mockSetUsername = jest.fn();
  const mockSetPassword = jest.fn();
  const mockSetError = jest.fn();

  const username = 'testuser';
  const password = 'password123';

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login
          handleLogin={mockHandleLogin}
          username={username}
          password={password}
          setUsername={mockSetUsername}
          setPassword={mockSetPassword}
          setError={mockSetError}
          error={null}
        />
      </MemoryRouter>
    );
  });

  test('calls handleLogin with correct credentials when form is submitted', async () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: username } });
      fireEvent.change(passwordInput, { target: { value: password } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Login/i }));
    });

    expect(mockHandleLogin).toHaveBeenCalledWith({ username, password });
  });
});
