import { render, screen } from '@testing-library/react';
import CurrentWeather from '../../src/components/CurrentWeather';

const city = { name: 'Recife' };
const current = {
  temperature: 18,
  humidity: 80,
  windSpeed: 10,
  precipitation: 0,
  pressure: 1015,
  weatherCode: 3,
};

describe('CurrentWeather', () => {
  it('exibe a temperatura, condição e métricas da localidade', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Recife' })).toBeInTheDocument();
    expect(screen.getByText('18 °C')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('80 %')).toBeInTheDocument();
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
  });

  it('converte a temperatura para Fahrenheit na apresentação', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByText('64 °F')).toBeInTheDocument();
  });

  it('sinaliza métricas ausentes sem inventar valores', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ ...current, humidity: null, weatherCode: null }}
        unit="celsius"
      />,
    );

    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
  });

  it('sinaliza a temperatura ausente como indisponível', () => {
    render(
      <CurrentWeather city={city} current={{ ...current, temperature: null }} unit="celsius" />,
    );

    expect(screen.getByText('Indisponível')).toBeInTheDocument();
  });
});
