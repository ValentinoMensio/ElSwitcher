enum Color {
  R = 'R',
  G = 'G',
  B = 'B',
  Y = 'Y',
}

enum Movement {
  mov1 = 'mov01',
  mov2 = 'mov02',
  mov3 = 'mov03',
  mov4 = 'mov04',
  mov5 = 'mov05',
  mov6 = 'mov06',
  mov7 = 'mov07',
}

enum Figure {
  fig01 = 'fig01',
  fig02 = 'fig02',
  fig03 = 'fig03',
  fig04 = 'fig04',
  fig05 = 'fig05',
  fig06 = 'fig06',
  fig07 = 'fig07',
  fig08 = 'fig08',
  fig09 = 'fig09',
  fig10 = 'fig10',
  fig11 = 'fig11',
  fig12 = 'fig12',
  fig13 = 'fig13',
  fig14 = 'fig14',
  fig15 = 'fig15',
  fig16 = 'fig16',
  fig17 = 'fig17',
  fig18 = 'fig18',
  fige01 = 'fige01',
  fige02 = 'fige02',
  fige03 = 'fige03',
  fige04 = 'fige04',
  fige05 = 'fige05',
  fige06 = 'fige06',
  fige07 = 'fige07',
}

interface Tile {
  posX: number;
  posY: number;
  color: Color;
  isPartial: boolean; // Si la ficha se movió en el turno
}

// Los tipos locales tienen información que no es necesario mandar al servidor
interface ExtendedTile extends Tile {
  isHighlighted: boolean;
  markTopBorder: boolean;
  markRightBorder: boolean;
  markBottomBorder: boolean;
  markLeftBorder: boolean;
  markBackground: boolean;
}

interface CoordsTile {
  posX: number;
  posY: number;
}

interface MovementCard {
  type: Movement;
  cardID: number;
  isUsed: boolean; // Usada en el turno actual
}

interface FigureCard {
  type: Figure;
  cardID: number;
  isBlocked: boolean;
}

function isMovementCard(card: MovementCard | FigureCard): card is MovementCard {
  return 'isUsed' in card;
}

function isFigureCard(card: MovementCard | FigureCard): card is FigureCard {
  return 'isBlocked' in card;
}

interface PlayerInGame {
  position: number; // Posición en los turnos
  username: string;
  playerID: number;
  isActive: boolean; // Si abandonó la partida o no
  sizeDeckFigure: number; // Tamaño de la pila de figuras
  cardsFigure: FigureCard[];
  cardsMovement: (MovementCard | null)[];
}

interface Game {
  gameID: number;
  board: Tile[];
  figuresToUse: CoordsTile[][]; // Figuras formadas, es una lista de figuras, donde cada figura es una lista de posiciones
  prohibitedColor: Color | undefined;
  posEnabledToPlay: number; // Turno
  players: PlayerInGame[];
  timer: number; // Segundos restantes para el próximo turno
}

interface GameID {
  gameID: number;
}

interface PlayMovementCardRequest {
  playerID: number;
  cardID: number;
  origin: { posX: number; posY: number };
  destination: { posX: number; posY: number };
}

interface PlayFigureCardRequest {
  playerID: number;
  cardID: number;
  figure: { posX: number; posY: number }[];
}

interface BlockFigureCardRequest {
  cardID: number;
  playerID: number;
  targetID: number;
  figure: { posX: number; posY: number }[];
}

interface GameStatusMessage {
  type: 'status';
  payload: Game;
}

interface GameEndMessage {
  type: 'end';
  payload: {
    winnerID: number;
    username: string;
  };
}

interface ChatMessage {
  username: string;
  text: string;
}

interface GameChatMessage {
  type: 'msg';
  payload: ChatMessage;
}

type GameMessage = GameStatusMessage | GameEndMessage | GameChatMessage;

export type {
  Game,
  GameID,
  PlayMovementCardRequest,
  PlayFigureCardRequest,
  BlockFigureCardRequest,
  GameMessage,
  Tile,
  ExtendedTile,
  CoordsTile,
  MovementCard,
  FigureCard,
  PlayerInGame,
  ChatMessage,
};
export { Color, Movement, Figure, isMovementCard, isFigureCard };
export default Game;
