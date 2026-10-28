interface MatrixGridProps {
  matrix: number[][];
}

export function MatrixGrid({ matrix }: MatrixGridProps) {
  const size = matrix.length;

  return (
    <div className="matrix-wrapper">
      <div className="matrix" role="grid" aria-label={`Matriz de ${size} por ${size}`}>
        {matrix.map((row, rowIndex) => (
          <div className="matrix-row" role="row" key={rowIndex}>
            {row.map((value, columnIndex) => (
              <span className="cell" role="gridcell" key={columnIndex}>
                {value}
              </span>
            ))}
            <span className="direction" aria-hidden="true">
              {rowIndex % 2 === 0 ? '→' : '←'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
