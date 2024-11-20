import { useEffect, useRef } from 'react';
import { RoomListStatusMessage } from '../types/roomTypes';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomListStore } from '../stores/roomListStore';
import { useNavigate } from 'react-router-dom';

export const useRoomListWebSocket = () => {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const deletePlayer = usePlayerStore((state) => state.deletePlayer);
  const selectedRoomID = useRoomListStore((state) => state.selectedRoomID);
  const refSelectedRoomID = useRef(selectedRoomID);
  refSelectedRoomID.current = selectedRoomID;
  const deselectRoomID = useRoomListStore((state) => state.deselectRoomID);
  const setRoomList = useRoomListStore((state) => state.setRoomList);
  const webSocketUrl = `ws://localhost:8000/rooms/${playerID.toString()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as RoomListStatusMessage;
      if (message.type === 'status') {
        setRoomList(message.payload);
        // Si la sala seleccionada ya no está disponible, deseleccionarla
        const selectedRoom = message.payload.find(
          (room) => room.roomID === refSelectedRoomID.current
        );
        if (
          !selectedRoom ||
          selectedRoom.started ||
          selectedRoom.actualPlayers >= selectedRoom.maxPlayers
        ) {
          deselectRoomID();
        }
      }
    };

    socket.onclose = (e) => {
      if (e.code === 4004) {
        deletePlayer();
        navigate('/signup');
      }
    };

    return () => {
      switch (socket.readyState) {
        case WebSocket.CONNECTING:
          socket.close();
          break;
        case WebSocket.OPEN:
          socket.close();
          break;
        default:
          break;
      }
    };
  }, []);
};
