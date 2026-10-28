import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { MatrixRecord, MatrixRepository } from '../application/ports/matrix-repository.js';

type Row = {
  id: string;
  size: number;
  matrix: string;
  created_at: string;
};

/**
 * Persistencia en SQLite (archivo local o ':memory:' en tests).
 * shortcut: disco efímero en el plan free de Render; montar un disco o migrar a Postgres si se necesita durabilidad.
 */
export class SqliteMatrixRepository implements MatrixRepository {
  private readonly db: DatabaseSync;

  constructor(file: string) {
    if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
    this.db = new DatabaseSync(file);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS matrices (
        id TEXT PRIMARY KEY,
        size INTEGER NOT NULL,
        matrix TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }

  save({ size, matrix }: Pick<MatrixRecord, 'size' | 'matrix'>): MatrixRecord {
    const record: MatrixRecord = {
      id: randomUUID(),
      size,
      matrix,
      createdAt: new Date().toISOString(),
    };

    this.db
      .prepare('INSERT INTO matrices (id, size, matrix, created_at) VALUES (?, ?, ?, ?)')
      .run(record.id, record.size, JSON.stringify(record.matrix), record.createdAt);

    return record;
  }

  list(limit: number): MatrixRecord[] {
    const rows = this.db
      .prepare('SELECT * FROM matrices ORDER BY created_at DESC, rowid DESC LIMIT ?')
      .all(limit) as unknown as Row[];

    return rows.map(toRecord);
  }

  findById(id: string): MatrixRecord | null {
    const row = this.db.prepare('SELECT * FROM matrices WHERE id = ?').get(id) as Row | undefined;
    return row ? toRecord(row) : null;
  }
}

function toRecord(row: Row): MatrixRecord {
  return {
    id: row.id,
    size: row.size,
    matrix: JSON.parse(row.matrix) as number[][],
    createdAt: row.created_at,
  };
}
