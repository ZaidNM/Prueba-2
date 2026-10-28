import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MatrixGrid } from '../src/components/MatrixGrid';

describe('MatrixGrid', () => {
  it('renderiza N² celdas con los valores en orden', () => {
    const matrix = [
      [1, 2, 3],
      [6, 5, 4],
      [7, 8, 9],
    ];
    render(<MatrixGrid matrix={matrix} />);

    expect(screen.getByRole('grid', { name: 'Matriz de 3 por 3' })).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(9);
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
