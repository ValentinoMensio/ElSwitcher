import { describe, it, expect, beforeEach, afterEach, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import { useRoomWebSocket } from './useRoomWebSocket';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import * as utils from '../services/utils';

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> =
    await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe('useRoomWebSocket', () => {
  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useRoomStore.setState({ room: undefined });
  });

  afterEach(() => {
    WS.clean();
  });

  it('Se conecta al WebSocket y recibe el estado de la sala', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.send(
      '{"type":"status","payload":{"roomID":1,"roomName":"test","hostID":1,"maxPlayers":4,"minPlayers":2,"players":[{"playerID":1,"username":"test"}]}}'
    );

    const room = useRoomStore.getState().room;
    expect(room).toEqual({
      roomID: 1,
      roomName: 'test',
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: 'test' }],
    });
  });

  it('Se cierra el WebSocket si el jugador o la sala no existen', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.close({
      code: 4004,
      reason: 'Jugador o sala no encontradas',
      wasClean: true,
    });

    const room = useRoomStore.getState().room;
    expect(room).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se cierra el WebSocket en caso de error 4003', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.close({ code: 4003, reason: 'Error de conexión', wasClean: true });

    const room = useRoomStore.getState().room;
    expect(room).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se cierra el WebSocket si se inicia una conexión en otro dispositivo', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.close({
      code: 4005,
      reason: 'Conexión iniciada en otro dispositivo',
      wasClean: true,
    });

    const room = useRoomStore.getState().room;
    expect(room).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Si se recibe un mensaje de inicio de partida, se redirige a la sala de juego', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.send('{"type":"start","payload":{"gameID":1}}');

    expect(mockNavigate).toHaveBeenCalledWith('/game/1');
  });

  it('Si se recibe un mensaje de fin de partida, se redirige al inicio', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.send('{"type":"end", "payload":{}}');

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Si se recibe un mensaje de fin de partida, se elimina la sala', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.send('{"type":"end", "payload":{}}');

    const room = useRoomStore.getState().room;
    expect(room).toBeUndefined();
  });
  it('Si se recibe un mensaje de fin de partida, se muestra un toast', async () => {
    const roomID = 1;
    const webSocketUrl = `ws://localhost:8000/rooms/1/1`;
    const server = new WS(webSocketUrl);
    const sendToast = vi.spyOn(utils, 'sendToast');
    renderHook(() => {
      useRoomWebSocket(roomID);
    });
    await server.connected;

    server.send('{"type":"end", "payload":{}}');

    expect(sendToast).toHaveBeenCalledWith(
      'Sala cerrada',
      'La sala ha sido cerrada por el creador',
      'info'
    );
  });
});
