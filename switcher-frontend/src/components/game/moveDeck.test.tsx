import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MoveDeck from './moveDeck';
import { Movement } from '../../types/gameTypes';
import { useGame } from '../../hooks/useGame';
import { render } from '../../services/testUtils';

// Mock useGame hook
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(),
}));

describe('MoveDeck Component', () => {
  const mockHandleClickCard = vi.fn();
  const mockSelectedCard = { cardID: 1, type: 'mov1' };

  beforeEach(() => {
    vi.resetAllMocks();
    (useGame as Mock).mockReturnValue({
      handleClickCard: mockHandleClickCard,
      selectedCard: mockSelectedCard,
    });
  });

  afterEach(() => {
    cleanup();
  });

  const mockCards = [
    { cardID: 1, type: Movement.mov1, isUsed: false },
    { cardID: 2, type: Movement.mov2, isUsed: true },
    { cardID: 3, type: Movement.mov3, isUsed: false },
    { cardID: 4, type: Movement.mov4, isUsed: false },
    { cardID: 5, type: Movement.mov5, isUsed: false },
    { cardID: 6, type: Movement.mov6, isUsed: false },
    { cardID: 7, type: Movement.mov7, isUsed: false },
    null,
  ];

  it('renders without crashing', () => {
    render(<MoveDeck cards={mockCards} own={true} vertical={false} />);
    expect(screen.getAllByRole('button')).toHaveLength(mockCards.length);
  });

  it('renders without crashing when vertical', () => {
    render(<MoveDeck cards={mockCards} own={true} vertical={true} />);
    expect(screen.getAllByRole('button')).toHaveLength(mockCards.length);
  });

  it('calls handleClickCard when a card is clicked', async () => {
    const user = userEvent.setup();
    render(<MoveDeck cards={mockCards} own={true} vertical={false} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(mockHandleClickCard).toHaveBeenCalledWith(mockCards[0]);
  });

  it('applies correct styles for selected and used cards', () => {
    render(<MoveDeck cards={mockCards} own={true} vertical={false} />);
    const buttons = screen.getAllByRole('button');

    // Check styles for the first card (selected)
    expect(buttons[0]).toHaveStyle('transform: scale(1.1)');
    expect(buttons[0]).not.toHaveStyle(
      'filter: grayscale(100%) brightness(0.5)'
    );

    // Check styles for the second card (used)
    expect(buttons[1]).toHaveStyle('transform: scale(0.9)');
    expect(buttons[1]).toHaveStyle('filter: grayscale(50%) brightness(0.5)');
  });

  it('Apply correct style on hover', async () => {
    const user = userEvent.setup();

    render(<MoveDeck cards={mockCards} own={true} vertical={false} />);
    const buttons = screen.getAllByRole('button');

    // Hover on the first card
    await user.hover(buttons[0]);
    expect(buttons[0]).toHaveStyle('transform: scale(1.1)');

    // Hover on the second card
    await user.hover(buttons[1]);
    expect(buttons[1]).toHaveStyle('transform: scale(0.9)');
  });
});
