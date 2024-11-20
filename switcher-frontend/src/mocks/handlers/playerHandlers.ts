import { http, HttpResponse } from "msw";
import { CreatePlayerRequest, Player } from "../../types/playerTypes";
import { ErrorType } from "../../api/types";

export default function handlers(baseUri: string) {
  return [
    http.post<never, CreatePlayerRequest, Player | ErrorType, string>(
      `${baseUri}players`,
      async ({ request }) => {
        const data = await request.json();
        const username = data.username;
        if (username === "error") {
          return HttpResponse.json(
            {
              detail: [
                {
                  type: "ValidationError",
                  msg: "Ejemplo de error en el backend",
                  input: username,
                },
              ],
            },
            {
              status: 422,
            }
          );
        }
        return HttpResponse.json(
          {
            playerID: Math.floor(Math.random() * 100),
            username: data.username,
          },
          {
            status: 201,
          }
        );
      }
    ),
  ];
}
