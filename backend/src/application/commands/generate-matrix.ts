import { generateZigZag } from '../../domain/matrix.js';
import type { MatrixRecord, MatrixRepository } from '../ports/matrix-repository.js';
import type { GenerateMatrixDto } from '../dto.js';

/** Lado de escritura (command): genera la matriz y la persiste. */
export class GenerateMatrixHandler {
  constructor(private readonly repository: MatrixRepository) {}

  execute(dto: GenerateMatrixDto): MatrixRecord {
    const matrix = generateZigZag(dto.size);
    return this.repository.save({ size: dto.size, matrix });
  }
}
