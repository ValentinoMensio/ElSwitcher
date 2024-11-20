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
import userEvent from '@testing-library/user-event';
import Home from './home';
import { useRoom } from '../hooks/useRoom';
import { useRoomList } from '../hooks/useRoomList';
import { usePlayer } from '../hooks/usePlayer';
import RoomCreationForm from '../components/home/roomCreationForm';
import RoomList from '../components/home/roomList';
import { server } from '../mocks/node';
import { ChakraProvider } from '@chakra-ui/react';
import { render } from '../services/testUtils';

vi.mock('../hooks/useRoom');
vi.mock('../hooks/useRoomList');
vi.mock('../hooks/usePlayer');
vi.mock('../components/home/roomCreationForm');
vi.mock('../components/home/roomList');

describe('Home', () => {
  const mockJoinRoom = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoom as Mock).mockReturnValue({
      joinRoom: mockJoinRoom,
    });
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
    });
    (usePlayer as Mock).mockReturnValue({
      player: {
        playerID: 1,
        username: 'Username Test',
      },
    });
    (RoomCreationForm as Mock).mockReturnValue(<div>RoomCreationFormMock</div>);
    (RoomList as Mock).mockReturnValue(<div>RoomListMock</div>);
  });

  afterEach(() => {
    cleanup();
  });

  it('Render the home component', () => {
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    // Check if hooks are called
    expect(usePlayer).toHaveBeenCalled();
    expect(useRoomList).toHaveBeenCalled();
    expect(useRoom).toHaveBeenCalled();

    // Check if the username is displayed
    expect(screen.getByText('Username Test')).toBeInTheDocument();

    // Check if the room creation form is rendered
    expect(screen.getByText('RoomCreationFormMock')).toBeInTheDocument();

    // Check if the room list is rendered
    expect(screen.getByText('RoomListMock')).toBeInTheDocument();

    // Check if the buttons are rendered
    expect(screen.getByLabelText('Create Room')).toBeInTheDocument();
    expect(screen.getByLabelText('Join Room')).toBeInTheDocument();
  });

  it('Join room button is disabled', () => {
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: undefined,
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    expect(screen.getByLabelText('Join Room')).toBeDisabled();
  });

  it('Join room button is enabled', () => {
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    expect(screen.getByLabelText('Join Room')).not.toBeDisabled();
  });

  it('Opens password modal when join room button is clicked', async () => {
    const user = userEvent.setup();
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
      passwordModalOpen: true,
      closePasswordModal: vi.fn(),
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    await user.click(screen.getByLabelText('Join Room'));
    expect(screen.getByText('Introduce la contraseña')).toBeInTheDocument();
  });

  it('Calls joinRoom with password when join button is clicked in modal', async () => {
    const user = userEvent.setup();
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
      passwordModalOpen: true,
      closePasswordModal: vi.fn(),
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    await user.type(screen.getByPlaceholderText('Contraseña'), 'test-password');
    await user.click(screen.getByText('Unirse'));
    expect(mockJoinRoom).toHaveBeenCalledWith('test-password');
  });
  it('Displays room message modal when roomMessage is set', () => {
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
      roomMessage: 'Player1',
      setRoomMessage: vi.fn(),
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    expect(screen.getByText('El ganador fue...')).toBeInTheDocument();
    expect(screen.getByText('Player1')).toBeInTheDocument();
  });

  it('Closes room message modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const setRoomMessageMock = vi.fn();
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
      roomMessage: 'Player1',
      setRoomMessage: setRoomMessageMock,
    });
    render(
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    );
    await user.click(screen.getByText('Cerrar'));
    expect(setRoomMessageMock).toHaveBeenCalledWith(undefined);
  });
});
