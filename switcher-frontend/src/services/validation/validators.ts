import { Player } from '../../types/playerTypes';
import { Game, PlayerInGame } from '../../types/gameTypes';
import { sendToast } from '../utils';
import { getPlayerInGame } from '../gameUtils';
import Room from '../../types/roomTypes';

export function validatePlayerLoaded(
  player: Player | undefined
): player is Player {
  if (!player) {
    sendToast(
      'No se ha podido cargar la información del jugador',
      null,
      'warning'
    );
    return false;
  }
  return true;
}

export function validateRoomLoaded(room: Room | undefined): room is Room {
  if (!room) {
    sendToast(
      'No se ha podido cargar la información de la sala',
      null,
      'warning'
    );
    return false;
  }
  return true;
}

export function validatePlayerInRoom(
  player: Player | undefined,
  room: Room | undefined
): boolean {
  if (!validateRoomLoaded(room) || !validatePlayerLoaded(player)) {
    return false;
  }
  const playerInRoom = room.players.find((p) => p.playerID === player.playerID);
  if (!playerInRoom) {
    sendToast(
      'No se ha podido cargar la información del jugador en la sala',
      null,
      'warning'
    );
    return false;
  }
  return true;
}

export function validatePlayerOwnerRoom(
  player: Player | undefined,
  room: Room | undefined
): boolean {
  if (!validatePlayerInRoom(player, room)) {
    return false;
  }
  if (room!.hostID !== player!.playerID) {
    sendToast(
      'Solo el creador de la sala puede realizar esta acción',
      null,
      'warning'
    );
    return false;
  }
  return true;
}

export function validateGameLoaded(game: Game | undefined): game is Game {
  if (!game) {
    sendToast(
      'No se ha podido cargar la información de la partida',
      null,
      'warning'
    );
    return false;
  }
  return true;
}

export function validatePlayerInGame(
  player: Player | undefined,
  game: Game | undefined
): PlayerInGame | false {
  if (!validateGameLoaded(game) || !validatePlayerLoaded(player)) {
    return false;
  }
  const playerInGame = getPlayerInGame(player, game);
  if (!playerInGame) {
    sendToast(
      'No se ha podido cargar la información del jugador en la partida',
      null,
      'warning'
    );
    return false;
  }
  return playerInGame;
}

export function validatePlayerTurn(
  player: Player | undefined,
  game: Game | undefined
): boolean {
  if (!validatePlayerInGame(player, game)) {
    return false;
  }
  const playerInGame = getPlayerInGame(player!, game!);
  if (game!.posEnabledToPlay !== playerInGame!.position) {
    sendToast('No es tu turno', null, 'warning');
    return false;
  }
  return true;
}
