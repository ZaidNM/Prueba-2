import { describe, expect, it } from 'vitest';
import { generateMatrixSchema } from '../src/application/dto.js';

describe('generateMatrixSchema', () => {
  it('acepta un entero positivo dentro del rango', () => {
    expect(generateMatrixSchema.parse({ size: 5 })).toEqual({ size: 5 });
    expect(generateMatrixSchema.parse({ size: 50 })).toEqual({ size: 50 });
  });

  it.each([0, -3, 2.5, 51])('rechaza el tamaño %s', (size) => {
    expect(generateMatrixSchema.safeParse({ size }).success).toBe(false);
  });

  it('rechaza valores que no son números', () => {
    expect(generateMatrixSchema.safeParse({ size: '5' }).success).toBe(false);
    expect(generateMatrixSchema.safeParse({}).success).toBe(false);
    expect(generateMatrixSchema.safeParse(null).success).toBe(false);
  });

  it('rechaza propiedades desconocidas', () => {
    expect(generateMatrixSchema.safeParse({ size: 3, extra: true }).success).toBe(false);
  });
});
