import { useEffect, useRef } from 'react';
import { GameMessage } from '../types/gameTypes';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { sendToast } from '../services/utils';
import { useRoomListStore } from '../stores/roomListStore';

export function useGameWebSocket(gameID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setGame = useGameStore((state) => state.setGame);
  const deleteGame = useGameStore((state) => state.deleteGame);
  const unselectCard = useGameStore((state) => state.unselectCard);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const addChatMessage = useGameStore((state) => state.addChatMessage);
  const setRoomMessage = useRoomListStore((state) => state.setRoomMessage);
  const cleanChat = useGameStore((state) => state.cleanChat);
  const webSocketUrl = `ws://localhost:8000/games/${playerID.toString()}/${gameID.toString()}`;
  const navigate = useNavigate();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as GameMessage;
      if (message.type === 'status') {
        setGame(message.payload);
        unselectCard();
        unselectTile();
      }

      if (message.type === 'end') {
        navigate('/');
        cleanChat();
        setRoomMessage(message.payload.username);
        deleteGame();
      }
      if (message.type === 'msg') {
        addChatMessage(message.payload);
      }
    };

    socket.onclose = (e) => {
      if (e.code === 4004) {
        sendToast(
          'No se pudo conectar a la partida',
          'Partida no encontrada',
          'error'
        );
        navigate('/');
        cleanChat();
      } else if (e.code === 4005) {
        sendToast(
          'Conexión iniciada en otro dispositivo',
          'Solo puedes tener una conexión por partida a la vez',
          'warning'
        );
        navigate('/');
        cleanChat();
      } else if (e.code === 4003) {
        sendToast('No se pudo conectar a la partida', e.reason, 'error');
        navigate('/');
        cleanChat();
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

  const sendMessage = (message: GameMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return sendMessage;
}
