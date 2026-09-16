import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('expõe uma busca com label acessível', () => {
    render(<SearchBar disabled={false} onSearch={vi.fn()} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Pesquisar localidade' })).toBeInTheDocument();
  });

  it('envia o nome da cidade sem espaços nas extremidades', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar disabled={false} onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar localidade' }), '  Recife  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Recife');
  });

  it('não envia busca com texto vazio ou composto apenas por espaços', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar disabled={false} onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar localidade' }), '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('desabilita os controles durante uma operação em andamento', () => {
    render(<SearchBar disabled={true} onSearch={vi.fn()} />);

    expect(screen.getByRole('searchbox', { name: 'Pesquisar localidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });
});
