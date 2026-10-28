import cors from 'cors';
import express, { type Express } from 'express';
import type { MatrixRepository } from './application/ports/matrix-repository.js';
import { GenerateMatrixHandler } from './application/commands/generate-matrix.js';
import { ListMatricesQuery } from './application/queries/list-matrices.js';
import { GetMatrixQuery } from './application/queries/get-matrix.js';
import { createMatrixRouter } from './http/routes.js';
import { errorHandler, notFoundHandler } from './http/error-handler.js';

interface AppDependencies {
  repository: MatrixRepository;
  corsOrigin?: string;
}

export function createApp({ repository, corsOrigin = '*' }: AppDependencies): Express {
  const app = express();
  const origin = corsOrigin === '*' ? '*' : corsOrigin.split(',').map((value) => value.trim());

  app.use(cors({ origin }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(
    '/api/v1',
    createMatrixRouter({
      generateMatrix: new GenerateMatrixHandler(repository),
      listMatrices: new ListMatricesQuery(repository),
      getMatrix: new GetMatrixQuery(repository),
    }),
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
