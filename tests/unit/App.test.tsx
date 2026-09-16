import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../../src/App';
import * as weatherService from '../../src/services/weatherService';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exibe o estado inicial e a orientação para pesquisar uma localidade', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Weather App' })).toBeInTheDocument();
    expect(
      screen.getByText('Pesquise uma localidade para consultar a previsão do tempo.'),
    ).toBeInTheDocument();
  });

  it('mostra os dados da cidade buscada e converte a temperatura ao alterar a unidade', async () => {
    const user = userEvent.setup();

    vi.spyOn(weatherService, 'searchCities').mockResolvedValue([
      { id: 1, name: 'Recife', country: 'Brasil', latitude: -8.05, longitude: -34.9 },
    ]);
    vi.spyOn(weatherService, 'getWeather').mockResolvedValue({
      city: { id: 1, name: 'Recife', country: 'Brasil', latitude: -8.05, longitude: -34.9 },
      current: {
        temperature: 28,
        humidity: 76,
        windSpeed: 18,
        precipitation: 0,
        pressure: 1013,
        weatherCode: 2,
      },
      forecast: [
        { date: '2026-09-16', min: 24, max: 29, weatherCode: 2, precipitationProbability: 20 },
        { date: '2026-09-17', min: 24, max: 30, weatherCode: 61, precipitationProbability: 65 },
        { date: '2026-09-18', min: 23, max: 29, weatherCode: 3, precipitationProbability: 30 },
        { date: '2026-09-19', min: 23, max: 28, weatherCode: 80, precipitationProbability: 70 },
        { date: '2026-09-20', min: 24, max: 30, weatherCode: 0, precipitationProbability: 10 },
      ],
    });

    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar localidade' }), 'Recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => expect(screen.getAllByText('28 °C')).toHaveLength(2));

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getAllByText('82 °F')).toHaveLength(2);
  });
});
