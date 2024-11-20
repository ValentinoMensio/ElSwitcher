import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import '@testing-library/jest-dom';
import PlayerInfo from './playerInfo';
import { useGame } from '../../hooks/useGame';
import { render } from '../../services/testUtils';

vi.mock('../../hooks/useGame');

describe('PlayerInfo Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useGame as Mock).mockReturnValue({
      posEnabledToPlay: 1,
    });
  });

  it('should return null when player is undefined', () => {
    render(<PlayerInfo player={undefined} pos="left" />);
    expect(screen.queryByText('Player1')).toBeNull();
  });

  it('should show the player on the left', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="left" />);
    expect(screen.getByText('Player1')).toBeInTheDocument();
  });

  it('should show the player on the right', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="right" />);
    expect(screen.getByText('Player1')).toBeInTheDocument();
  });

  it('should show the player on the up', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="up" />);
    expect(screen.getByText('Player1')).toBeInTheDocument();
  });

  it('should show the arrow right when the player is enabled to play', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="left" />);
    expect(screen.getByLabelText('ArrowRight')).toBeInTheDocument();
  });

  it('should show the arrow left when the player is enabled to play', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="right" />);
    expect(screen.getByLabelText('ArrowLeft')).toBeInTheDocument();
  });

  it('should show the arrow down when the player is enabled to play', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 1,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="up" />);
    expect(screen.getByLabelText('ArrowDown')).toBeInTheDocument();
  });

  it('No arrow should be shown when the player is not enabled to play', () => {
    const player = {
      username: 'Player1',
      cardsFigure: [],
      cardsMovement: [],
      position: 2,
      playerID: 123,
      isActive: true,
      sizeDeckFigure: 0,
    };
    render(<PlayerInfo player={player} pos="up" />);
    expect(screen.queryByLabelText('ArrowDown')).toBeNull();
  });
});
