import {Room, RoomDetails} from './roomTypes';

enum SocketMessageType {
    INFO = "info",
    STATUS_ROOM = "room",
    STATUS_ROOM_LIST = "room_list",
    STATUS_GAME = "game"
}

interface SocketMessageInfo {
    type: SocketMessageType.INFO;
    payload: string;
}

interface SocketMessageRoom {
    type: SocketMessageType.STATUS_ROOM;
    payload: Room;
}

interface SocketMessageRoomList {
    type: SocketMessageType.STATUS_ROOM_LIST;
    payload: RoomDetails[];
}

interface SocketMessageGame {
    type: SocketMessageType.STATUS_GAME;
    payload: undefined;
}

type SocketMessage = SocketMessageInfo | SocketMessageRoom | SocketMessageRoomList | SocketMessageGame;

export type { SocketMessage };
export { SocketMessageType };
