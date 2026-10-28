import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { SqliteMatrixRepository } from '../src/infrastructure/sqlite-matrix-repository.js';

let app: ReturnType<typeof createApp>;

beforeEach(() => {
  app = createApp({ repository: new SqliteMatrixRepository(':memory:') });
});

describe('POST /api/v1/matrices', () => {
  it('genera y persiste una matriz en zig zag', async () => {
    const response = await request(app).post('/api/v1/matrices').send({ size: 3 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      size: 3,
      matrix: [
        [1, 2, 3],
        [6, 5, 4],
        [7, 8, 9],
      ],
    });
    expect(response.body.id).toEqual(expect.any(String));
    expect(new Date(response.body.createdAt).toISOString()).toBe(response.body.createdAt);
  });

  it.each([
    { size: 0 },
    { size: -1 },
    { size: 2.5 },
    { size: 51 },
    { size: '3' },
    {},
    { size: 3, extra: 'no permitido' },
  ])('responde 400 con %j', async (body) => {
    const response = await request(app).post('/api/v1/matrices').send(body);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it('responde 400 si el JSON está mal formado', async () => {
    const response = await request(app)
      .post('/api/v1/matrices')
      .set('Content-Type', 'application/json')
      .send('{"size": 3');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_JSON');
  });

  it('responde 500 si el repositorio falla', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const failingApp = createApp({
      repository: {
        save: () => {
          throw new Error('fallo de escritura');
        },
        list: () => [],
        findById: () => null,
      },
    });

    const response = await request(failingApp).post('/api/v1/matrices').send({ size: 2 });

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('GET /api/v1/matrices', () => {
  it('devuelve una lista vacía al inicio', async () => {
    const response = await request(app).get('/api/v1/matrices');

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
  });

  it('lista las matrices de la más reciente a la más antigua', async () => {
    await request(app).post('/api/v1/matrices').send({ size: 2 });
    await request(app).post('/api/v1/matrices').send({ size: 3 });

    const response = await request(app).get('/api/v1/matrices?limit=1');

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].size).toBe(3);
  });

  it('ignora un límite inválido y usa el valor por defecto', async () => {
    const response = await request(app).get('/api/v1/matrices?limit=abc');

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
  });
});

describe('GET /api/v1/matrices/:id', () => {
  it('devuelve la matriz por id', async () => {
    const created = await request(app).post('/api/v1/matrices').send({ size: 2 });

    const response = await request(app).get(`/api/v1/matrices/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.matrix).toEqual([
      [1, 2],
      [4, 3],
    ]);
  });

  it('responde 404 si no existe', async () => {
    const response = await request(app).get('/api/v1/matrices/no-existe');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});

describe('persistencia y rutas base', () => {
  it('mantiene los datos entre instancias que comparten repositorio', async () => {
    const repository = new SqliteMatrixRepository(':memory:');
    const firstApp = createApp({ repository });
    const secondApp = createApp({ repository });

    const created = await request(firstApp).post('/api/v1/matrices').send({ size: 4 });
    const response = await request(secondApp).get(`/api/v1/matrices/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.size).toBe(4);
  });

  it('expone /health', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('responde 404 en rutas desconocidas', async () => {
    const response = await request(app).get('/api/v1/desconocida');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
