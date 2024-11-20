import {
  Tag,
  TagLabel,
  TagRightIcon,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  Card,
  Box,
  useColorMode,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { BiJoystick } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';

import { useRoomList } from '../../hooks/useRoomList';
import { useRoomListWebSocket } from '../../hooks/useRoomListWebSocket';
import { usePlayer } from '../../hooks/usePlayer';
import { useState } from 'react';

export default function RoomList() {
  const { roomList, selectedRoomID, handleSelectRoomID } = useRoomList();
  const { player } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [amountPlayers, setAmountPlayers] = useState<number | undefined>(
    undefined
  );
  const [sortOption, setSortOption] = useState('');

  const filteredRoomList = roomList
    ? roomList
        .filter((room) => !room.started)
        .filter((room) => !room.playersID.includes(player?.playerID ?? -1))
        .filter((room) =>
          room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((room) => {
          if (amountPlayers === undefined) return true;
          return room.actualPlayers === amountPlayers;
        })
        .sort((a, b) => {
          if (sortOption === 'name') {
            return a.roomName.localeCompare(b.roomName);
          } else if (sortOption === 'players') {
            return b.actualPlayers - a.actualPlayers;
          } else {
            return b.roomID - a.roomID;
          }
        })
    : undefined;

  const ownedRoomList = roomList
    ? roomList.filter((room) => room.playersID.includes(player?.playerID ?? -1))
    : undefined;

  const { colorMode } = useColorMode();
  const colorHover = colorMode === 'light' ? 'gray.300' : 'gray.600';
  const colorSelected = colorMode === 'light' ? 'teal.100' : 'teal.800';
  const colorBackground = colorMode === 'light' ? 'gray.200' : '#242C3A';

  useRoomListWebSocket();
  return (
    <HStack w="6xl" maxH="md" minH="xs" justifyContent="center" spacing={8}>
      <VStack
        w="2xl"
        maxH="md"
        minH="xs"
        py={2}
        px={3}
        overflowY="auto"
        overflowX="hidden"
        justifyContent="flex-start"
        borderRadius={16}
        bg={colorBackground}
      >
        <HStack w="100%" py={2} justifyContent="space-between">
          <Input
            variant="filled"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <NumberInput
            defaultValue={undefined}
            min={1}
            max={4}
            onChange={(valueString) => {
              setAmountPlayers(Number(valueString) || undefined);
            }}
            variant="filled"
          >
            <NumberInputField aria-label="Cantidad de jugadores" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            variant="filled"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
            }}
          >
            <option value="">-----</option>
            <option value="name">Ordenar por nombre</option>
            <option value="players">Ordenar por cantidad de jugadores</option>
          </Select>
        </HStack>
        {!filteredRoomList ? (
          <VStack>
            <Heading size="md" mb={2}>
              Cargando salas...
            </Heading>
            <Spinner emptyColor="gray.100" color="teal.500" size="xl" mb={8} />
          </VStack>
        ) : filteredRoomList.length === 0 ? (
          <Box>
            <Heading size="md">No hay salas disponibles</Heading>
          </Box>
        ) : (
          filteredRoomList.map((room) => (
            <Card
              key={room.roomID}
              w="100%"
              m={1}
              p={2}
              onClick={() => {
                handleSelectRoomID(room.roomID);
              }}
              _hover={{
                bg:
                  room.actualPlayers === room.maxPlayers
                    ? undefined
                    : colorHover,
              }}
              cursor={
                room.actualPlayers === room.maxPlayers
                  ? 'not-allowed'
                  : 'pointer'
              }
              bg={selectedRoomID === room.roomID ? colorSelected : undefined}
            >
              <HStack justifyContent="space-between" h="50px">
                <Heading size="md" w="50%" aria-label="Nombre de la sala">
                  {room.roomName}
                </Heading>
                <Text
                  as={room.actualPlayers === room.maxPlayers ? 's' : undefined}
                >
                  {room.actualPlayers}/{room.maxPlayers} jugadores
                </Text>
                {room.private ? (
                  <Tag size="sm" variant="outline" colorScheme="red">
                    <TagLabel>Privada</TagLabel>
                    <TagRightIcon as={LockIcon} />
                  </Tag>
                ) : (
                  <Tag size="sm" variant="outline" colorScheme="green">
                    <TagLabel>Pública</TagLabel>
                    <TagRightIcon as={UnlockIcon} />
                  </Tag>
                )}
              </HStack>
            </Card>
          ))
        )}
      </VStack>
      {ownedRoomList && ownedRoomList.length > 0 && (
        <VStack
          w="2xl"
          maxH="md"
          minH="xs"
          py={2}
          px={3}
          overflowY="auto"
          overflowX="hidden"
          justifyContent="flex-start"
          borderRadius={16}
          bg={colorBackground}
        >
          <Heading size="md">Tus salas/partidas</Heading>
          {ownedRoomList.map((room) => (
            <Card
              key={room.roomID}
              w="100%"
              m={1}
              p={2}
              onClick={() => {
                handleSelectRoomID(room.roomID);
              }}
              _hover={{
                bg: colorHover,
              }}
              cursor={'pointer'}
              bg={selectedRoomID === room.roomID ? colorSelected : undefined}
            >
              <HStack justifyContent="space-between" h="50px">
                <Heading size="md" w="50%" aria-label="Nombre de la sala">
                  {room.roomName}
                </Heading>
                <Text>
                  {room.actualPlayers}/{room.maxPlayers} jugadores
                </Text>
                {room.started ? (
                  <Tag size="sm" variant="outline" colorScheme="orange">
                    <TagLabel>Iniciado</TagLabel>
                    <TagRightIcon as={BiJoystick} />
                  </Tag>
                ) : (
                  <Tag size="sm" variant="outline" colorScheme="cyan">
                    <TagLabel>Sin iniciar</TagLabel>
                    <TagRightIcon as={FaPlay} />
                  </Tag>
                )}
              </HStack>
            </Card>
          ))}
        </VStack>
      )}
    </HStack>
  );
}
