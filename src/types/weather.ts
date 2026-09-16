export interface City {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  precipitation: number | null;
  pressure: number | null;
  weatherCode: number | null;
}

export interface ForecastDay {
  date: string;
  min: number | null;
  max: number | null;
  weatherCode: number | null;
  precipitationProbability: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';
