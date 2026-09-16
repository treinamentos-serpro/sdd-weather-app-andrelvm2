import { formatForecastDay } from '../lib/format';
import { displayTemperature, type TemperatureUnit } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';

export interface ForecastDay {
  date: string;
  min: number | null;
  max: number | null;
  weatherCode: number | null;
  precipitationProbability: number | null;
}

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: TemperatureUnit;
}

function formatTemperature(value: number | null, unit: TemperatureUnit): string {
  const temperature = displayTemperature(value, unit);

  if (temperature === null) {
    return 'Indisponível';
  }

  return `${temperature} ${unit === 'celsius' ? '°C' : '°F'}`;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const weatherCondition = getWeatherCondition(day.weatherCode);
  const dayLabel = formatForecastDay(day.date, index);
  const rainChance =
    day.precipitationProbability === null ? 'Indisponível' : `${day.precipitationProbability}%`;

  return (
    <article
      aria-label={`${dayLabel}: ${weatherCondition.label}`}
      className="border border-white/10 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md"
    >
      <h3 className="font-semibold capitalize">{dayLabel}</h3>
      <span aria-hidden="true" className="mt-5 block text-4xl leading-none">
        {weatherCondition.icon}
      </span>
      <p className="mt-3 text-sm text-slate-200">{weatherCondition.label}</p>
      <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-300">Máx.</dt>
          <dd className="font-semibold">{formatTemperature(day.max, unit)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-300">Mín.</dt>
          <dd className="font-semibold">{formatTemperature(day.min, unit)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-300">Chuva</dt>
          <dd className="font-semibold">{rainChance}</dd>
        </div>
      </dl>
    </article>
  );
}
