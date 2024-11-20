import {
  Game,
  MovementCard,
  FigureCard,
  Movement,
  CoordsTile,
  isMovementCard,
  Color,
} from '../types/gameTypes';

const checkCoords = (
  coords: CoordsTile,
  coordsSelected: CoordsTile,
  offsets: [number, number][]
) => {
  return offsets.some(
    ([offsetX, offsetY]) =>
      coords.posX === coordsSelected.posX + offsetX &&
      coords.posY === coordsSelected.posY + offsetY
  );
};

const movementChecks: Record<
  Movement,
  (coords: CoordsTile, coordsSelected: CoordsTile) => boolean
> = {
  [Movement.mov1]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [2, 2],
      [-2, -2],
      [2, -2],
      [-2, 2],
    ]),
  [Movement.mov2]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [2, 0],
      [-2, 0],
      [0, -2],
      [0, 2],
    ]),
  [Movement.mov3]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1],
    ]),
  [Movement.mov4]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ]),
  [Movement.mov5]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [-2, 1],
      [1, 2],
      [2, -1],
      [-1, -2],
    ]),
  [Movement.mov6]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [-1, 2],
      [-2, -1],
      [1, -2],
      [2, 1],
    ]),
  [Movement.mov7]: (coords, coordsSelected) => {
    if (
      coordsSelected.posX === coords.posX &&
      coordsSelected.posY === coords.posY
    ) {
      return false;
    }
    return (
      (coords.posX === coordsSelected.posX &&
        (coords.posY === 5 || coords.posY === 0)) ||
      (coords.posY === coordsSelected.posY &&
        (coords.posX === 0 || coords.posX === 5))
    );
  },
};

export const isHighlighted = (
  coords: CoordsTile,
  coordsSelected: CoordsTile,
  card: MovementCard | FigureCard | undefined
) => {
  if (!card || !isMovementCard(card)) {
    return false;
  }
  return movementChecks[card.type](coords, coordsSelected);
};

const isBorderFigure = (
  coords: CoordsTile,
  figures: CoordsTile[][],
  tileColor: Color,
  bannedColor: Color | undefined
) => {
  const res = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    bg: false,
  };
  figures.forEach((figure) => {
    if (
      figure.some(
        (tile) => tile.posX === coords.posX && tile.posY === coords.posY
      )
    ) {
      res.top = true;
      res.right = true;
      res.bottom = true;
      res.left = true;
      res.bg = true;
      if (
        figure.some(
          (tile) => tile.posX === coords.posX && tile.posY === coords.posY + 1
        )
      ) {
        res.right = false;
      }
      if (
        figure.some(
          (tile) => tile.posX === coords.posX && tile.posY === coords.posY - 1
        )
      ) {
        res.left = false;
      }
      if (
        figure.some(
          (tile) => tile.posX === coords.posX + 1 && tile.posY === coords.posY
        )
      ) {
        res.bottom = false;
      }
      if (
        figure.some(
          (tile) => tile.posX === coords.posX - 1 && tile.posY === coords.posY
        )
      ) {
        res.top = false;
      }
    }
  });
  if (bannedColor === tileColor) {
    res.bg = false;
    res.top = false;
    res.bottom = false;
    res.left = false;
    res.right = false;
  }
  return res;
};

export const getExtendedBoard = (
  game: Game | undefined,
  selectedTile: CoordsTile | undefined,
  selectedCard: MovementCard | FigureCard | undefined
) => {
  if (!game) {
    return [];
  }
  return game.board.map((tile) => {
    const isHighlightedTile = isHighlighted(
      { posX: tile.posX, posY: tile.posY },
      { posX: selectedTile?.posX, posY: selectedTile?.posY } as CoordsTile,
      selectedCard
    );
    const { top, right, bottom, left, bg } = isBorderFigure(
      { posX: tile.posX, posY: tile.posY },
      game.figuresToUse,
      tile.color,
      game.prohibitedColor
    );

    return {
      ...tile,
      isHighlighted: isHighlightedTile,
      markTopBorder: top,
      markRightBorder: right,
      markBottomBorder: bottom,
      markLeftBorder: left,
      markBackground: bg,
    };
  });
};
