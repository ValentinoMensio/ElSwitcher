import { describe, it, expect, beforeEach, afterEach, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import { useRoomListWebSocket } from './useRoomListWebSocket';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomListStore } from '../stores/roomListStore';

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> =
    await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe('useRoomListWebSocket', () => {
  const ROOMS = [
    {
      roomID: 1,
      roomName: 'Sala 1',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
    },
    {
      roomID: 2,
      roomName: 'Sala 2',
      maxPlayers: 4,
      actualPlayers: 3,
      started: false,
      private: true,
    },
    {
      roomID: 3,
      roomName: 'Somebody once told me',
      maxPlayers: 2,
      actualPlayers: 2,
      started: false,
      private: false,
    },
    {
      roomID: 4,
      roomName: 'the world is gonna roll me',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
    },
    {
      roomID: 5,
      roomName: '.',
      maxPlayers: 4,
      actualPlayers: 3,
      started: false,
      private: true,
    },
    {
      roomID: 6,
      roomName: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
    },
    {
      roomID: 7,
      roomName: 'SALA EMPEZADA',
      maxPlayers: 4,
      actualPlayers: 2,
      started: true,
      private: false,
    },
    {
      roomID: 8,
      roomName: 'Sala llena',
      maxPlayers: 4,
      actualPlayers: 4,
      started: false,
      private: false,
    },
    {
      roomID: 9,
      roomName: 'OwO',
      maxPlayers: 3,
      actualPlayers: 2,
      started: false,
      private: false,
    },
  ];

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useRoomListStore.setState({
      roomList: undefined,
      selectedRoomID: undefined,
    });
  });

  afterEach(() => {
    WS.clean();
  });

  it('Se conecta al WebSocket y recibe el estado de la lista de salas', async () => {
    useRoomListStore.setState({ selectedRoomID: 7 });
    const webSocketUrl = `ws://localhost:8000/rooms/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomListWebSocket();
    });
    await server.connected;

    server.send('{"type":"status","payload":' + JSON.stringify(ROOMS) + '}');

    const roomList = useRoomListStore.getState().roomList;
    expect(roomList).toEqual(ROOMS);

    // Se resetea el estado de la sala seleccionada
    const selectedRoomID = useRoomListStore.getState().selectedRoomID;
    expect(selectedRoomID).toBeUndefined();
  });

  it('Se cierra el WebSocket si el jugador no existe', async () => {
    const webSocketUrl = `ws://localhost:8000/rooms/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomListWebSocket();
    });
    await server.connected;

    server.close({
      code: 4004,
      reason: 'Jugador no encontrado',
      wasClean: true,
    });

    const roomList = useRoomListStore.getState().roomList;
    expect(roomList).toBeUndefined();
    const player = usePlayerStore.getState().player;
    expect(player).toBeUndefined();
  });

  it('Se redirecciona al jugador a la página de registro si el jugador no existe', async () => {
    const webSocketUrl = `ws://localhost:8000/rooms/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomListWebSocket();
    });
    await server.connected;

    server.close({
      code: 4004,
      reason: 'Jugador no encontrado',
      wasClean: true,
    });

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('Si tengo una sala seleccionada y esta ya no está disponible, se deselecciona', async () => {
    useRoomListStore.setState({ selectedRoomID: 7 });
    const webSocketUrl = `ws://localhost:8000/rooms/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomListWebSocket();
    });
    await server.connected;

    server.send('{"type":"status","payload":' + JSON.stringify(ROOMS) + '}');

    const selectedRoomID = useRoomListStore.getState().selectedRoomID;
    expect(selectedRoomID).toBeUndefined();
  });

  it('Si tengo una sala seleccionada y esta ahora está llena, se deselecciona', async () => {
    useRoomListStore.setState({ selectedRoomID: 8 });
    const webSocketUrl = `ws://localhost:8000/rooms/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomListWebSocket();
    });
    await server.connected;

    server.send('{"type":"status","payload":' + JSON.stringify(ROOMS) + '}');

    const selectedRoomID = useRoomListStore.getState().selectedRoomID;
    expect(selectedRoomID).toBeUndefined();
  });
});
