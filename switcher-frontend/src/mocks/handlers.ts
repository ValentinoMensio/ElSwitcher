import playerHandlers from "./handlers/playerHandlers";
import roomHandlers from "./handlers/roomHandlers";
import gameHandlers from "./handlers/gameHandlers";

const baseUri = "http://localhost:8000/";

export const handlers = [
    ...playerHandlers(baseUri),
    ...roomHandlers(baseUri),
    ...gameHandlers(baseUri)
]

