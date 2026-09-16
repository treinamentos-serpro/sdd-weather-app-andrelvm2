import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('state components', () => {
  it('comunica carregamento com role status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando informações meteorológicas...',
    );
  });

  it('exibe a mensagem de erro e permite tentar novamente', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState message="Verifique sua conexão e tente novamente." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Verifique sua conexão e tente novamente.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('orienta o usuário quando não há resultados', () => {
    render(<EmptyState />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nenhuma localidade encontrada' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Verifique o nome informado e tente pesquisar novamente.'),
    ).toBeInTheDocument();
  });
});
