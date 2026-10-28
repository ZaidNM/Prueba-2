import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { clearMatrices, generateMatrix, listMatrices } from '../src/api/matrices';

vi.mock('../src/api/matrices', () => ({
  generateMatrix: vi.fn(),
  listMatrices: vi.fn(),
  clearMatrices: vi.fn(),
}));

const record = {
  id: 'abc',
  size: 3,
  matrix: [
    [1, 2, 3],
    [6, 5, 4],
    [7, 8, 9],
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listMatrices).mockResolvedValue({ items: [] });
});

describe('App', () => {
  it('genera una matriz y la muestra junto al historial', async () => {
    vi.mocked(generateMatrix).mockResolvedValue(record);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Tamaño (N)'), '3');
    await user.click(screen.getByRole('button', { name: 'Generar' }));

    expect(generateMatrix).toHaveBeenCalledWith(3);
    expect(await screen.findByRole('grid', { name: 'Matriz de 3 por 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3 × 3/ })).toBeInTheDocument();
  });

  it('muestra el mensaje de error que devuelve la API', async () => {
    vi.mocked(generateMatrix).mockRejectedValue(new Error('Datos inválidos'));
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Tamaño (N)'), '3');
    await user.click(screen.getByRole('button', { name: 'Generar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Datos inválidos');
  });

  it('elimina el historial al confirmar', async () => {
    vi.mocked(listMatrices).mockResolvedValue({ items: [record] });
    vi.mocked(clearMatrices).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Eliminar historial' }));

    expect(clearMatrices).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /3 × 3/ })).not.toBeInTheDocument();
  });
});
