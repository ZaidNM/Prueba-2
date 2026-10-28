import { useState, type FormEvent } from 'react';

export const MAX_SIZE = 50;

export function validateSize(rawValue: string): string | null {
  if (rawValue.trim() === '') return 'Ingresa un número';

  const size = Number(rawValue);
  if (!Number.isInteger(size)) return 'Debe ser un número entero';
  if (size < 1 || size > MAX_SIZE) return `Debe estar entre 1 y ${MAX_SIZE}`;

  return null;
}

interface MatrixFormProps {
  onSubmit: (size: number) => void;
  loading: boolean;
}

export function MatrixForm({ onSubmit, loading }: MatrixFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = validateSize(value);
    setError(message);
    if (!message) onSubmit(Number(value));
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Generar matriz</h2>
      <p className="muted">Ingresa el tamaño N para obtener una matriz N × N llena del 1 al N².</p>

      <label htmlFor="size">Tamaño (N)</label>
      <div className="form-row">
        <input
          id="size"
          name="size"
          type="number"
          min={1}
          max={MAX_SIZE}
          step={1}
          inputMode="numeric"
          placeholder="Ej. 5"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'size-error' : 'size-hint'}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generando…' : 'Generar'}
        </button>
      </div>

      {error ? (
        <p id="size-error" className="error" role="alert">
          {error}
        </p>
      ) : (
        <p id="size-hint" className="muted small">
          Número entero entre 1 y {MAX_SIZE}.
        </p>
      )}
    </form>
  );
}
