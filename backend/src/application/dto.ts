import { z } from 'zod';
import { MAX_MATRIX_SIZE } from '../domain/matrix.js';

export const generateMatrixSchema = z
  .object({
    size: z
      .number()
      .int('El tamaño debe ser un número entero')
      .positive('El tamaño debe ser positivo')
      .max(MAX_MATRIX_SIZE, `El tamaño máximo es ${MAX_MATRIX_SIZE}`),
  })
  .strict();

export type GenerateMatrixDto = z.infer<typeof generateMatrixSchema>;
