import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import {
  joinRoom as joinRoomEndpoint,
  leaveRoom as leaveRoomEndpoint,
  createRoom as createRoomEndpoint,
} from '../api/roomEndpoints';
import { handleNotificationResponse, sendToast } from '../services/utils';
import { useNavigate } from 'react-router-dom';
import { useRoomListStore } from '../stores/roomListStore';
import {
  validatePlayerInRoom,
  validatePlayerLoaded,
} from '../services/validation/validators';

export const useRoom = () => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const selectedRoomID = useRoomListStore((state) => state.selectedRoomID);
  const roomList = useRoomListStore((state) => state.roomList);
  const openPasswordModal = useRoomListStore(
    (state) => state.openPasswordModal
  );
  const closePasswordModal = useRoomListStore(
    (state) => state.closePasswordModal
  );

  const navigate = useNavigate();

  const joinRoom = async (password?: string) => {
    if (!validatePlayerLoaded(player)) return;
    if (!selectedRoomID) {
      sendToast('La información de la sala no es válida', null, 'error');
      return;
    }

    if (
      roomList
        ?.find((room) => room.roomID === selectedRoomID)
        ?.playersID.includes(player.playerID)
    ) {
      if (roomList.find((room) => room.roomID === selectedRoomID)?.started) {
        navigate(`/game/${selectedRoomID.toString()}`);
      } else {
        navigate(`/room/${selectedRoomID.toString()}`);
      }
      return;
    }

    if (
      roomList?.find((room) => room.roomID === selectedRoomID)?.private &&
      !password
    ) {
      openPasswordModal();
      return;
    }

    const data = await joinRoomEndpoint(
      selectedRoomID,
      {
        playerID: player.playerID,
      },
      password
    );

    handleNotificationResponse(
      data,
      'Te has unido a la sala con éxito',
      'Error al intentar unirse a la sala',
      () => {
        navigate(`/room/${selectedRoomID.toString()}`);
        closePasswordModal();
      }
    );
  };

  const leaveRoom = async () => {
    if (!validatePlayerInRoom(player, room)) return;
    const data = await leaveRoomEndpoint(room!.roomID, {
      playerID: player!.playerID,
    });

    handleNotificationResponse(
      data,
      'Has salido de la sala con éxito',
      'Error al intentar salir de la sala',
      () => {
        navigate('/');
      }
    );
  };

  const createRoom = async (
    roomName: string,
    maxPlayers: number,
    minPlayers: number,
    password?: string
  ) => {
    if (!validatePlayerLoaded(player)) return;

    const data = await createRoomEndpoint({
      playerID: player.playerID,
      roomName,
      minPlayers,
      maxPlayers,
      password,
    });
    handleNotificationResponse(
      data,
      'Sala creada con éxito',
      'Error al crear la sala',
      () => {
        const dataRoomID = data as { roomID: number };
        navigate(`/room/${dataRoomID.roomID.toString()}`);
      }
    );
  };

  return {
    room,
    joinRoom,
    leaveRoom,
    createRoom,
  };
};
