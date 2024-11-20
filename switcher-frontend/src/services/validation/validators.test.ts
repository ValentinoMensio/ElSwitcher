import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  validatePlayerLoaded,
  validateRoomLoaded,
  validatePlayerInRoom,
  validatePlayerOwnerRoom,
  validatePlayerTurn,
  validatePlayerInGame,
  validateGameLoaded,
} from './validators';
import { sendToast } from '../utils';
import { Player } from '../../types/playerTypes';
import { GAME } from '../../mocks/data/gameData';

vi.mock('../utils', () => ({
  sendToast: vi.fn(),
}));

describe('validatePlayerLoaded', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when player is undefined', () => {
    const result = validatePlayerLoaded(undefined);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when player is defined', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const result = validatePlayerLoaded(mockPlayer);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validateRoomLoaded', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when room is undefined', () => {
    const result = validateRoomLoaded(undefined);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información de la sala',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when room is defined', () => {
    const mockRoom = {
      roomID: 1,
      hostID: 1,
      players: [],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validateRoomLoaded(mockRoom);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validatePlayerInRoom', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when room is undefined', () => {
    const result = validatePlayerInRoom(undefined, undefined);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información de la sala',
      null,
      'warning'
    );
  });

  it('should return false and call sendToast when player is undefined', () => {
    const mockRoom = {
      roomID: 1,
      hostID: 1,
      players: [],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validatePlayerInRoom(undefined, mockRoom);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador',
      null,
      'warning'
    );
  });

  it('should return false and call sendToast when player is not in room', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const mockRoom = {
      roomID: 1,
      hostID: 1,
      players: [],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validatePlayerInRoom(mockPlayer, mockRoom);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador en la sala',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when player is in room', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const mockRoom = {
      roomID: 1,
      hostID: 1,
      players: [mockPlayer],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validatePlayerInRoom(mockPlayer, mockRoom);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validatePlayerOwnerRoom', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when player is not in room', () => {
    const result = validatePlayerOwnerRoom(undefined, undefined);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información de la sala',
      null,
      'warning'
    );
  });

  it('should return false and call sendToast when player is not in room', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const mockRoom = {
      roomID: 1,
      hostID: 2,
      players: [mockPlayer],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validatePlayerOwnerRoom(mockPlayer, mockRoom);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'Solo el creador de la sala puede realizar esta acción',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when player is owner of room', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const mockRoom = {
      roomID: 1,
      hostID: 1,
      players: [mockPlayer],
      roomName: 'Test Room',
      maxPlayers: 4,
      minPlayers: 2,
    };
    const result = validatePlayerOwnerRoom(mockPlayer, mockRoom);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validatePlayerTurn', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when player is not in game', () => {
    const result = validatePlayerTurn(
      {
        playerID: 11,
        username: 'asda',
      },
      GAME
    );
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador en la partida',
      null,
      'warning'
    );
  });

  it('should return false and call sendToast when player is not in turn', () => {
    const mockPlayer: Player = { playerID: 3, username: 'test' };
    const result = validatePlayerTurn(mockPlayer, GAME);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith('No es tu turno', null, 'warning');
  });

  it('should return true and not call sendToast when player is in turn', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const result = validatePlayerTurn(mockPlayer, GAME);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validatePlayerInGame', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when player is undefined', () => {
    const result = validatePlayerInGame(undefined, GAME);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador',
      null,
      'warning'
    );
  });

  it('should return false and call sendToast when player is not in game', () => {
    const result = validatePlayerInGame(
      {
        playerID: 11,
        username: 'asda',
      },
      GAME
    );
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información del jugador en la partida',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when player is in game', () => {
    const mockPlayer: Player = { playerID: 1, username: 'test' };
    const result = validatePlayerInGame(mockPlayer, GAME);
    expect(result).toEqual({
      playerID: 1,
      username: 'Player 1',
      position: 2,
      isActive: true,
      sizeDeckFigure: 6,
      cardsFigure: GAME.players[0].cardsFigure,
      cardsMovement: GAME.players[0].cardsMovement,
    });
    expect(sendToast).not.toHaveBeenCalled();
  });
});

describe('validateGameLoaded', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false and call sendToast when game is undefined', () => {
    const result = validateGameLoaded(undefined);
    expect(result).toBe(false);
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha podido cargar la información de la partida',
      null,
      'warning'
    );
  });

  it('should return true and not call sendToast when game is defined', () => {
    const result = validateGameLoaded(GAME);
    expect(result).toBe(true);
    expect(sendToast).not.toHaveBeenCalled();
  });
});
