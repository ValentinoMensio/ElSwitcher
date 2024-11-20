import { create } from 'zustand';
import {
  Game,
  MovementCard,
  FigureCard,
  ChatMessage,
} from '../types/gameTypes';

interface GameState {
  game: Game | undefined;
  chat: ChatMessage[];
  selectedTile: { posX: number; posY: number } | undefined;
  selectedCard: MovementCard | FigureCard | undefined;
  setGame: (game: Game) => void;
  deleteGame: () => void;
  addChatMessage: (message: ChatMessage) => void;
  cleanChat: () => void;
  selectTile: (posX: number, posY: number) => void;
  unselectTile: () => void;
  selectCard: (card: MovementCard | FigureCard) => void;
  unselectCard: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: undefined,
  chat: [],
  selectedTile: undefined,
  selectedCard: undefined,
  setGame: (game: Game) => {
    set({ game });
  },
  deleteGame: () => {
    set({ game: undefined });
  },
  addChatMessage: (message: ChatMessage) => {
    set((state) => ({ chat: [...state.chat, message] }));
  },
  cleanChat: () => {
    set({ chat: [] });
  },
  selectTile: (posX, posY) => {
    set({ selectedTile: { posX, posY } });
  },
  unselectTile: () => {
    set({ selectedTile: undefined });
  },
  selectCard: (card) => {
    set({ selectedCard: card });
  },
  unselectCard: () => {
    set({ selectedCard: undefined });
  },
}));
