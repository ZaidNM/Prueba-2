import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HistoryList } from '../src/components/HistoryList';

const record = {
  id: 'abc',
  size: 3,
  matrix: [[1, 2, 3]],
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('HistoryList', () => {
  it('no renderiza nada sin elementos', () => {
    const { container } = render(<HistoryList items={[]} onSelect={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('notifica la matriz seleccionada', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<HistoryList items={[record]} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /3 × 3/ }));

    expect(onSelect).toHaveBeenCalledWith(record);
  });
});
