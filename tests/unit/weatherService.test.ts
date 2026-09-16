import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'Sao Paulo',
  country: 'Brasil',
  admin1: 'Sao Paulo',
  latitude: -23.55,
  longitude: -46.63,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('getWeather', () => {
  it('consulta o forecast e mapeia current e os cinco dias', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          current: {
            temperature_2m: 22.5,
            relative_humidity_2m: 65,
            wind_speed_10m: 12,
            precipitation: 0.4,
            weather_code: 3,
            pressure_msl: 1012,
          },
          daily: {
            time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
            weather_code: [3, 2, 1, 0, 61],
            temperature_2m_max: [25, 26, 27, 28, 24],
            temperature_2m_min: [16, 17, 18, 19, 15],
            precipitation_probability_max: [20, 10, 0, 0, 70],
          },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(city);

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(url.searchParams.get('latitude')).toBe('-23.55');
    expect(url.searchParams.get('longitude')).toBe('-46.63');
    expect(url.searchParams.get('forecast_days')).toBe('5');
    expect(url.searchParams.get('timezone')).toBe('auto');
    expect(url.searchParams.get('current')).toContain('temperature_2m');
    expect(url.searchParams.get('daily')).toContain('temperature_2m_max');
    expect(weather.current).toEqual({
      temperature: 22.5,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0.4,
      pressure: 1012,
      weatherCode: 3,
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[0]).toEqual({
      date: '2026-09-16',
      min: 16,
      max: 25,
      weatherCode: 3,
      precipitationProbability: 20,
    });
  });

  it.each([
    { daily: {} },
    { current: {} },
  ])('lança WeatherServiceError para resposta sem current ou daily', async (payload) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converte abort por timeout em WeatherServiceError', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, options: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            options.signal?.addEventListener('abort', () => {
              reject(new DOMException('', 'AbortError'));
            });
          }),
      ),
    );

    const request = getWeather(city);
    const expectedError = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });
    await vi.advanceTimersByTimeAsync(10_000);

    await expectedError;
  });

  it('converte falha de rede em WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
  });
});
