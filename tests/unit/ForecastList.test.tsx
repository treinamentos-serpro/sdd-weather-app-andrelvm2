import { render, screen } from '@testing-library/react';
import ForecastList from '../../src/components/ForecastList';

const forecast = [
  { date: '2026-09-16', min: 21, max: 29, weatherCode: 0, precipitationProbability: 10 },
  { date: '2026-09-17', min: 20, max: 28, weatherCode: 3, precipitationProbability: 40 },
  { date: '2026-09-18', min: 19, max: 26, weatherCode: 61, precipitationProbability: 80 },
  { date: '2026-09-19', min: 18, max: 25, weatherCode: 2, precipitationProbability: 20 },
  { date: '2026-09-20', min: 18, max: 24, weatherCode: 80, precipitationProbability: 60 },
];

describe('ForecastList', () => {
  it('exibe cinco cards com dia, condição, temperaturas e chuva', () => {
    render(<ForecastList forecast={forecast} unit="celsius" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Previsão para os próximos dias' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByRole('heading', { level: 3, name: 'Hoje' })).toBeInTheDocument();
    expect(screen.getByText('Céu limpo')).toBeInTheDocument();
    expect(screen.getByText('29 °C')).toBeInTheDocument();
    expect(screen.getByText('21 °C')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('converte as temperaturas para Fahrenheit', () => {
    render(<ForecastList forecast={forecast} unit="fahrenheit" />);

    expect(screen.getByText('84 °F')).toBeInTheDocument();
    expect(screen.getByText('70 °F')).toBeInTheDocument();
  });

  it('limita a previsão aos cinco primeiros dias', () => {
    render(
      <ForecastList
        forecast={[...forecast, { ...forecast[0], date: '2026-09-21' }]}
        unit="celsius"
      />,
    );

    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('mantém o card e sinaliza dados diários ausentes', () => {
    render(
      <ForecastList
        forecast={[{ ...forecast[0], min: null, max: null, precipitationProbability: null }]}
        unit="celsius"
      />,
    );

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Hoje: Céu limpo' })).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(3);
  });
});
