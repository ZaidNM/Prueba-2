import { describe, expect, it } from 'vitest';
import { generateZigZag } from '../src/domain/matrix.js';

describe('generateZigZag', () => {
  it('genera una matriz de 1x1', () => {
    expect(generateZigZag(1)).toEqual([[1]]);
  });

  it('genera una matriz de 2x2', () => {
    expect(generateZigZag(2)).toEqual([
      [1, 2],
      [4, 3],
    ]);
  });

  it('genera una matriz de 3x3 en zig zag', () => {
    expect(generateZigZag(3)).toEqual([
      [1, 2, 3],
      [6, 5, 4],
      [7, 8, 9],
    ]);
  });

  it('genera una matriz de 4x4 en zig zag', () => {
    expect(generateZigZag(4)).toEqual([
      [1, 2, 3, 4],
      [8, 7, 6, 5],
      [9, 10, 11, 12],
      [16, 15, 14, 13],
    ]);
  });

  it('contiene los números 1..N² exactamente una vez para N=7', () => {
    const size = 7;
    const values = generateZigZag(size).flat().sort((a, b) => a - b);
    expect(values).toEqual(Array.from({ length: size * size }, (_, index) => index + 1));
  });

  it('alterna la dirección de las filas', () => {
    const matrix = generateZigZag(5);

    matrix.forEach((row, index) => {
      const ordered = index % 2 === 0 ? row : [...row].reverse();
      expect(ordered).toEqual([...ordered].sort((a, b) => a - b));
    });
  });
});
