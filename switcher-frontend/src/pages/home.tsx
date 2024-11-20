import {
  IconButton,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FaArrowRightToBracket } from 'react-icons/fa6';

import RoomCreationForm from '../components/home/roomCreationForm';
import RoomList from '../components/home/roomList';

import { useRoomList } from '../hooks/useRoomList';
import { usePlayer } from '../hooks/usePlayer';
import { useRoom } from '../hooks/useRoom';
import { useState } from 'react';

export default function Home() {
  const { player } = usePlayer();
  const {
    selectedRoomID,
    passwordModalOpen,
    closePasswordModal,
    roomMessage,
    setRoomMessage,
  } = useRoomList();
  const { joinRoom } = useRoom();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState<string | undefined>(undefined);

  return (
    <Center h="100vh">
      <RoomCreationForm isOpen={isOpen} onClose={onClose} />
      <Modal
        isOpen={roomMessage !== undefined}
        onClose={() => {
          setRoomMessage(undefined);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Partida finalizada</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Text>El ganador fue...</Text>
            <Text as="b" fontSize="2xl">
              {roomMessage}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              onClick={() => {
                setRoomMessage(undefined);
              }}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={passwordModalOpen} onClose={closePasswordModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Introduce la contraseña</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closePasswordModal}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={async () => {
                await joinRoom(password);
                setPassword(undefined);
              }}
            >
              Unirse
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack>
        <Heading size="4xl">EL SWITCHER</Heading>
        <HStack>
          <Text fontSize="xl" as="i">
            Bienvenido,
          </Text>
          <Text fontSize="xl" as="b">
            {player?.username}
          </Text>
        </HStack>

        <HStack spacing={4} mt={8} mb={2}>
          <Tooltip label="Crear una sala">
            <IconButton
              icon={<AddIcon />}
              size="lg"
              aria-label="Create Room"
              colorScheme="teal"
              onClick={onOpen}
            />
          </Tooltip>
          <Tooltip
            label={
              selectedRoomID
                ? 'Unirse a la sala'
                : 'Selecciona una sala para unirte'
            }
          >
            <IconButton
              icon={<FaArrowRightToBracket />}
              size="lg"
              aria-label="Join Room"
              colorScheme="teal"
              isDisabled={selectedRoomID === undefined}
              onClick={() => joinRoom(password)}
            />
          </Tooltip>
        </HStack>
        <RoomList />
      </VStack>
    </Center>
  );
}
