import { create } from "zustand";
import Room from "../types/roomTypes";

interface RoomState {
  room: Room | undefined;
  setRoom: (room: Room) => void;
  deleteRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  room: undefined,
  setRoom: (room: Room) => {
    set({ room });
  },
  deleteRoom: () => {
    set({ room: undefined });
  },
}));
