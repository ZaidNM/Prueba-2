import type { MatrixRecord, MatrixRepository } from '../ports/matrix-repository.js';

/** Lado de lectura (query): una matriz por id. */
export class GetMatrixQuery {
  constructor(private readonly repository: MatrixRepository) {}

  execute(id: string): MatrixRecord | null {
    return this.repository.findById(id);
  }
}
