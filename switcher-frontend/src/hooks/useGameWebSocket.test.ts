import { describe, it, expect, beforeEach, afterEach, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import { useGameWebSocket } from './useGameWebSocket';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> =
    await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe('useGameWebSocket', () => {
  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useGameStore.setState({ game: undefined });
  });

  afterEach(() => {
    WS.clean();
  });

  it('Se conecta al WebSocket y recibe el estado del juego', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useGameWebSocket(gameID);
    });
    await server.connected;

    server.send(
      '{"type":"status","payload":{"gameID":4,"board":[{"posX":0,"posY":0,"color":"G","isPartial":false},{"posX":0,"posY":1,"color":"Y","isPartial":false},{"posX":0,"posY":2,"color":"G","isPartial":false},{"posX":0,"posY":3,"color":"G","isPartial":false},{"posX":0,"posY":4,"color":"B","isPartial":false},{"posX":0,"posY":5,"color":"Y","isPartial":false},{"posX":1,"posY":0,"color":"G","isPartial":false},{"posX":1,"posY":1,"color":"B","isPartial":false},{"posX":1,"posY":2,"color":"B","isPartial":false},{"posX":1,"posY":3,"color":"Y","isPartial":false},{"posX":1,"posY":4,"color":"B","isPartial":false},{"posX":1,"posY":5,"color":"Y","isPartial":false},{"posX":2,"posY":0,"color":"R","isPartial":false},{"posX":2,"posY":1,"color":"Y","isPartial":false},{"posX":2,"posY":2,"color":"R","isPartial":false},{"posX":2,"posY":3,"color":"R","isPartial":false},{"posX":2,"posY":4,"color":"B","isPartial":false},{"posX":2,"posY":5,"color":"G","isPartial":false},{"posX":3,"posY":0,"color":"R","isPartial":false},{"posX":3,"posY":1,"color":"R","isPartial":false},{"posX":3,"posY":2,"color":"B","isPartial":false},{"posX":3,"posY":3,"color":"G","isPartial":false},{"posX":3,"posY":4,"color":"R","isPartial":false},{"posX":3,"posY":5,"color":"Y","isPartial":false},{"posX":4,"posY":0,"color":"Y","isPartial":false},{"posX":4,"posY":1,"color":"G","isPartial":false},{"posX":4,"posY":2,"color":"Y","isPartial":false},{"posX":4,"posY":3,"color":"R","isPartial":false},{"posX":4,"posY":4,"color":"B","isPartial":false},{"posX":4,"posY":5,"color":"R","isPartial":false},{"posX":5,"posY":0,"color":"Y","isPartial":false},{"posX":5,"posY":1,"color":"G","isPartial":false},{"posX":5,"posY":2,"color":"B","isPartial":false},{"posX":5,"posY":3,"color":"B","isPartial":false},{"posX":5,"posY":4,"color":"R","isPartial":false},{"posX":5,"posY":5,"color":"G","isPartial":false}],"prohibitedColor":null,"posEnabledToPlay":1,"players":[{"playerID":2,"username":"Gonzalo","position":3,"isActive":true,"sizeDeckFigure":0,"cardsFigure":[{"type":"fige06","cardID":151,"isBlocked":false},{"type":"fig04","cardID":152,"isBlocked":false},{"type":"fig05","cardID":153,"isBlocked":false}]},{"playerID":3,"username":"Benjamin","position":1,"isActive":true,"sizeDeckFigure":0,"cardsFigure":[{"type":"fig06","cardID":157,"isBlocked":false},{"type":"fige02","cardID":158,"isBlocked":false},{"type":"fig08","cardID":159,"isBlocked":false}]},{"playerID":4,"username":"Valentino","position":4,"isActive":true,"sizeDeckFigure":0,"cardsFigure":[{"type":"fig05","cardID":163,"isBlocked":false},{"type":"fig17","cardID":164,"isBlocked":false},{"type":"fige01","cardID":165,"isBlocked":false}]},{"playerID":5,"username":"Facundo","position":2,"isActive":true,"sizeDeckFigure":0,"cardsFigure":[{"type":"fig04","cardID":169,"isBlocked":false},{"type":"fig18","cardID":170,"isBlocked":false},{"type":"fig13","cardID":171,"isBlocked":false}]}],"figuresToUse":[],"cardsMovement":[{"type":"mov07","cardID":145,"isUsed":false},{"type":"mov03","cardID":146,"isUsed":false},{"type":"mov01","cardID":147,"isUsed":false}]}}'
    );
    const game = useGameStore.getState().game;
    expect(game).toEqual({
      gameID: 4,
      board: [
        { posX: 0, posY: 0, color: 'G', isPartial: false },
        { posX: 0, posY: 1, color: 'Y', isPartial: false },
        { posX: 0, posY: 2, color: 'G', isPartial: false },
        { posX: 0, posY: 3, color: 'G', isPartial: false },
        { posX: 0, posY: 4, color: 'B', isPartial: false },
        { posX: 0, posY: 5, color: 'Y', isPartial: false },
        { posX: 1, posY: 0, color: 'G', isPartial: false },
        { posX: 1, posY: 1, color: 'B', isPartial: false },
        { posX: 1, posY: 2, color: 'B', isPartial: false },
        { posX: 1, posY: 3, color: 'Y', isPartial: false },
        { posX: 1, posY: 4, color: 'B', isPartial: false },
        { posX: 1, posY: 5, color: 'Y', isPartial: false },
        { posX: 2, posY: 0, color: 'R', isPartial: false },
        { posX: 2, posY: 1, color: 'Y', isPartial: false },
        { posX: 2, posY: 2, color: 'R', isPartial: false },
        { posX: 2, posY: 3, color: 'R', isPartial: false },
        { posX: 2, posY: 4, color: 'B', isPartial: false },
        { posX: 2, posY: 5, color: 'G', isPartial: false },
        { posX: 3, posY: 0, color: 'R', isPartial: false },
        { posX: 3, posY: 1, color: 'R', isPartial: false },
        { posX: 3, posY: 2, color: 'B', isPartial: false },
        { posX: 3, posY: 3, color: 'G', isPartial: false },
        { posX: 3, posY: 4, color: 'R', isPartial: false },
        { posX: 3, posY: 5, color: 'Y', isPartial: false },
        { posX: 4, posY: 0, color: 'Y', isPartial: false },
        { posX: 4, posY: 1, color: 'G', isPartial: false },
        { posX: 4, posY: 2, color: 'Y', isPartial: false },
        { posX: 4, posY: 3, color: 'R', isPartial: false },
        { posX: 4, posY: 4, color: 'B', isPartial: false },
        { posX: 4, posY: 5, color: 'R', isPartial: false },
        { posX: 5, posY: 0, color: 'Y', isPartial: false },
        { posX: 5, posY: 1, color: 'G', isPartial: false },
        { posX: 5, posY: 2, color: 'B', isPartial: false },
        { posX: 5, posY: 3, color: 'B', isPartial: false },
        { posX: 5, posY: 4, color: 'R', isPartial: false },
        { posX: 5, posY: 5, color: 'G', isPartial: false },
      ],
      prohibitedColor: null,
      posEnabledToPlay: 1,
      players: [
        {
          playerID: 2,
          username: 'Gonzalo',
          position: 3,
          isActive: true,
          sizeDeckFigure: 0,
          cardsFigure: [
            { type: 'fige06', cardID: 151, isBlocked: false },
            { type: 'fig04', cardID: 152, isBlocked: false },
            { type: 'fig05', cardID: 153, isBlocked: false },
          ],
        },
        {
          playerID: 3,
          username: 'Benjamin',
          position: 1,
          isActive: true,
          sizeDeckFigure: 0,
          cardsFigure: [
            { type: 'fig06', cardID: 157, isBlocked: false },
            { type: 'fige02', cardID: 158, isBlocked: false },
            { type: 'fig08', cardID: 159, isBlocked: false },
          ],
        },
        {
          playerID: 4,
          username: 'Valentino',
          position: 4,
          isActive: true,
          sizeDeckFigure: 0,
          cardsFigure: [
            { type: 'fig05', cardID: 163, isBlocked: false },
            { type: 'fig17', cardID: 164, isBlocked: false },
            { type: 'fige01', cardID: 165, isBlocked: false },
          ],
        },
        {
          playerID: 5,
          username: 'Facundo',
          position: 2,
          isActive: true,
          sizeDeckFigure: 0,
          cardsFigure: [
            { type: 'fig04', cardID: 169, isBlocked: false },
            { type: 'fig18', cardID: 170, isBlocked: false },
            { type: 'fig13', cardID: 171, isBlocked: false },
          ],
        },
      ],
      figuresToUse: [],
      cardsMovement: [
        { type: 'mov07', cardID: 145, isUsed: false },
        { type: 'mov03', cardID: 146, isUsed: false },
        { type: 'mov01', cardID: 147, isUsed: false },
      ],
    });
  });

  it('Se cierra el WebSocket si el jugador o el juego no existen', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useGameWebSocket(gameID);
    });
    await server.connected;

    server.close({
      code: 4004,
      reason: 'Jugador o partida no encontradas',
      wasClean: true,
    });

    const game = useGameStore.getState().game;
    expect(game).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se cierra el WebSocket si el jugador ya está conectado en otro dispositivo', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useGameWebSocket(gameID);
    });
    await server.connected;

    server.close({
      code: 4005,
      reason: 'Jugador ya conectado en otro dispositivo',
      wasClean: true,
    });

    const game = useGameStore.getState().game;
    expect(game).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se cierra el WebSocket si hay un error desconocido', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useGameWebSocket(gameID);
    });
    await server.connected;

    server.error({
      code: 4003,
      reason: 'Error desconocido',
      wasClean: true,
    });

    const game = useGameStore.getState().game;
    expect(game).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se recibe un mensaje de fin de juego', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      useGameWebSocket(gameID);
    });
    await server.connected;

    server.send('{"type":"end","payload":{"username":"test"}}');

    const game = useGameStore.getState().game;
    expect(game).toBeUndefined();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Se envía un mensaje al WebSocket', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    const { result } = renderHook(() => {
      return useGameWebSocket(gameID);
    });
    await server.connected;

    result.current({
      type: 'msg',
      payload: { username: 'test', text: 'test' },
    });

    await expect(server).toReceiveMessage(
      '{"type":"msg","payload":{"username":"test","text":"test"}}'
    );
  });

  it('Se recibe un mensaje del WebSocket', async () => {
    const gameID = 1;
    const webSocketUrl = `ws://localhost:8000/games/1/1`;
    const server = new WS(webSocketUrl);
    renderHook(() => {
      return useGameWebSocket(gameID);
    });
    await server.connected;

    server.send('{"type":"msg","payload":{"username":"test","text":"test"}}');

    const chatMessages = useGameStore.getState().chat;
    expect(chatMessages).toEqual([{ username: 'test', text: 'test' }]);
  });
});
