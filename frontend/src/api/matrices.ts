export interface MatrixRecord {
  id: string;
  size: number;
  matrix: number[][];
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    throw new Error('No se pudo conectar con la API');
  }

  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    throw new Error(body?.error?.message ?? `Error ${response.status}`);
  }

  return body as T;
}

export function generateMatrix(size: number): Promise<MatrixRecord> {
  return request<MatrixRecord>('/matrices', {
    method: 'POST',
    body: JSON.stringify({ size }),
  });
}

export function listMatrices(limit = 8): Promise<{ items: MatrixRecord[] }> {
  return request<{ items: MatrixRecord[] }>(`/matrices?limit=${limit}`);
}
