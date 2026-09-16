import type { City, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10_000;
const TIMEOUT_MESSAGE =
  'A consulta demorou mais de 10 segundos. Verifique sua conexão e tente novamente.';
const NETWORK_MESSAGE =
  'Não foi possível conectar ao serviço de clima. Verifique sua conexão e tente novamente.';
const API_MESSAGE =
  'O serviço de clima está indisponível no momento. Tente novamente em instantes.';

export type WeatherServiceErrorKind = 'network' | 'timeout' | 'api';

export class WeatherServiceError extends Error {
  readonly kind: WeatherServiceErrorKind;

  constructor(message: string, kind: WeatherServiceErrorKind = 'api') {
    super(message);
    this.name = 'WeatherServiceError';
    this.kind = kind;
  }
}

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  if (signal?.aborted) {
    throw new DOMException('A requisição foi cancelada.', 'AbortError');
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const forwardAbort = () => controller.abort();

  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new WeatherServiceError(API_MESSAGE, 'api');
    }

    return response;
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      if (timedOut) {
        throw new WeatherServiceError(TIMEOUT_MESSAGE, 'timeout');
      }

      throw error;
    }

    throw new WeatherServiceError(NETWORK_MESSAGE, 'network');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new WeatherServiceError(API_MESSAGE, 'api');
  }
}

interface GeocodingResult {
  id?: number | null;
  name?: string | null;
  country?: string | null;
  admin1?: string;
  latitude?: number | null;
  longitude?: number | null;
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
  const payload = await parseJson<GeocodingResponse>(response);

  return (payload.results ?? []).flatMap((result) => {
    const id = toFiniteNumber(result.id);
    const latitude = toFiniteNumber(result.latitude);
    const longitude = toFiniteNumber(result.longitude);
    const name = toSafeString(result.name);
    const country = toSafeString(result.country);

    if (
      id === null ||
      latitude === null ||
      longitude === null ||
      name === null ||
      country === null
    ) {
      return [];
    }

    return [
      {
        id,
        name,
        country,
        admin1: toSafeString(result.admin1) ?? undefined,
        latitude,
        longitude,
      },
    ];
  });
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
    time?: Array<string | null>;
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toSafeString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function mapForecast(daily: NonNullable<ForecastResponse['daily']>): ForecastDay[] {
  const length = Math.max(
    daily.time?.length ?? 0,
    daily.weather_code?.length ?? 0,
    daily.temperature_2m_max?.length ?? 0,
    daily.temperature_2m_min?.length ?? 0,
    daily.precipitation_probability_max?.length ?? 0,
  );

  return Array.from({ length: Math.min(length, 5) }, (_, index) => ({
    date: toSafeString(daily.time?.[index]) ?? '',
    min: toFiniteNumber(daily.temperature_2m_min?.[index]),
    max: toFiniteNumber(daily.temperature_2m_max?.[index]),
    weatherCode: toFiniteNumber(daily.weather_code?.[index]),
    precipitationProbability: toFiniteNumber(daily.precipitation_probability_max?.[index]),
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
  const payload = await parseJson<ForecastResponse>(response);

  if (!payload.current || !payload.daily) {
    throw new WeatherServiceError(
      'O serviço de clima retornou dados incompletos. Tente novamente.',
      'api',
    );
  }

  return {
    city,
    current: {
      temperature: toFiniteNumber(payload.current.temperature_2m),
      humidity: toFiniteNumber(payload.current.relative_humidity_2m),
      windSpeed: toFiniteNumber(payload.current.wind_speed_10m),
      precipitation: toFiniteNumber(payload.current.precipitation) ?? 0,
      pressure: toFiniteNumber(payload.current.pressure_msl),
      weatherCode: toFiniteNumber(payload.current.weather_code),
    },
    forecast: mapForecast(payload.daily),
  };
}
