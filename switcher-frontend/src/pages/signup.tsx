import {
  Center,
  Heading,
  Button,
  VStack,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { usePlayer } from "../hooks/usePlayer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "../services/validation/playerSchema";
import { Navigate } from "react-router-dom";

export default function Signup() {
  const { createPlayer, player } = usePlayer();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
  });

  return player ? (
    <Navigate to="/" replace />
  ) : (
    <Center h="100vh">
      <VStack spacing={4}>
        <Heading>Selecciona tu apodo</Heading>
        <form onSubmit={handleSubmit((input) => createPlayer(input.name))}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <Input
                autoComplete="off"
                {...register("name")}
                type="text"
                isRequired
                focusBorderColor="teal.400"
                w="sm"
                variant="flushed"
                autoFocus
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              size="lg"
            >
              Ingresar
            </Button>
          </VStack>
        </form>
      </VStack>
    </Center>
  );
}
