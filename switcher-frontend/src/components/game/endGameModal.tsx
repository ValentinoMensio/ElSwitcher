import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';

interface EndGameModalProps {
  isOpen: boolean; // Si el modal está abierto o no
  onClose: () => void; // Función para cerrar el modal
  isWinner: boolean; // Indica si el jugador actual es el ganador
  winnerName: string; // Nombre del jugador ganador
}

export default function EndGameModal(props: EndGameModalProps) {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isWinner ? '¡Victoria!' : 'Fin de la partida'}
        </ModalHeader>
        <ModalBody>
          {props.isWinner ? (
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                ¡Felicidades, has ganado!
              </Text>
              <Text fontSize="lg">🎉🎉🎉</Text>
            </Box>
          ) : (
            <Box textAlign="center">
              <Text fontSize="lg">
                El ganador es <strong>{props.winnerName}</strong>
              </Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Volver al menú principal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
