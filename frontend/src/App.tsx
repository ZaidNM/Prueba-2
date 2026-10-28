import { useEffect, useState } from 'react';
import { generateMatrix, listMatrices, type MatrixRecord } from './api/matrices';
import { MatrixForm } from './components/MatrixForm';
import { MatrixGrid } from './components/MatrixGrid';
import { HistoryList } from './components/HistoryList';

const HISTORY_LIMIT = 8;

export default function App() {
  const [result, setResult] = useState<MatrixRecord | null>(null);
  const [history, setHistory] = useState<MatrixRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMatrices(HISTORY_LIMIT)
      .then((response) => setHistory(response.items))
      .catch(() => setHistory([]));
  }, []);

  async function handleGenerate(size: number) {
    setLoading(true);
    setError(null);

    try {
      const record = await generateMatrix(size);
      setResult(record);
      setHistory((current) => [record, ...current].slice(0, HISTORY_LIMIT));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <span className="badge">Prueba Técnica 2</span>
        <h1>Matriz en zig zag</h1>
        <p className="muted">
          API REST + React. Elige un tamaño N y las filas se llenan alternando la dirección.
        </p>
      </header>

      <main className="layout">
        <MatrixForm onSubmit={handleGenerate} loading={loading} />

        <section className="card result" aria-live="polite">
          <h2>Resultado</h2>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {result ? (
            <>
              <p className="muted small">
                Matriz {result.size} × {result.size} · {result.matrix.flat().length} celdas
              </p>
              <MatrixGrid matrix={result.matrix} />
            </>
          ) : (
            !error && <p className="muted">Aún no has generado ninguna matriz.</p>
          )}
        </section>
      </main>

      <HistoryList items={history} onSelect={setResult} />
    </div>
  );
}
