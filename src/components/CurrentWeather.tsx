import { displayTemperature, type TemperatureUnit } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';

export interface CurrentWeatherCity {
  name: string;
}

export interface CurrentWeatherData {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  precipitation: number | null;
  pressure: number | null;
  weatherCode: number | null;
}

interface CurrentWeatherProps {
  city: CurrentWeatherCity;
  current: CurrentWeatherData;
  unit: TemperatureUnit;
}

function formatMetric(value: number | null, suffix: string): string {
  return value === null ? 'Indisponível' : `${value} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weatherCondition = getWeatherCondition(current.weatherCode);
  const temperature = displayTemperature(current.temperature, unit);
  const temperatureUnit = unit === 'celsius' ? '°C' : '°F';
  const metrics = [
    { label: 'Umidade', value: formatMetric(current.humidity, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeed, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitation, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressure, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-title"
      className="border border-white/10 bg-white/5 p-6 text-white shadow-glass backdrop-blur-md sm:p-8"
    >
      <p className="text-sm font-medium text-accent-400">Condições atuais</p>
      <h2 className="mt-1 text-2xl font-bold" id="current-weather-title">
        {city.name}
      </h2>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-6xl leading-none">
            {weatherCondition.icon}
          </span>
          <div>
            <p className="break-words text-4xl font-bold leading-none sm:text-7xl">
              {temperature === null ? 'Indisponível' : `${temperature} ${temperatureUnit}`}
            </p>
            <p className="mt-3 text-lg text-slate-200">{weatherCondition.label}</p>
          </div>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div className="bg-night-800/70 p-3" key={metric.label}>
            <dt className="text-sm text-slate-300">{metric.label}</dt>
            <dd className="mt-1 font-semibold">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
