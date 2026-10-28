import { join } from 'node:path';
import { createApp } from './app.js';
import { SqliteMatrixRepository } from './infrastructure/sqlite-matrix-repository.js';

const port = Number(process.env.PORT) || 4000;
const dataDir = process.env.DATA_DIR ?? join(process.cwd(), 'data');
const repository = new SqliteMatrixRepository(join(dataDir, 'matrices.db'));

createApp({ repository, corsOrigin: process.env.CORS_ORIGIN }).listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});
