import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders', async () => {
        const { container } = render(<App />);
        //expect(screen.getByText('count is 0')).toBeInTheDocument(); 
    });
});
