import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { TemperatureUnit } from './lib/temperature';

export default function App() {
  const { status, data, error, search, retry } = useWeather();
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  function renderContent() {
    switch (status) {
      case 'loading':
        return <LoadingState />;
      case 'empty':
        return <EmptyState />;
      case 'error':
        return (
          <ErrorState
            message={error ?? 'Não foi possível carregar as informações. Tente novamente.'}
            onRetry={retry}
          />
        );
      case 'success':
        return data ? (
          <div className="space-y-8">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        ) : null;
      default:
        return (
          <section className="border border-white/10 bg-white/5 p-6 text-center text-white shadow-glass backdrop-blur-md">
            <h2 className="text-xl font-bold">Encontre o clima da sua localidade</h2>
            <p className="mt-2 text-slate-200">
              Pesquise uma localidade para consultar a previsão do tempo.
            </p>
          </section>
        );
    }
  }

  return (
    <main className="min-h-screen bg-night-900 px-6 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center">
          <div className="shrink-0">
            <p className="text-sm font-medium text-accent-400">Previsão local</p>
            <h1 className="mt-1 text-3xl font-bold">Weather App</h1>
          </div>
          <div className="flex-1">
            <SearchBar disabled={status === 'loading'} onSearch={search} />
          </div>
          <UnitToggle onChange={setUnit} unit={unit} />
        </header>
        <div className="mt-8">{renderContent()}</div>
      </div>
    </main>
  );
}
