import { useParams } from 'react-router-dom';
import { VStack, HStack, Center, Button, Tooltip } from '@chakra-ui/react';
import { useRoom } from '../hooks/useRoom';
import RoomData from '../components/room/roomData';
import { useRoomWebSocket } from '../hooks/useRoomWebSocket';
import { useGame } from '../hooks/useGame';
import { usePlayer } from '../hooks/usePlayer';

export default function Room() {
  const { ID } = useParams();
  const { player } = usePlayer();
  const { room, leaveRoom } = useRoom();
  const { startGame } = useGame();

  useRoomWebSocket(parseInt(ID ?? ''));

  return (
    <>
      <Center h="100vh">
        <VStack>
          <RoomData room={room} />
          {room && (
            <HStack justifyContent="space-between" mt={4} spacing={4}>
              <Button colorScheme="red" onClick={() => leaveRoom()}>
                {room.hostID !== player?.playerID
                  ? 'Abandonar sala'
                  : 'Cerrar sala'}
              </Button>
              {room.hostID === player?.playerID && (
                <>
                  {room.players.length >= room.minPlayers ? (
                    <Button colorScheme="teal" onClick={() => startGame()}>
                      Iniciar partida
                    </Button>
                  ) : (
                    <Tooltip label="Esperando a que se unan más jugadores">
                      <Button colorScheme="teal" isDisabled>
                        Iniciar partida
                      </Button>
                    </Tooltip>
                  )}
                </>
              )}
            </HStack>
          )}
        </VStack>
      </Center>
    </>
  );
}
