import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateMatrix, listMatrices } from '../src/api/matrices';

function stubFetch(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api/matrices', () => {
  it('envía el tamaño y devuelve la matriz', async () => {
    const record = { id: '1', size: 2, matrix: [[1, 2], [4, 3]], createdAt: '2026-01-01' };
    stubFetch(201, record);

    await expect(generateMatrix(2)).resolves.toEqual(record);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/matrices$/),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ size: 2 }) }),
    );
  });

  it('propaga el mensaje de error de la API', async () => {
    stubFetch(400, { error: { message: 'Datos inválidos' } });

    await expect(generateMatrix(0)).rejects.toThrow('Datos inválidos');
  });

  it('avisa cuando no hay conexión con la API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

    await expect(listMatrices()).rejects.toThrow('No se pudo conectar con la API');
  });
});
