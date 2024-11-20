import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoomList } from './useRoomList';
import { usePlayerStore } from '../stores/playerStore';
import * as utils from '../services/utils';
import { useRoomListStore } from '../stores/roomListStore';
import { server } from '../mocks/node';

describe('useRoomList', () => {
  const ROOMS = [
    {
      roomID: 1,
      roomName: 'Sala 1',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
      playersID: [1000, 1001],
    },
    {
      roomID: 2,
      roomName: 'Sala 2',
      maxPlayers: 4,
      actualPlayers: 3,
      started: false,
      private: true,
      playersID: [1000, 1001, 1002],
    },
    {
      roomID: 3,
      roomName: 'Somebody once told me',
      maxPlayers: 2,
      actualPlayers: 2,
      started: false,
      private: false,
      playersID: [1000, 1001],
    },
    {
      roomID: 4,
      roomName: 'the world is gonna roll me',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
      playersID: [1000, 1001],
    },
    {
      roomID: 5,
      roomName: '.',
      maxPlayers: 4,
      actualPlayers: 3,
      started: false,
      private: true,
      playersID: [1000, 1001, 1002],
    },
    {
      roomID: 6,
      roomName: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,
      playersID: [1000, 1001],
    },
    {
      roomID: 7,
      roomName: 'SALA EMPEZADA',
      maxPlayers: 4,
      actualPlayers: 2,
      started: true,
      private: false,
      playersID: [1000, 1001],
    },
    {
      roomID: 8,
      roomName: 'Sala llena',
      maxPlayers: 4,
      actualPlayers: 4,
      started: false,
      private: false,
      playersID: [1000, 1001, 1002, 1003],
    },
    {
      roomID: 9,
      roomName: 'OwO',
      maxPlayers: 3,
      actualPlayers: 2,
      started: false,
      private: false,
      playersID: [1000, 1001],
    },
  ];

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useRoomListStore.setState({ selectedRoomID: undefined });
    useRoomListStore.setState({ roomList: undefined });
  });

  it('Me devuelve una lista de salas undefined por defecto', () => {
    const { result } = renderHook(() => useRoomList());
    expect(result.current.roomList).toBeUndefined();
  });

  it('Me devuelve una sala seleccionada undefined por defecto', () => {
    const { result } = renderHook(() => useRoomList());
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it('Puedo seleccionar una sala al existir salas', () => {
    useRoomListStore.setState({ roomList: ROOMS });
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1);
    });
    expect(result.current.selectedRoomID).toBe(1);
  });

  it('No puedo seleccionar una sala que no existe', () => {
    useRoomListStore.setState({ roomList: ROOMS });
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(15);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it('No puedo seleccionar una sala que esta llena', () => {
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(8);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it('No puedo seleccionar una sala que ya empezó', () => {
    useRoomListStore.setState({ roomList: ROOMS });
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(7);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it('Al seleccionar una sala llena, muestra un toast de warning', () => {
    const sendToast = vi.spyOn(utils, 'sendToast');
    useRoomListStore.setState({ roomList: ROOMS });
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(8);
    });
    expect(sendToast).toHaveBeenCalledWith(
      'La sala está llena',
      'No puedes unirte a una que ya alcanzó su límite de jugadores',
      'warning'
    );
  });

  it('Al seleccionar una sala, si ya estaba seleccionada, la deselecciona', () => {
    useRoomListStore.setState({ roomList: ROOMS });
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1);
    });
    expect(result.current.selectedRoomID).toBe(1);
    act(() => {
      result.current.handleSelectRoomID(1);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });
});
