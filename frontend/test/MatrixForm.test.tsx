import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MatrixForm, validateSize } from '../src/components/MatrixForm';

describe('validateSize', () => {
  it('acepta enteros entre 1 y 50', () => {
    expect(validateSize('1')).toBeNull();
    expect(validateSize('50')).toBeNull();
  });

  it.each(['', '0', '51', '2.5', 'abc'])('rechaza "%s"', (value) => {
    expect(validateSize(value)).not.toBeNull();
  });
});

describe('MatrixForm', () => {
  it('muestra un error y no envía valores inválidos', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MatrixForm onSubmit={onSubmit} loading={false} />);

    await user.click(screen.getByRole('button', { name: 'Generar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un número');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía el tamaño cuando es válido', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MatrixForm onSubmit={onSubmit} loading={false} />);

    await user.type(screen.getByLabelText('Tamaño (N)'), '7');
    await user.click(screen.getByRole('button', { name: 'Generar' }));

    expect(onSubmit).toHaveBeenCalledWith(7);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('deshabilita el botón mientras carga', () => {
    render(<MatrixForm onSubmit={vi.fn()} loading />);

    expect(screen.getByRole('button', { name: 'Generando…' })).toBeDisabled();
  });
});
