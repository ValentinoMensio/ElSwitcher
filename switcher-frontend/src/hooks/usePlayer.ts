import { handleNotificationResponse } from "../services/utils";
import { usePlayerStore } from "../stores/playerStore";
import { createPlayer as createPlayerEndpoint } from "../api/playerEndpoints";
import Player from "../types/playerTypes";

export const usePlayer = () => {
  const { player, setPlayer } = usePlayerStore();

  const createPlayer = async (username: string) => {
    const data = await createPlayerEndpoint({ username });
    handleNotificationResponse(
      data,
      "Nombre seleccionado con éxito",
      "Error al seleccionar el nombre",
      () => {
        setPlayer(data as Player);
      }
    );
  };

  return { player, createPlayer };
};
