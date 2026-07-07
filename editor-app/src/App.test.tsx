import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText('Jekyll Markdown Editor')).toBeInTheDocument();
  });

  it('renders the sidebar', () => {
    render(<App />);
    expect(screen.getByText('Files')).toBeInTheDocument();
  });

  it('renders the editor and preview by default', () => {
    render(<App />);
    // Check for preview content heading in the preview section
    const allHeadings = screen.getAllByText(/Welcome to Jekyll Markdown Editor/i);
    expect(allHeadings.length).toBeGreaterThan(0);
  });

  it('has a toggle preview button', () => {
    render(<App />);
    const toggleButton = screen.getByText(/Hide Preview/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('has a save button', () => {
    render(<App />);
    const saveButton = screen.getByText(/Save/i);
    expect(saveButton).toBeInTheDocument();
  });
});
