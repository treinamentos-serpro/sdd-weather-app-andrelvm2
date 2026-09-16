import { useCallback, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData, WeatherStatus } from '../types/weather';

interface WeatherState {
  status: WeatherStatus;
  query: string;
  cities: City[];
  data: WeatherData | null;
  error: string | null;
}

const initialState: WeatherState = {
  status: 'idle',
  query: '',
  cities: [],
  data: null,
  error: null,
};

export function useWeather() {
  const [state, setState] = useState<WeatherState>(initialState);
  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef('');

  const search = useCallback(async (name: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastQueryRef.current = name;

    setState({ status: 'loading', query: name, cities: [], data: null, error: null });

    try {
      const cities = await searchCities(name, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      if (cities.length === 0) {
        setState({ status: 'empty', query: name, cities: [], data: null, error: null });
        return;
      }

      // Primeira correspondência é a candidata mais relevante retornada pelo geocoding.
      const data = await getWeather(cities[0], controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      setState({ status: 'success', query: name, cities, data, error: null });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const message =
        error instanceof WeatherServiceError
          ? error.message
          : 'Não foi possível consultar o clima. Tente novamente.';

      setState({ status: 'error', query: name, cities: [], data: null, error: message });
    }
  }, []);

  const retry = useCallback(() => {
    if (lastQueryRef.current) {
      void search(lastQueryRef.current);
    }
  }, [search]);

  return { ...state, search, retry };
}
