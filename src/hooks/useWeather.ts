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

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City };

function getErrorMessage(error: unknown): string {
  if (error instanceof WeatherServiceError) {
    return error.message;
  }

  return 'Não foi possível concluir a consulta. Verifique sua conexão e tente novamente.';
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
  const lastOperationRef = useRef<LastOperation | null>(null);

  const search = useCallback(async (name: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastOperationRef.current = { type: 'search', name };

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

      setState({
        status: 'error',
        query: name,
        cities: [],
        data: null,
        error: getErrorMessage(error),
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  const selectCity = useCallback(async (city: City) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastOperationRef.current = { type: 'selectCity', city };

    setState((currentState) => ({
      status: 'loading',
      query: currentState.query,
      cities: currentState.cities,
      data: null,
      error: null,
    }));

    try {
      const data = await getWeather(city, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      setState((currentState) => ({
        status: 'success',
        query: currentState.query,
        cities: currentState.cities,
        data,
        error: null,
      }));
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setState((currentState) => ({
        status: 'error',
        query: currentState.query,
        cities: currentState.cities,
        data: null,
        error: getErrorMessage(error),
      }));
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  const retry = useCallback(async () => {
    const lastOperation = lastOperationRef.current;

    if (lastOperation?.type === 'search') {
      await search(lastOperation.name);
    }

    if (lastOperation?.type === 'selectCity') {
      await selectCity(lastOperation.city);
    }
  }, [search, selectCity]);

  return { ...state, search, selectCity, retry };
}
