import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('expõe o grupo e indica a unidade ativa', () => {
    render(<UnitToggle onChange={vi.fn()} unit="celsius" />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('notifica a unidade selecionada por clique', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UnitToggle onChange={onChange} unit="celsius" />);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('altera a unidade e move o foco com as setas', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UnitToggle onChange={onChange} unit="celsius" />);

    const celsiusButton = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheitButton = screen.getByRole('button', { name: 'Fahrenheit' });
    celsiusButton.focus();

    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('fahrenheit');
    expect(fahrenheitButton).toHaveFocus();
  });

  it('atualiza a temperatura exibida ao selecionar Fahrenheit', async () => {
    const user = userEvent.setup();

    function WeatherWithUnitToggle() {
      const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

      return (
        <>
          <UnitToggle onChange={setUnit} unit={unit} />
          <CurrentWeather
            city={{ name: 'Recife' }}
            current={{
              temperature: 0,
              humidity: 80,
              windSpeed: 10,
              precipitation: 0,
              pressure: 1015,
              weatherCode: 0,
            }}
            unit={unit}
          />
        </>
      );
    }

    render(<WeatherWithUnitToggle />);

    expect(screen.getByText('0 °C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('32 °F')).toBeInTheDocument();
  });
});
