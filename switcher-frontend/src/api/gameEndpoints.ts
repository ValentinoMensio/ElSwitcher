import handleRequest from './httpClient';
import { PlayerID } from '../types/playerTypes';
import {
  PlayMovementCardRequest,
  PlayFigureCardRequest,
  BlockFigureCardRequest,
} from '../types/gameTypes';

export const startGame = async (roomID: number, playerID: PlayerID) => {
  return handleRequest('POST', playerID, `games/${roomID.toString()}`, 201);
};

export const turn = async (gameID: number, playerID: PlayerID) => {
  return handleRequest('PUT', playerID, `games/${gameID.toString()}/turn`, 200);
};

export const leaveGame = async (gameID: number, playerID: PlayerID) => {
  return handleRequest(
    'PUT',
    playerID,
    `games/${gameID.toString()}/leave`,
    200
  );
};

export const moveCard = async (
  gameID: number,
  data: PlayMovementCardRequest
) => {
  return handleRequest(
    'POST',
    data,
    `games/${gameID.toString()}/movement`,
    201
  );
};

export const playFigure = async (
  gameID: number,
  data: PlayFigureCardRequest
) => {
  return handleRequest('POST', data, `games/${gameID.toString()}/figure`, 201);
};

export const cancelMove = async (gameID: number, playerID: PlayerID) => {
  return handleRequest(
    'DELETE',
    playerID,
    `games/${gameID.toString()}/movement?playerID=${playerID.playerID.toString()}`,
    200
  );
};

export const blockFigure = async (
  gameID: number,
  data: BlockFigureCardRequest
) => {
  return handleRequest('PUT', data, `games/${gameID.toString()}/block`, 201);
};
