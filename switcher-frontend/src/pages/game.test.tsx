import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeEach,
  Mock,
  beforeAll,
  afterAll,
} from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Game from './game';
import { useGame } from '../hooks/useGame';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import { render } from '../services/testUtils';
import { useParams } from 'react-router-dom';
import PlayerInfo from '../components/game/playerInfo';
import Board from '../components/game/board';
import Chat from '../components/game/chat';
import { GAME } from '../mocks/data/gameData';
import MoveDeck from '../components/game/moveDeck';
import FigureDeck from '../components/game/figureDeck';
import { server } from '../mocks/node';
import { Movement } from '../types/gameTypes';

vi.mock('../hooks/useGame');
vi.mock('../hooks/useGameWebSocket');
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));
vi.mock('../components/game/playerInfo');
vi.mock('../components/game/board');
vi.mock('../components/game/moveDeck');
vi.mock('../components/game/figureDeck');
vi.mock('../components/game/chat');

describe('Game', () => {
  const mockUseGame = {
    currentPlayer: {
      position: 'bottom',
      cardsFigure: [],
      cardsMovement: [],
      username: 'player1',
    },
    otherPlayersInPos: {
      top: GAME.players[2],
      left: GAME.players[3],
      right: GAME.players[1],
    },
    endTurn: vi.fn(),
    leaveGame: vi.fn(),
    posEnabledToPlay: 'bottom',
    chatMessages: [],
  };

  const mockUseGameWebSocket = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useParams as Mock).mockReturnValue({ ID: '1' });
    (useGame as Mock).mockReturnValue(mockUseGame);
    (useGameWebSocket as Mock).mockReturnValue(mockUseGameWebSocket);
    (PlayerInfo as Mock).mockReturnValue(<div>PlayerInfoMock</div>);
    (Board as Mock).mockReturnValue(<div>BoardMock</div>);
    (MoveDeck as Mock).mockReturnValue(<div>MoveDeckMock</div>);
    (FigureDeck as Mock).mockReturnValue(<div>FigureDeckMock</div>);
    (Chat as Mock).mockReturnValue(<div>ChatMock</div>);
  });

  afterEach(() => {
    cleanup();
  });

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('renders the Game component correctly', () => {
    render(<Game />);
    expect(screen.getByText('BoardMock')).toBeInTheDocument();
    expect(screen.getByText('MoveDeckMock')).toBeInTheDocument();
    expect(screen.getByText('FigureDeckMock')).toBeInTheDocument();
    expect(screen.getByText('ChatMock')).toBeInTheDocument();
    // 3 PlayerInfo components
    expect(screen.getAllByText('PlayerInfoMock').length).toBe(3);

    // 2 buttons
    expect(screen.getAllByRole('button').length).toBe(3);

    // Button text
    expect(
      screen.getByRole('button', { name: 'Pasar turno' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Abandonar partida' })
    ).toBeInTheDocument();
  });

  it('calls useGameWebSocket with the correct ID', () => {
    render(<Game />);
    expect(useGameWebSocket).toHaveBeenCalledWith(1);
  });

  it('calls useGame', () => {
    render(<Game />);
    expect(useGame).toHaveBeenCalled();
  });

  it('renders PlayerInfo components with correct props', () => {
    render(<Game />);
    expect(PlayerInfo).toHaveBeenCalledWith(
      { player: mockUseGame.otherPlayersInPos.top, pos: 'up' },
      {}
    );
    expect(PlayerInfo).toHaveBeenCalledWith(
      { player: mockUseGame.otherPlayersInPos.left, pos: 'left' },
      {}
    );
    expect(PlayerInfo).toHaveBeenCalledWith(
      { player: mockUseGame.otherPlayersInPos.right, pos: 'right' },
      {}
    );
  });

  it('renders the Board component', () => {
    render(<Game />);
    expect(screen.getByText('BoardMock')).toBeInTheDocument();
  });

  it('renders MoveDeck and FigureDeck components with correct props', () => {
    render(<Game />);
    expect(MoveDeck).toHaveBeenCalledWith(
      { cards: [], vertical: false, own: true },
      {}
    );
    expect(FigureDeck).toHaveBeenCalledWith(
      {
        figures: mockUseGame.currentPlayer.cardsFigure,
        vertical: false,
        amount: 0,
      },
      {}
    );
  });

  it('renders the Chat component with correct props', () => {
    render(<Game />);
    expect(Chat).toHaveBeenCalledWith(
      {
        sendMessage: mockUseGameWebSocket,
        username: mockUseGame.currentPlayer.username,
        chatMessages: mockUseGame.chatMessages,
      },
      {}
    );
  });

  it('enables "Pasar turno" button when posEnabledToPlay matches currentPlayer.position', () => {
    render(<Game />);
    const passTurnButton = screen.getByRole('button', { name: 'Pasar turno' });
    expect(passTurnButton).not.toBeDisabled();
  });

  it('disables "Pasar turno" button when posEnabledToPlay does not match currentPlayer.position', () => {
    (useGame as Mock).mockReturnValue({
      ...mockUseGame,
      posEnabledToPlay: 'top',
    });
    render(<Game />);
    const passTurnButton = screen.getByRole('button', { name: 'Pasar turno' });
    expect(passTurnButton).toBeDisabled();
  });

  it('displays the arrow icon when posEnabledToPlay matches currentPlayer.position', () => {
    render(<Game />);
    expect(screen.getByLabelText('Bottom player turn')).toBeInTheDocument();
  });

  it('does not display the arrow icon when posEnabledToPlay does not match currentPlayer.position', () => {
    (useGame as Mock).mockReturnValue({
      ...mockUseGame,
      posEnabledToPlay: 'top',
    });
    render(<Game />);
    expect(
      screen.queryByLabelText('Bottom player turn')
    ).not.toBeInTheDocument();
  });

  it('Cancle move button is disabled when no card is used', () => {
    render(<Game />);
    const cancelButton = screen.getByRole('button', {
      name: 'Cancelar movimiento',
    });
    expect(cancelButton).toBeDisabled();
  });

  it('Cancel move button is enabled when at least one card is used', () => {
    (useGame as Mock).mockReturnValue({
      ...mockUseGame,
      currentPlayer: {
        ...mockUseGame.currentPlayer,
        cardsMovement: [{ type: Movement.mov3, cardID: 3, isUsed: true }],
      },
    });
    render(<Game />);
    const cancelButton = screen.getByRole('button', {
      name: 'Cancelar movimiento',
    });
    expect(cancelButton).not.toBeDisabled();
  });

  it('calls leaveGame when "Abandonar partida" button is clicked and confirmed', async () => {
    window.confirm = vi.fn().mockImplementation(() => true);
    render(<Game />);
    const leaveGameButton = screen.getByRole('button', {
      name: 'Abandonar partida',
    });
    await userEvent.click(leaveGameButton);
    expect(mockUseGame.leaveGame).toHaveBeenCalled();
  });
});
