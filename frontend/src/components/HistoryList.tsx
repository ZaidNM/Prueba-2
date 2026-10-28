import type { MatrixRecord } from '../api/matrices';

interface HistoryListProps {
  items: MatrixRecord[];
  onSelect: (record: MatrixRecord) => void;
}

export function HistoryList({ items, onSelect }: HistoryListProps) {
  if (items.length === 0) return null;

  return (
    <section className="card history" aria-label="Historial de matrices">
      <h2>Historial reciente</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onSelect(item)}>
              <strong>
                {item.size} × {item.size}
              </strong>
              <time dateTime={item.createdAt}>
                {new Date(item.createdAt).toLocaleString('es-CO')}
              </time>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
