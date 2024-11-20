import { z } from "zod";

export const playerSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "El nombre no puede estar vacío" })
      .max(32, { message: "El nombre no puede tener más de 32 caracteres" })
      .regex(/^[ -~]+$/, {
        message: "El nombre solo puede contener caracteres ASCII",
      }),
  });