import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ProhibitedColor from './prohibitedColor';
import { Color } from '../../types/gameTypes';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { screen } from '@testing-library/react';

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ProhibitedColor component', () => {
  it('renders with yellow color', () => {
    renderWithChakra(<ProhibitedColor color={Color.Y} />);
    expect(screen.getByLabelText('Yellow')).toBeInTheDocument();
  });

  it('renders with red color', () => {
    renderWithChakra(<ProhibitedColor color={Color.R} />);
    expect(screen.getByLabelText('Red')).toBeInTheDocument();
  });

  it('renders with blue color', () => {
    renderWithChakra(<ProhibitedColor color={Color.B} />);
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
  });

  it('renders with green color', () => {
    renderWithChakra(<ProhibitedColor color={Color.G} />);
    expect(screen.getByLabelText('Green')).toBeInTheDocument();
  });

  it('renders with gray color when color is undefined', () => {
    renderWithChakra(<ProhibitedColor color={undefined} />);
    expect(screen.getByLabelText('Gray')).toBeInTheDocument();
  });
});
