import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom/';
import Home from '../Home';

describe('Home Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  test('renders the home title', () => {
    const title = screen.getByText(/kiruna: the heart of sweden's iron legacy and gateway to the arctic/i);
    expect(title).toBeInTheDocument();
  });

  test('renders all images', () => {
    const images = screen.getAllByRole('img'); 
    expect(images).toHaveLength(3); 
  });

  test('opens the modal when an image is clicked', () => {
    const image = screen.getByAltText(/image 1/i);
    fireEvent.click(image); 

    const modalDescription = screen.getByText(/kiruna is sinking due to underground iron ore mining/i); 
    expect(modalDescription).toBeInTheDocument(); 
  });

  test('closes the modal when the close button is clicked', () => {
    const image = screen.getByAltText(/image 1/i);
    fireEvent.click(image); 

    const closeButton = screen.getByRole('button'); 
    fireEvent.click(closeButton); 

    const modalDescription = screen.queryByText(/Kiruna is sinking due to underground iron ore mining/i); // Example text in the modal
    expect(modalDescription).toBeInTheDocument();
  });

  test('navigates to /map when the relocation button is clicked', () => {
    const button = screen.getByText(/relocation of kiruna/i); 
    fireEvent.click(button);


    expect(window.location.pathname).toBe('/');
  });
});
