import { z } from 'zod';

export const roomSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'El nombre no puede estar vacío' })
      .max(32, { message: 'El nombre no puede tener más de 32 caracteres' })
      .regex(/^[ -~]+$/, {
        message: 'El nombre solo puede contener caracteres ASCII',
      }),
    password: z.string(),
    minPlayers: z.coerce
      .number()
      .int()
      .min(2, { message: 'El mínimo de jugadores debe ser al menos 2' })
      .max(4, { message: 'El mínimo de jugadores debe ser como máximo 4' }),
    maxPlayers: z.coerce
      .number()
      .int()
      .min(2, { message: 'El máximo de jugadores debe ser al menos 2' })
      .max(4, { message: 'El máximo de jugadores debe ser como máximo 4' }),
  })
  .refine((data) => data.minPlayers <= data.maxPlayers, {
    message: 'El mínimo de jugadores debe ser menor o igual al máximo',
    path: ['minPlayers'],
  });
