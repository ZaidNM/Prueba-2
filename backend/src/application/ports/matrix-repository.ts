export interface MatrixRecord {
  id: string;
  size: number;
  matrix: number[][];
  createdAt: string;
}

export interface MatrixRepository {
  save(input: Pick<MatrixRecord, 'size' | 'matrix'>): MatrixRecord;
  list(limit: number): MatrixRecord[];
  findById(id: string): MatrixRecord | null;
}
