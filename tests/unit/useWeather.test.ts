import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import * as weatherService from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

const firstCity: City = {
  id: 1,
  name: 'Recife',
  country: 'Brasil',
  latitude: -8.05,
  longitude: -34.9,
};

const secondCity: City = {
  id: 2,
  name: 'Olinda',
  country: 'Brasil',
  latitude: -8,
  longitude: -34.85,
};

function weatherData(city: City): WeatherData {
  return {
    city,
    current: {
      temperature: 28,
      humidity: 76,
      windSpeed: 18,
      precipitation: 0,
      pressure: 1013,
      weatherCode: 2,
    },
    forecast: [],
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useWeather', () => {
  it('seleciona outra cidade e repete essa seleção no retry', async () => {
    const getWeather = vi
      .spyOn(weatherService, 'getWeather')
      .mockImplementation(async (city) => weatherData(city));
    vi.spyOn(weatherService, 'searchCities').mockResolvedValue([firstCity, secondCity]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Recife');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data?.city).toEqual(firstCity);
    expect(result.current.cities).toEqual([firstCity, secondCity]);

    await act(async () => {
      await result.current.selectCity(secondCity);
    });

    expect(result.current.data?.city).toEqual(secondCity);
    expect(getWeather).toHaveBeenLastCalledWith(secondCity, expect.any(AbortSignal));

    await act(async () => {
      result.current.retry();
    });

    expect(getWeather).toHaveBeenCalledTimes(3);
    expect(getWeather).toHaveBeenLastCalledWith(secondCity, expect.any(AbortSignal));
  });

  it('entra em empty quando a busca não retorna cidades', async () => {
    const getWeather = vi.spyOn(weatherService, 'getWeather');
    vi.spyOn(weatherService, 'searchCities').mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(result.current.data).toBeNull();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('exibe erro amigável offline e repete a última busca no retry', async () => {
    const searchCities = vi
      .spyOn(weatherService, 'searchCities')
      .mockRejectedValueOnce(new TypeError('NetworkError'))
      .mockResolvedValueOnce([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Recife');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(
      'Não foi possível concluir a consulta. Verifique sua conexão e tente novamente.',
    );

    await act(async () => {
      await result.current.retry();
    });

    expect(searchCities).toHaveBeenNthCalledWith(1, 'Recife', expect.any(AbortSignal));
    expect(searchCities).toHaveBeenNthCalledWith(2, 'Recife', expect.any(AbortSignal));
    expect(result.current.status).toBe('empty');
  });
});
