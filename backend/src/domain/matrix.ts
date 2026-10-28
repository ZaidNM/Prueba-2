export const MAX_MATRIX_SIZE = 50;

/**
 * Rellena una matriz N x N con los números 1..N² en zig zag:
 * las filas pares van de izquierda a derecha y las impares al revés.
 */
export function generateZigZag(size: number): number[][] {
  const matrix = Array.from({ length: size }, () => Array<number>(size).fill(0));
  let value = 1;

  for (let row = 0; row < size; row++) {
    const leftToRight = row % 2 === 0;
    for (let step = 0; step < size; step++) {
      const column = leftToRight ? step : size - 1 - step;
      matrix[row][column] = value++;
    }
  }

  return matrix;
}
