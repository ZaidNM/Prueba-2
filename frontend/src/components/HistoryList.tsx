import type { MatrixRecord } from '../api/matrices';

interface HistoryListProps {
  items: MatrixRecord[];
  onSelect: (record: MatrixRecord) => void;
  onClear: () => void;
}

export function HistoryList({ items, onSelect, onClear }: HistoryListProps) {
  if (items.length === 0) return null;

  return (
    <section className="card history" aria-label="Historial de matrices">
      <div className="history-header">
        <h2>Historial reciente</h2>
        <button type="button" className="clear-button" onClick={onClear}>
          Eliminar historial
        </button>
      </div>
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
