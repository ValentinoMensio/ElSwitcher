import { Movement, Figure, Color } from '../../types/gameTypes';

const BOARD = Array.from({ length: 36 }, (_, i) => ({
  posX: i % 6,
  posY: Math.floor(i / 6),
  color:
    i % 4 === 0
      ? Color.R
      : i % 4 === 1
        ? Color.B
        : i % 4 === 2
          ? Color.G
          : Color.Y,
  isPartial: false,
}));

export const GAME = {
  gameID: 1,
  board: BOARD,
  timer: 0,
  figuresToUse: [
    [
      { posX: 1, posY: 1 },
      { posX: 2, posY: 1 },
      { posX: 3, posY: 1 },
      { posX: 4, posY: 1 },
    ],
  ],
  prohibitedColor: undefined,
  posEnabledToPlay: 2,
  players: [
    {
      position: 2,
      username: 'Player 1',
      playerID: 1,
      isActive: true,
      sizeDeckFigure: 6,
      cardsFigure: [
        {
          type: Figure.fig01,
          cardID: 1,
          isBlocked: false,
        },
        {
          type: Figure.fig02,
          cardID: 2,
          isBlocked: false,
        },
        {
          type: Figure.fig03,
          cardID: 3,
          isBlocked: true,
        },
      ],
      cardsMovement: [
        {
          type: Movement.mov1,
          cardID: 1,
          isUsed: false,
        },
        {
          type: Movement.mov2,
          cardID: 2,
          isUsed: false,
        },
        {
          type: Movement.mov3,
          cardID: 3,
          isUsed: false,
        },
      ],
    },
    {
      position: 3,
      username: 'Player 2',
      playerID: 2,
      isActive: true,
      sizeDeckFigure: 5,
      cardsFigure: [
        {
          type: Figure.fig04,
          cardID: 4,
          isBlocked: false,
        },
        {
          type: Figure.fig05,
          cardID: 5,
          isBlocked: false,
        },
        {
          type: Figure.fig06,
          cardID: 6,
          isBlocked: true,
        },
      ],
      cardsMovement: [
        {
          type: Movement.mov4,
          cardID: 4,
          isUsed: false,
        },
        {
          type: Movement.mov5,
          cardID: 5,
          isUsed: false,
        },
        {
          type: Movement.mov6,
          cardID: 6,
          isUsed: false,
        },
      ],
    },
    {
      position: 4,
      username: 'Player 3',
      playerID: 3,
      isActive: true,
      sizeDeckFigure: 4,
      cardsFigure: [
        {
          type: Figure.fig01,
          cardID: 7,
          isBlocked: false,
        },
        {
          type: Figure.fig02,
          cardID: 8,
          isBlocked: false,
        },
        {
          type: Figure.fig03,
          cardID: 9,
          isBlocked: false,
        },
      ],
      cardsMovement: [
        {
          type: Movement.mov7,
          cardID: 7,
          isUsed: false,
        },
        {
          type: Movement.mov1,
          cardID: 8,
          isUsed: false,
        },
        {
          type: Movement.mov2,
          cardID: 9,
          isUsed: false,
        },
      ],
    },
    {
      position: 1,
      username: 'Player 4',
      playerID: 4,
      isActive: true,
      sizeDeckFigure: 3,
      cardsFigure: [
        {
          type: Figure.fig06,
          cardID: 12,
          isBlocked: true,
        },
      ],
      cardsMovement: [
        {
          type: Movement.mov3,
          cardID: 10,
          isUsed: false,
        },
        {
          type: Movement.mov4,
          cardID: 11,
          isUsed: false,
        },
        {
          type: Movement.mov5,
          cardID: 12,
          isUsed: false,
        },
      ],
    },
  ],
};

export const BOARD_EXTENDED = Array.from({ length: 36 }, (_, i) => ({
  posX: i % 6,
  posY: Math.floor(i / 6),
  color:
    i % 4 === 0
      ? Color.R
      : i % 4 === 1
        ? Color.B
        : i % 4 === 2
          ? Color.G
          : Color.Y,
  isPartial: false,
  isHighlighted: false,
  markTopBorder: false,
  markRightBorder: false,
  markBottomBorder: false,
  markLeftBorder: false,
}));

export const CARD_FIGURE_VALID = {
  type: Figure.fig01,
  cardID: 1,
  isBlocked: false,
};

export const CARD_FIGURE_BLOCKED = {
  type: Figure.fig03,
  cardID: 3,
  isBlocked: true,
};

export const CARD_MOVEMENT_VALID = {
  type: Movement.mov1,
  cardID: 1,
  isUsed: false,
};

export const CARD_MOVEMENT_USED = {
  type: Movement.mov3,
  cardID: 3,
  isUsed: true,
};
