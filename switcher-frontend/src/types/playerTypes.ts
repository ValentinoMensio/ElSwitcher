interface Player {
  playerID: number;
  username: string;
}

interface PlayerID {
  playerID: number;
}

interface CreatePlayerRequest {
  username: string;
}

export type { Player, PlayerID, CreatePlayerRequest};
export default Player;