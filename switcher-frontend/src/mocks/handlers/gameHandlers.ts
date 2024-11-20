import { http, HttpResponse } from 'msw';
import {
  GameID,
  PlayFigureCardRequest,
  PlayMovementCardRequest,
} from '../../types/gameTypes';
import { ErrorType } from '../../api/types';
import { PlayerID } from '../../types/playerTypes';

interface GameIDPath {
  gameID: string;
}

export default function handlers(baseUri: string) {
  return [
    http.post<GameIDPath, PlayerID, GameID | ErrorType, string>(
      `${baseUri}games/:gameID`,
      async ({ request, params }) => {
        const data = await request.json();
        const playerID = data.playerID;
        const { gameID } = params;
        if (playerID === -1) {
          return HttpResponse.json(
            {
              detail: 'El jugador no existe',
            },
            {
              status: 404,
            }
          );
        }
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(
          { gameID: Math.floor(Math.random() * 100) },
          {
            status: 201,
          }
        );
      }
    ),

    http.post<GameIDPath, PlayMovementCardRequest, null | ErrorType, string>(
      `${baseUri}games/:gameID/movement`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(null, {
          status: 201,
        });
      }
    ),

    http.post<GameIDPath, PlayFigureCardRequest, null | ErrorType, string>(
      `${baseUri}games/:gameID/figure`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(null, {
          status: 201,
        });
      }
    ),

    http.put<GameIDPath, PlayerID, null | ErrorType, string>(
      `${baseUri}games/:gameID/block`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(null, {
          status: 201,
        });
      }
    ),

    http.delete<GameIDPath, PlayerID, null | ErrorType, string>(
      `${baseUri}/games/:gameID/movement`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
            },
            {
              status: 404,
            }
          );
        }
        return HttpResponse.json(null, {
          status: 201,
        });
      }
    ),

    http.put<GameIDPath, PlayerID, null | ErrorType, string>(
      `${baseUri}games/:gameID/leave`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
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

    http.put<GameIDPath, PlayerID, null | ErrorType, string>(
      `${baseUri}games/:gameID/turn`,
      ({ params }) => {
        const { gameID } = params;
        if (parseInt(gameID) === -1) {
          return HttpResponse.json(
            {
              detail: 'El juego no existe',
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
  ];
}
