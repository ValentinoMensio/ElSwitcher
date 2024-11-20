import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './board';
import { useGameTile } from '../../hooks/useGameTile';
import { useGame } from '../../hooks/useGame';
import { BOARD_EXTENDED } from '../../mocks/data/gameData';
import { render } from '../../services/testUtils';

// Mock the useGame hook
vi.mock('../../hooks/useGameTile');
vi.mock('../../hooks/useGame');

describe('Board component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useGameTile as Mock).mockReturnValue({
      board: BOARD_EXTENDED,
    });
    (useGame as Mock).mockReturnValue({
      selectedCard: undefined,
    });
  });

  it('should render correctly with a given board state', () => {
    render(<Board />);
    expect(screen.getByLabelText('game-board')).toBeInTheDocument();
  });

  it('should render the correct number of tiles', () => {
    render(<Board />);
    expect(screen.getByLabelText('game-board').children).toHaveLength(36);
  });

  it("if the board is empty, should render 36 tiles of label 'empty-tile'", () => {
    (useGameTile as Mock).mockReturnValue({
      board: [],
    });
    render(<Board />);
    expect(screen.getByLabelText('game-board').children).toHaveLength(36);
    Array.from(screen.getByLabelText('game-board').children).forEach(
      (child) => {
        expect(child).toHaveAttribute('aria-label', 'empty-tile');
      }
    );
  });
});
