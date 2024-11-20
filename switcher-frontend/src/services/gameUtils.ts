import {
  PlayerInGame,
  Game,
  MovementCard,
  FigureCard,
  isFigureCard,
  isMovementCard,
} from '../types/gameTypes';
import { Player } from '../types/playerTypes';

interface PlayerPositions {
  top: PlayerInGame | undefined;
  right: PlayerInGame | undefined;
  left: PlayerInGame | undefined;
}

export const getPlayersPositions = (
  players: PlayerInGame[] | undefined,
  currentPosition: number
) => {
  const res: PlayerPositions = {
    top: undefined,
    right: undefined,
    left: undefined,
  };
  if (!players) return res;

  const sortedPlayers = players.sort((a, b) => a.position - b.position);
  const len = sortedPlayers.length;

  switch (len) {
    case 1:
      res.top = sortedPlayers[0];
      break;
    case 2:
      res.right = sortedPlayers[0];
      res.left = sortedPlayers[1];
      if (currentPosition === 2) {
        [res.right, res.left] = [res.left, res.right];
      }
      break;
    default: {
      const positions = [
        { pos: 1, right: 0, top: 1, left: 2 },
        { pos: 2, right: 1, top: 2, left: 0 },
        { pos: 3, right: 2, top: 0, left: 1 },
        { pos: 4, right: 0, top: 1, left: 2 },
      ];
      const posConfig = positions.find((p) => p.pos === currentPosition);
      if (posConfig) {
        res.right = sortedPlayers[posConfig.right];
        res.top = sortedPlayers[posConfig.top];
        res.left = sortedPlayers[posConfig.left];
      }
      break;
    }
  }
  return res;
};

export function getPlayerInGame(
  player: Player,
  game: Game
): PlayerInGame | undefined {
  return game.players.find(
    (playerInGame) => playerInGame.playerID === player.playerID
  );
}

export function areCardsEqual(
  card1: MovementCard | FigureCard | undefined,
  card2: MovementCard | FigureCard | undefined
) {
  if (!card1 || !card2) return false;
  if (isMovementCard(card1) && isMovementCard(card2)) {
    return card1.cardID === card2.cardID;
  }
  if (isFigureCard(card1) && isFigureCard(card2)) {
    return card1.cardID === card2.cardID;
  }
  return false;
}
