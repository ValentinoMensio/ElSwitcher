import Player from './playerTypes';

interface Room {
  roomID: number;
  hostID: number;
  roomName: string;
  maxPlayers: number;
  minPlayers: number;
  players: Player[];
}

interface RoomID {
  roomID: number;
}

interface RoomDetails {
  roomID: number;
  roomName: string;
  maxPlayers: number;
  actualPlayers: number;
  started: boolean;
  private: boolean;
  playersID: number[];
}

interface CreateRoomRequest {
  playerID: number;
  roomName: string;
  minPlayers: number;
  maxPlayers: number;
  password?: string;
}

interface RoomListStatusMessage {
  type: string;
  payload: RoomDetails[];
}

interface RoomStatusMessage {
  type: 'status';
  payload: Room;
}

interface GameStartMessage {
  type: 'start';
  payload: {
    gameID: number;
  };
}

interface RoomClosedMessage {
  type: 'end';
  payload: object;
}

type RoomMessage = RoomStatusMessage | GameStartMessage | RoomClosedMessage;

export type {
  Room,
  RoomID,
  RoomDetails,
  CreateRoomRequest,
  RoomListStatusMessage,
  RoomMessage,
};
export default Room;
