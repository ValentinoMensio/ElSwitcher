import { useEffect } from 'react';
import { RoomMessage } from '../types/roomTypes';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useNavigate } from 'react-router-dom';
import { sendToast } from '../services/utils';

export function useRoomWebSocket(roomID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setRoom = useRoomStore((state) => state.setRoom);
  const deleteRoom = useRoomStore((state) => state.deleteRoom);
  const webSocketUrl = `ws://localhost:8000/rooms/${playerID.toString()}/${roomID.toString()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as RoomMessage;

      switch (message.type) {
        case 'status':
          setRoom(message.payload);
          break;
        case 'start':
          navigate(`/game/${message.payload.gameID.toString()}`);
          break;
        case 'end':
          navigate('/');
          deleteRoom();
          sendToast(
            'Sala cerrada',
            'La sala ha sido cerrada por el creador',
            'info'
          );
          break;
      }
    };

    socket.onclose = (e) => {
      if (e.code === 4004) {
        sendToast(
          'No se pudo conectar a la sala',
          'Sala no encontrada',
          'error'
        );
        navigate('/');
      } else if (e.code === 4005) {
        console.log(e.reason);
        sendToast(
          'Conexión iniciada en otro dispositivo',
          'Solo puedes tener una conexión a la vez',
          'warning'
        );
        navigate('/');
      } else if (e.code === 4003) {
        sendToast('No se pudo conectar a la sala', e.reason, 'error');
        navigate('/');
      } else if (e.code === 4007) {
        navigate(`/game/${roomID.toString()}`);
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
}
