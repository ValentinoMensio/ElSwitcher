import { http, HttpResponse } from "msw";
import { CreateRoomRequest, RoomDetails, RoomID } from "../../types/roomTypes";
import { ErrorType } from "../../api/types";
import { ROOMS } from "../../mocks/data/roomData";
import { PlayerID } from "../../types/playerTypes";

interface RoomIDPath {
  roomID: string;
}

export default function handlers(baseUri: string) {
  return [
    http.post<never, CreateRoomRequest, RoomID | ErrorType, string>(
      `${baseUri}rooms`,
      async ({ request }) => {
        const data = await request.json();
        const roomName = data.roomName;
        if (roomName === "error") {
          return HttpResponse.json(
            {
              detail: [
                {
                  type: "ValidationError",
                  msg: "Ejemplo de error en el backend",
                  input: roomName,
                },
              ],
            },
            {
              status: 400,
            }
          );
        }
        return HttpResponse.json(
          { roomID: Math.floor(Math.random() * 100) },
          {
            status: 201,
          }
        );
      }
    ),

    http.get<never, never, RoomDetails[] | ErrorType, string>(
      `${baseUri}rooms`,
      () => {
        const mockResponse = ROOMS;
        return HttpResponse.json(mockResponse, {
          status: 200,
        });
      }
    ),

    http.put<RoomIDPath, PlayerID, null | ErrorType, string>(
      `${baseUri}rooms/:roomID/leave`,
      ({ params }) => {
        const { roomID } = params;
        const roomIndex = ROOMS.findIndex(
          (room) => room.roomID === parseInt(roomID)
        );
        if (roomIndex === -1) {
          return HttpResponse.json(
            {
              detail: "No existe sala con ese ID",
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(null, {
          status: 200,
        });
      }
    ),

    http.put<RoomIDPath, PlayerID, RoomDetails | ErrorType, string>(
      `${baseUri}rooms/:roomID/join`,
      ({ params }) => {
        const { roomID } = params;
        const roomIndex = ROOMS.findIndex(
          (room) => room.roomID === parseInt(roomID)
        );
        if (roomIndex === -1) {
          return HttpResponse.json(
            {
              detail: "No existe sala con ese ID",
            },
            {
              status: 404,
            }
          );
        }
        if (ROOMS[roomIndex].actualPlayers === ROOMS[roomIndex].maxPlayers) {
          return HttpResponse.json(
            {
              detail: "La sala está llena",
            },
            {
              status: 403,
            }
          );
        }
        return HttpResponse.json(ROOMS[roomIndex], {
          status: 200,
        });
      }
    ),
  ];
}
