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
import '@testing-library/jest-dom';
import Room from './room';
import { useRoom } from '../hooks/useRoom';
import { useGame } from '../hooks/useGame';
import { useRoomWebSocket } from '../hooks/useRoomWebSocket';

import RoomData from '../components/room/roomData';
import { server } from '../mocks/node';
import { render } from '../services/testUtils';
import { usePlayer } from '../hooks/usePlayer';
import userEvent from '@testing-library/user-event';

vi.mock('../hooks/useRoom');
vi.mock('../hooks/useRoomWebSocket');
vi.mock('../components/room/roomData');
vi.mock('../hooks/useGame');
vi.mock('../hooks/usePlayer');

describe('Room', () => {
  const mockLeaveRoom = vi.fn();
  const room = {
    roomID: 1,
    hostID: 2,
    roomName: 'Room Test',
    maxPlayers: 4,
    minPlayers: 2,
    players: [
      { playerID: 1, username: 'Player 1' },
      { playerID: 2, username: 'Player 2' },
    ],
  };

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoom as Mock).mockReturnValue({
      leaveRoom: mockLeaveRoom,
      room: room,
    });
    (RoomData as Mock).mockReturnValue(<div>RoomDataMock</div>);
    (useGame as Mock).mockReturnValue({
      startGame: vi.fn(),
    });
    (usePlayer as Mock).mockReturnValue({
      player: { playerID: 1, username: 'Player 1' },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('Render the room component', () => {
    render(<Room />);
    // Check if hooks are called
    expect(useRoom).toHaveBeenCalled();
    expect(useRoomWebSocket).toHaveBeenCalled();

    // Check if the room data is rendered
    expect(screen.getByText('RoomDataMock')).toBeInTheDocument();
  });

  it('Render the leave room button', () => {
    render(<Room />);
    expect(screen.getByText('Abandonar sala')).toBeInTheDocument();
  });

  it('Not render the start game button if the player is not the host', () => {
    render(<Room />);
    expect(screen.queryByText('Iniciar partida')).not.toBeInTheDocument();
  });

  it('Render the start game button', () => {
    (usePlayer as Mock).mockReturnValue({
      player: { playerID: 2, username: 'Player 2' },
    });
    render(<Room />);
    expect(screen.getByText('Iniciar partida')).toBeInTheDocument();
  });

  it('Render the close room button', () => {
    (usePlayer as Mock).mockReturnValue({
      player: { playerID: 2, username: 'Player 2' },
    });
    render(<Room />);
    expect(screen.getByText('Cerrar sala')).toBeInTheDocument();
  });

  it('Call leave room function', async () => {
    const user = userEvent.setup();
    render(<Room />);
    await user.click(screen.getByText('Abandonar sala'));
    expect(mockLeaveRoom).toHaveBeenCalled();
  });

  it('Call start game function', async () => {
    (usePlayer as Mock).mockReturnValue({
      player: { playerID: 2, username: 'Player 2' },
    });
    const user = userEvent.setup();
    render(<Room />);
    await user.click(screen.getByText('Iniciar partida'));
    expect(useGame).toHaveBeenCalled();
    expect(useGame().startGame).toHaveBeenCalled();
  });
});
