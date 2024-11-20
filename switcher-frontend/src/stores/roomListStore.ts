import { create } from 'zustand';
import { RoomDetails } from '../types/roomTypes';

interface RoomListState {
  roomList: RoomDetails[] | undefined;
  setRoomList: (roomList: RoomDetails[]) => void;
  selectedRoomID: number | undefined;
  selectRoomID: (roomID: number) => void;
  deselectRoomID: () => void;
  passwordModalOpen: boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  roomMessage: string | undefined;
  setRoomMessage: (message: string | undefined) => void;
}

export const useRoomListStore = create<RoomListState>((set) => ({
  roomList: undefined,
  setRoomList: (roomList: RoomDetails[] | undefined) => {
    set({ roomList });
  },
  selectedRoomID: undefined,
  selectRoomID: (roomID: number) => {
    set({ selectedRoomID: roomID });
  },
  deselectRoomID: () => {
    set({ selectedRoomID: undefined });
  },
  passwordModalOpen: false,
  openPasswordModal: () => {
    set({ passwordModalOpen: true });
  },
  closePasswordModal: () => {
    set({ passwordModalOpen: false });
  },
  roomMessage: undefined,
  setRoomMessage: (message: string | undefined) => {
    set({ roomMessage: message });
  },
}));
