import type { MatrixRepository } from '../ports/matrix-repository.js';

/** Lado de escritura (command): vacía el historial. */
export class ClearMatricesCommand {
  constructor(private readonly repository: MatrixRepository) {}

  execute(): void {
    this.repository.clear();
  }
}
