import { describe, it, expect } from 'vitest';
import { getPlayersPositions, areCardsEqual } from './gameUtils';
import { Figure, Movement, PlayerInGame } from '../types/gameTypes';

describe('getPlayersPositions', () => {
  it('should return undefined positions when players is undefined', () => {
    const result = getPlayersPositions(undefined, 1);
    expect(result).toEqual({
      top: undefined,
      right: undefined,
      left: undefined,
    });
  });

  it('should return the only player at top when there is one player', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 1);
    expect(result).toEqual({
      top: players[0],
      right: undefined,
      left: undefined,
    });
  });

  it('should return correct positions when there are two players and currentPosition is 1', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 1);
    expect(result).toEqual({
      top: undefined,
      right: players[0],
      left: players[1],
    });
  });

  it('should return correct positions when there are two players and currentPosition is 2', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 2);
    expect(result).toEqual({
      top: undefined,
      right: players[1],
      left: players[0],
    });
  });

  it('should return correct positions when there are three players and currentPosition is 1', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 3,
        position: 3,
        username: 'Player3',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 1);
    expect(result).toEqual({
      top: players[1],
      right: players[0],
      left: players[2],
    });
  });

  it('should return correct positions when there are three players and currentPosition is 2', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 3,
        position: 3,
        username: 'Player3',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 2);
    expect(result).toEqual({
      top: players[2],
      right: players[1],
      left: players[0],
    });
  });

  it('should return correct positions when there are three players and currentPosition is 3', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 3,
        position: 3,
        username: 'Player3',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 3);
    expect(result).toEqual({
      top: players[0],
      right: players[2],
      left: players[1],
    });
  });

  it('should return correct positions when there are three players and currentPosition is 4', () => {
    const players: PlayerInGame[] = [
      {
        playerID: 1,
        position: 1,
        username: 'Player1',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 2,
        position: 2,
        username: 'Player2',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
      {
        playerID: 3,
        position: 3,
        username: 'Player3',
        isActive: true,
        sizeDeckFigure: 0,
        cardsFigure: [],
      },
    ];
    const result = getPlayersPositions(players, 4);
    expect(result).toEqual({
      top: players[1],
      right: players[0],
      left: players[2],
    });
  });

  it('cards Equals undefined', () => {
    const result = areCardsEqual(undefined, undefined);
    expect(result).toBe(false);
  });

  it('cards Equals undefined and movement card', () => {
    const movementCard = { cardID: 1, type: Movement.mov1, isUsed: false };
    const result = areCardsEqual(undefined, movementCard);
    expect(result).toBe(false);
  });

  it('cards Equals figure card and movement card', () => {
    const figureCard = { cardID: 1, type: Movement.mov1, isUsed: false };
    const movementCard = { cardID: 1, type: Figure.fig04, isBlocked: false };
    const result = areCardsEqual(figureCard, movementCard);
    expect(result).toBe(false);
  });

  it('cards Equals figure card and figure card', () => {
    const figureCard1 = { cardID: 1, type: Figure.fig04, isBlocked: false };
    const figureCard2 = { cardID: 1, type: Figure.fig04, isBlocked: false };
    const result = areCardsEqual(figureCard1, figureCard2);
    expect(result).toBe(true);
  });

  it('cards Equals movement card and movement card', () => {
    const movementCard1 = { cardID: 1, type: Movement.mov1, isUsed: false };
    const movementCard2 = { cardID: 1, type: Movement.mov1, isUsed: false };
    const result = areCardsEqual(movementCard1, movementCard2);
    expect(result).toBe(true);
  });

  it('cards Equals figure card and figure card distinct', () => {
    const figureCard1 = { cardID: 1, type: Figure.fig04, isBlocked: false };
    const figureCard2 = { cardID: 2, type: Figure.fig04, isBlocked: false };
    const result = areCardsEqual(figureCard1, figureCard2);
    expect(result).toBe(false);
  });

  it('cards Equals movement card and movement card distinct', () => {
    const movementCard1 = { cardID: 1, type: Movement.mov1, isUsed: false };
    const movementCard2 = { cardID: 2, type: Movement.mov1, isUsed: false };
    const result = areCardsEqual(movementCard1, movementCard2);
    expect(result).toBe(false);
  });
});
