import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  ModalHeader,
  HStack,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema } from '../../services/validation/roomSchema';
import { useRoom } from '../../hooks/useRoom';
import { useState } from 'react';

interface roomCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomCreationForm(props: roomCreationFormProps) {
  const { isOpen, onClose } = props;
  const { createRoom } = useRoom();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
  });

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="xl">
        <form
          onSubmit={handleSubmit((input) =>
            createRoom(
              input.name,
              input.maxPlayers,
              input.minPlayers,
              input.password.length ? input.password : undefined
            )
          )}
        >
          <ModalCloseButton />
          <ModalHeader>Crear partida</ModalHeader>
          <ModalBody>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Nombre de la partida</FormLabel>

              <Input
                autoComplete="off"
                type="text"
                {...register('name')}
                focusBorderColor="teal.400"
              />

              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  autoComplete="off"
                  type={show ? 'text' : 'password'}
                  {...register('password')}
                  focusBorderColor="teal.400"
                  pr="5rem"
                />
                <InputRightElement width="5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    {show ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <HStack spacing={4} mt={2}>
              <FormControl isRequired isInvalid={!!errors.minPlayers}>
                <FormLabel>Jugadores mínimos</FormLabel>
                <Controller
                  name="minPlayers"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      max={4}
                      min={2}
                      focusBorderColor="teal.400"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.minPlayers?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.maxPlayers}>
                <FormLabel>Jugadores máximos</FormLabel>
                <Controller
                  name="maxPlayers"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      max={4}
                      min={2}
                      focusBorderColor="teal.400"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.maxPlayers?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={2}>
              <Button colorScheme="gray" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Crear
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
