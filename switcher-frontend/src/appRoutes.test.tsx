/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './appRoutes';
import { render } from './services/testUtils';

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    render(<App />);
    //expect(screen.getByLabelText('Toggle Color Mode')).toBeInTheDocument();
  });

  // it('renders the icon light mode', () => {
  //   render(<App />);
  //   expect(screen.getByLabelText('Dark Mode')).toBeInTheDocument();
  // });

  // it('toggles color mode when the button is clicked', async () => {
  //   const user = userEvent.setup();
  //   render(<App />);

  //   expect(screen.getByLabelText('Dark Mode')).toBeInTheDocument();
  //   await user.click(screen.getByLabelText('Toggle Color Mode'));
  //   expect(screen.getByLabelText('Light Mode')).toBeInTheDocument();
  // });
});
