import type { City, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10_000;

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const forwardAbort = () => controller.abort();

  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new WeatherServiceError('Não foi possível consultar o clima. Tente novamente.');
    }

    return response;
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais. Tente novamente.');
    }

    throw new WeatherServiceError('Falha de rede. Verifique sua conexão e tente novamente.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function searchCities(name: string, signal?: AbortSignal): Promise<City[]> {
  const query = name.trim();

  if (!query) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
  const response = await fetchWithTimeout(url, signal);
  const payload = (await response.json()) as GeocodingResponse;

  return (payload.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

interface ForecastResponse {
  current?: {
    temperature_2m?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    precipitation?: number | null;
    weather_code?: number | null;
    pressure_msl?: number | null;
  };
  daily?: {
    time?: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
}

function mapForecast(daily: NonNullable<ForecastResponse['daily']>): ForecastDay[] {
  const dates = daily.time ?? [];

  return dates.slice(0, 5).map((date, index) => ({
    date,
    min: daily.temperature_2m_min?.[index] ?? null,
    max: daily.temperature_2m_max?.[index] ?? null,
    weatherCode: daily.weather_code?.[index] ?? null,
    precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
  }));
}

export async function getWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,pressure_msl',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
  });

  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`, signal);
  const payload = (await response.json()) as ForecastResponse;

  if (!payload.current || !payload.daily) {
    throw new WeatherServiceError('Resposta incompleta do serviço de clima.');
  }

  return {
    city,
    current: {
      temperature: payload.current.temperature_2m ?? null,
      humidity: payload.current.relative_humidity_2m ?? null,
      windSpeed: payload.current.wind_speed_10m ?? null,
      precipitation: payload.current.precipitation ?? null,
      pressure: payload.current.pressure_msl ?? null,
      weatherCode: payload.current.weather_code ?? null,
    },
    forecast: mapForecast(payload.daily),
  };
}
