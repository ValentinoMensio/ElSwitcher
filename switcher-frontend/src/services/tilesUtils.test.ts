import { describe, it, expect } from 'vitest';
import { isHighlighted, getExtendedBoard } from './tilesUtils';
import {
  Game,
  MovementCard,
  FigureCard,
  CoordsTile,
  Movement,
  Color,
  Figure,
} from '../types/gameTypes';

const mockMovementCard: MovementCard = {
  type: Movement.mov1,
  cardID: 1,
  isUsed: false,
};

const mockGame: Game = {
  gameID: 1,
  prohibitedColor: Color.Y,
  cardsMovement: [mockMovementCard],
  posEnabledToPlay: 1,
  players: [],
  board: [
    { posX: 0, posY: 0, color: Color.R, isPartial: false },
    { posX: 1, posY: 1, color: Color.B, isPartial: false },
    { posX: 2, posY: 2, color: Color.G, isPartial: false },
  ],
  figuresToUse: [
    [
      { posX: 0, posY: 0 },
      { posX: 0, posY: 1 },
      { posX: 1, posY: 0 },
      { posX: 1, posY: 1 },
    ],
  ],
};

const mockFigureCard: FigureCard = {
  type: Figure.fig01,
  cardID: 1,
  isBlocked: false,
};

const mockCoords: CoordsTile = { posX: 0, posY: 0 };
const mockSelectedCoords: CoordsTile = { posX: 2, posY: 2 };

describe('tilesUtils', () => {
  describe('isHighlighted', () => {
    it('should return true for valid movement card and coordinates', () => {
      const result = isHighlighted(
        mockCoords,
        mockSelectedCoords,
        mockMovementCard
      );
      expect(result).toBe(true);
    });

    it('should return false for figure card', () => {
      const result = isHighlighted(
        mockCoords,
        mockSelectedCoords,
        mockFigureCard
      );
      expect(result).toBe(false);
    });

    it('should return false for undefined card', () => {
      const result = isHighlighted(mockCoords, mockSelectedCoords, undefined);
      expect(result).toBe(false);
    });

    it('test case for movements cards', () => {
      const result_mov1_false = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov1, cardID: 1, isUsed: false }
      );
      expect(result_mov1_false).toBe(false);

      const result_mov1_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 2, posY: 2 },
        { type: Movement.mov1, cardID: 1, isUsed: false }
      );
      expect(result_mov1_true).toBe(true);

      const result_mov2_false = isHighlighted(
        { posX: 2, posY: 2 },
        { posX: 0, posY: 0 },
        { type: Movement.mov2, cardID: 2, isUsed: false }
      );
      expect(result_mov2_false).toBe(false);

      const result_mov2_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 0, posY: 2 },
        { type: Movement.mov2, cardID: 2, isUsed: false }
      );

      expect(result_mov2_true).toBe(true);

      const result_mov3_false = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov3, cardID: 3, isUsed: false }
      );
      expect(result_mov3_false).toBe(false);

      const result_mov3_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 0, posY: 1 },
        { type: Movement.mov3, cardID: 3, isUsed: false }
      );

      expect(result_mov3_true).toBe(true);

      const result_mov4_false = isHighlighted(
        { posX: 3, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov4, cardID: 4, isUsed: false }
      );
      expect(result_mov4_false).toBe(false);

      const result_mov4_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov4, cardID: 4, isUsed: false }
      );

      expect(result_mov4_true).toBe(true);

      const result_mov5_false = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov5, cardID: 5, isUsed: false }
      );

      expect(result_mov5_false).toBe(false);

      const result_mov5_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 2 },
        { type: Movement.mov5, cardID: 5, isUsed: false }
      );

      expect(result_mov5_true).toBe(true);

      const result_mov6_false = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 2 },
        { type: Movement.mov6, cardID: 6, isUsed: false }
      );

      expect(result_mov6_false).toBe(false);

      const result_mov6_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 2, posY: 1 },
        { type: Movement.mov6, cardID: 6, isUsed: false }
      );

      expect(result_mov6_true).toBe(true);

      const result_mov7_false = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 1, posY: 1 },
        { type: Movement.mov7, cardID: 7, isUsed: false }
      );

      expect(result_mov7_false).toBe(false);

      const result_mov7_true = isHighlighted(
        { posX: 0, posY: 0 },
        { posX: 0, posY: 5 },
        { type: Movement.mov7, cardID: 7, isUsed: false }
      );

      expect(result_mov7_true).toBe(true);
    });
  });

  describe('getExtendedBoard', () => {
    it('should return extended board with highlighted and border marks', () => {
      const result = getExtendedBoard(mockGame, mockCoords, mockMovementCard);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('isHighlighted');
      expect(result[0]).toHaveProperty('markTopBorder');
      expect(result[0]).toHaveProperty('markRightBorder');
      expect(result[0]).toHaveProperty('markBottomBorder');
      expect(result[0]).toHaveProperty('markLeftBorder');
    });

    it('should return empty array for undefined game', () => {
      const result = getExtendedBoard(undefined, mockCoords, mockMovementCard);
      expect(result).toEqual([]);
    });
  });
});
