import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useGameStore } from '../stores/gameStore';
import {
  startGame as startGameEndpoint,
  turn as turnEndpoint,
  leaveGame as leaveGameEndpoint,
  cancelMove as cancelMoveEndpoint,
} from '../api/gameEndpoints';

import { handleNotificationResponse, sendToast } from '../services/utils';
import { useNavigate } from 'react-router-dom';
import {
  areCardsEqual,
  getPlayerInGame,
  getPlayersPositions,
} from '../services/gameUtils';
import {
  MovementCard,
  FigureCard,
  isFigureCard,
  isMovementCard,
} from '../types/gameTypes';
import {
  validatePlayerInGame,
  validatePlayerTurn,
  validatePlayerOwnerRoom,
} from '../services/validation/validators';

export const useGame = () => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const selectedCard = useGameStore((state) => state.selectedCard);
  const turnTimestamp = useGameStore((state) => state.game?.timer ?? 0);
  const selectCard = useGameStore((state) => state.selectCard);
  const unselectCard = useGameStore((state) => state.unselectCard);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const chatMessages = useGameStore((state) => state.chat);
  const navigate = useNavigate();
  const cleanChat = useGameStore((state) => state.cleanChat);

  const currentPlayer =
    player && game ? getPlayerInGame(player, game) : undefined;

  const handleClickCard = (card: MovementCard | FigureCard) => {
    if (!validatePlayerTurn(player, game)) return;

    if (isMovementCard(card) && card.isUsed) {
      sendToast('La carta ya ha sido utilizada', null, 'warning');
      return;
    }

    if (isFigureCard(card) && card.isBlocked) {
      sendToast('La carta está bloqueada', null, 'warning');
      return;
    }

    const isCardInPlayerHand = currentPlayer?.cardsFigure.some((cardInHand) =>
      areCardsEqual(cardInHand, card)
    );

    const cardOwner = game?.players.find((playerInGame) =>
      playerInGame.cardsFigure.some((cardInHand) =>
        areCardsEqual(cardInHand, card)
      )
    );

    const ownerHasBlockedCard = cardOwner?.cardsFigure.some(
      (cardInHand) => cardInHand.isBlocked
    );

    if (
      !isCardInPlayerHand &&
      isFigureCard(card) &&
      cardOwner!.cardsFigure.length < 3
    ) {
      sendToast('El jugador tiene menos de 3 cartas', null, 'warning');
      return;
    }

    if (!isCardInPlayerHand && isFigureCard(card) && ownerHasBlockedCard) {
      sendToast('El jugador ya tiene una carta bloqueada', null, 'warning');
      return;
    }

    unselectTile();
    if (areCardsEqual(selectedCard, card)) {
      unselectCard();
      return;
    }
    selectCard(card);
  };

  const otherPlayersUnordered = game?.players.filter(
    (playerInGame) => playerInGame.playerID !== player?.playerID
  );

  const otherPlayersInPos = getPlayersPositions(
    otherPlayersUnordered,
    currentPlayer?.position ?? -1
  );

  const posEnabledToPlay = game?.posEnabledToPlay;

  const prohibitedColor = game?.prohibitedColor;

  const startGame = async () => {
    if (!validatePlayerOwnerRoom(player, room)) return;

    const data = await startGameEndpoint(room!.roomID, {
      playerID: player!.playerID,
    });
    handleNotificationResponse(
      data,
      'Partida iniciada con éxito',
      'Error al intentar iniciar la partida',
      () => null
    );
  };

  const endTurn = async () => {
    if (!validatePlayerTurn(player, game)) return;

    const data = await turnEndpoint(game!.gameID, {
      playerID: player!.playerID,
    });

    handleNotificationResponse(
      data,
      'Turno pasado con éxito',
      'Error al intentar pasar el turno',
      () => {
        unselectCard();
        unselectTile();
      }
    );
  };

  const cancelMove = async () => {
    if (!validatePlayerTurn(player, game)) return;

    if (
      !currentPlayer?.cardsMovement.map((card) => card?.isUsed).includes(true)
    ) {
      sendToast('No hay movimientos para cancelar', null, 'warning');
      return;
    }

    const data = await cancelMoveEndpoint(game!.gameID, {
      playerID: player!.playerID,
    });
    handleNotificationResponse(
      data,
      'Movimiento cancelado con éxito',
      'Error al intentar cancelar movimiento',
      () => null
    );
  };

  const leaveGame = async () => {
    if (!validatePlayerInGame(player, game)) return;

    const data = await leaveGameEndpoint(game!.gameID, {
      playerID: player!.playerID,
    });

    handleNotificationResponse(
      data,
      'Abandonado la partida con éxito',
      'Error al intentar abandonar la partida',
      () => {
        navigate('/');
        cleanChat();
      }
    );
  };

  return {
    otherPlayersInPos,
    currentPlayer,
    posEnabledToPlay,
    selectedCard,
    prohibitedColor,
    turnTimestamp,
    startGame,
    endTurn,
    cancelMove,
    leaveGame,
    handleClickCard,
    chatMessages,
  };
};
