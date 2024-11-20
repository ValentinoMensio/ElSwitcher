import handleRequest from './httpClient';
import { CreateRoomRequest } from '../types/roomTypes';
import { PlayerID } from '../types/playerTypes';

export const createRoom = async (data: CreateRoomRequest) => {
  return handleRequest('POST', data, 'rooms', 201);
};

export const joinRoom = async (
  roomID: number,
  playerID: PlayerID,
  password?: string
) => {
  return handleRequest(
    'PUT',
    { playerID: playerID.playerID, password: password },
    `rooms/${roomID.toString()}/join`,
    200
  );
};

export const leaveRoom = async (roomID: number, playerID: PlayerID) => {
  return handleRequest(
    'PUT',
    playerID,
    `rooms/${roomID.toString()}/leave`,
    200
  );
};
