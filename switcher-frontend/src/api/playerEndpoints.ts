import handleRequest from "./httpClient";
import { CreatePlayerRequest, Player } from "../types/playerTypes";

export const createPlayer = async (data: CreatePlayerRequest) => {
  return handleRequest<Player>("POST", data, "players", 201);
};
