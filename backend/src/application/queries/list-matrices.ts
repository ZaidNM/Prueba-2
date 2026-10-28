import type { MatrixRecord, MatrixRepository } from '../ports/matrix-repository.js';

/** Lado de lectura (query): últimas matrices generadas. */
export class ListMatricesQuery {
  constructor(private readonly repository: MatrixRepository) {}

  execute(limit: number): MatrixRecord[] {
    return this.repository.list(limit);
  }
}
