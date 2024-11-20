import { screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import BoardTile from './boardTile';
import '@testing-library/jest-dom';
import { useGameTile } from '../../hooks/useGameTile';
import { useGame } from '../../hooks/useGame';
import { ExtendedTile, Color, Movement } from '../../types/gameTypes';
import { render } from '../../services/testUtils';

vi.mock('../../hooks/useGameTile');
vi.mock('../../hooks/useGame');

describe('BoardTile', () => {
  const mockHandleClickTile = vi.fn();

  const mockTile: ExtendedTile = {
    posX: 1,
    posY: 1,
    color: Color.R,
    isHighlighted: false,
    isPartial: false,
    markTopBorder: false,
    markRightBorder: false,
    markBottomBorder: false,
    markLeftBorder: false,
    markBackground: false,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useGameTile as Mock).mockReturnValue({
      handleClickTile: mockHandleClickTile,
      selectedTile: undefined,
    });
    (useGame as Mock).mockReturnValue({
      selectedCard: undefined,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the BoardTile component correctly', () => {
    render(<BoardTile tile={mockTile} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls handleClickTile when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<BoardTile tile={mockTile} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockHandleClickTile).toHaveBeenCalledWith(1, 1);
  });

  it('applies the correct styles when the tile is selected', () => {
    (useGameTile as Mock).mockReturnValue({
      handleClickTile: mockHandleClickTile,
      selectedTile: { posX: 1, posY: 1 },
    });
    render(<BoardTile tile={mockTile} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('transform: scale(1.1)');
  });

  it('applies brightness filter when isNotImportant is true', () => {
    (useGameTile as Mock).mockReturnValue({
      handleClickTile: mockHandleClickTile,
      selectedTile: { posX: 4, posY: 4 },
    });
    (useGame as Mock).mockReturnValue({
      selectedCard: { cardID: 1, type: Movement.mov1, isUsed: false },
    });
    render(<BoardTile tile={mockTile} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('filter: brightness(0.5)');
  });
});
