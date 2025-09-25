import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /atelier's fitness/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<Home />);

    const description = screen.getByText(/transform your fitness journey/i);

    expect(description).toBeInTheDocument();
  });

  it('renders the get started button', () => {
    render(<Home />);

    const getStartedButton = screen.getByRole('button', {
      name: /get started/i,
    });

    expect(getStartedButton).toBeInTheDocument();
  });
});
