import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
  Mock,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoom } from './useRoom';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useRoomListStore } from '../stores/roomListStore';
import * as roomEndpoints from '../api/roomEndpoints';
import * as utils from '../services/utils';
import { server } from '../mocks/node';
import { ROOM } from '../mocks/data/roomData';

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> =
    await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe('useRoom', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useRoomStore.setState({ room: undefined });
    useRoomListStore.setState({ selectedRoomID: 1 });
  });

  it('Me devuelve el estado de la sala (caso undefined)', () => {
    const { result } = renderHook(() => useRoom());
    expect(result.current.room).toBeUndefined();
  });

  it('Me devuelve el estado de la sala (caso sala cargada)', () => {
    useRoomStore.setState({ room: ROOM });
    const { result } = renderHook(() => useRoom());
    expect(result.current.room).toEqual(ROOM);
  });

  it('Al unirse a una sala, si no hay sala seleccionada, muestra un toast de error', async () => {
    useRoomListStore.setState({ selectedRoomID: undefined });
    const sendToast = vi.spyOn(utils, 'sendToast');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(sendToast).toHaveBeenCalledWith(
      'La información de la sala no es válida',
      null,
      'error'
    );
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('Al unirse a una sala, si no hay jugador cargado, no se llama al endpoint', async () => {
    usePlayerStore.setState({ player: undefined });
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('Al unirse a una sala llama a handleNotificationResponse con éxito', async () => {
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al unirse a una sala se llama al endpoint de unirse a la sala', async () => {
    const joinRoomEndpoint = vi.spyOn(roomEndpoints, 'joinRoom');
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(joinRoomEndpoint).toHaveBeenCalled();
  });

  it('Al salir de una sala, si no hay sala cargada, no se llama al endpoint', async () => {
    useRoomStore.setState({ room: undefined });
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('Al salir de una sala, si no hay jugador cargado, no se llama al endpoint', async () => {
    usePlayerStore.setState({ player: undefined });
    const room = {
      roomID: 1,
      roomName: 'test',
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: 'test' }],
    };
    useRoomStore.setState({ room });
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('Al salir de una sala llama a handleNotificationResponse con éxito', async () => {
    const room = {
      roomID: 1,
      roomName: 'test',
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: 'test' }],
    };
    useRoomStore.setState({ room });
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al salir de una sala se llama al endpoint de salir de la sala', async () => {
    const room = {
      roomID: 1,
      roomName: 'test',
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: 'test' }],
    };
    useRoomStore.setState({ room });
    const leaveRoomEndpoint = vi.spyOn(roomEndpoints, 'leaveRoom');
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(leaveRoomEndpoint).toHaveBeenCalled();
  });

  it('Al crear una sala, si no hay jugador cargado, no se llama al endpoint', async () => {
    usePlayerStore.setState({ player: undefined });
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom('test', 4, 2));
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('Al crear una sala llama a handleNotificationResponse con éxito', async () => {
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom('test', 4, 2));
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al crear una sala se llama al endpoint de crear sala', async () => {
    const createRoomEndpoint = vi.spyOn(roomEndpoints, 'createRoom');
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom('test', 4, 2));
    expect(createRoomEndpoint).toHaveBeenCalled();
  });

  it('Al unirse a una sala privada sin contraseña, se abre el modal de contraseña', async () => {
    useRoomListStore.setState({
      roomList: [
        {
          roomID: 1,
          roomName: 'test',
          private: true,
          maxPlayers: 4,
          actualPlayers: 1,
          started: false,
          playersID: [1000],
        },
      ],
      selectedRoomID: 1,
    });
    const openPasswordModal = vi.spyOn(
      useRoomListStore.getState(),
      'openPasswordModal'
    );
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(openPasswordModal).toHaveBeenCalled();
  });

  it('Al unirse a una sala privada con contraseña, no se abre el modal de contraseña', async () => {
    useRoomListStore.setState({
      roomList: [
        {
          roomID: 1,
          roomName: 'test',
          private: true,
          maxPlayers: 4,
          actualPlayers: 1,
          started: false,
          playersID: [1000],
        },
      ],
      selectedRoomID: 1,
    });
    const openPasswordModal = vi.spyOn(
      useRoomListStore.getState(),
      'openPasswordModal'
    );
    const joinRoomEndpoint = vi.spyOn(roomEndpoints, 'joinRoom');
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom('password'));
    expect(openPasswordModal).not.toHaveBeenCalled();
    expect(joinRoomEndpoint).toHaveBeenCalled();
  });
});
