import { Router } from 'express';
import { generateMatrixSchema } from '../application/dto.js';
import type { GenerateMatrixHandler } from '../application/commands/generate-matrix.js';
import type { ListMatricesQuery } from '../application/queries/list-matrices.js';
import type { GetMatrixQuery } from '../application/queries/get-matrix.js';
import { NotFoundError } from '../domain/errors.js';

interface Handlers {
  generateMatrix: GenerateMatrixHandler;
  listMatrices: ListMatricesQuery;
  getMatrix: GetMatrixQuery;
}

export function createMatrixRouter(handlers: Handlers): Router {
  const router = Router();

  router.post('/matrices', (req, res) => {
    const dto = generateMatrixSchema.parse(req.body);
    const record = handlers.generateMatrix.execute(dto);
    res.status(201).json(record);
  });

  router.get('/matrices', (req, res) => {
    const requested = Number(req.query.limit) || 10;
    const limit = Math.min(Math.max(requested, 1), 50);
    res.json({ items: handlers.listMatrices.execute(limit) });
  });

  router.get('/matrices/:id', (req, res) => {
    const record = handlers.getMatrix.execute(req.params.id);
    if (!record) throw new NotFoundError('Matriz no encontrada');
    res.json(record);
  });

  return router;
}
