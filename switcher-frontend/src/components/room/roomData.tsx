import {
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Room from "../../types/roomTypes";

interface RoomDataProps {
  room: Room | undefined;
}

export default function RoomData(props: RoomDataProps) {
  const { room } = props;
  return (
    <>
      <Skeleton isLoaded={!!room}>
        <Heading size="3xl" as="b">
          {room ? room.roomName : "Sala sin nombre"}
        </Heading>
      </Skeleton>
      <Skeleton isLoaded={!!room}>
        <Text fontSize="lg" as="i">
          Mínimo de jugadores: {room ? room.minPlayers : 0} - Máximo de
          jugadores: {room ? room.maxPlayers : 0}
        </Text>
      </Skeleton>

      <VStack p={2} w="lg">
        {room?.players.map((roomPlayer) => (
          <Card key={roomPlayer.playerID} w="100%" m={1} p={2}>
            <HStack>
              <Text fontSize="lg">{roomPlayer.username}</Text>
              {roomPlayer.playerID === room.hostID && (
                <Tooltip label="Creador de la sala">
                  <StarIcon color="yellow.500" />
                </Tooltip>
              )}
            </HStack>
          </Card>
        ))}
      </VStack>
    </>
  );
}
