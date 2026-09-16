import type { TemperatureUnit } from '../lib/temperature';
import ForecastCard, { type ForecastDay } from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title">
      <h2 className="text-2xl font-bold text-white" id="forecast-title">
        Previsão para os próximos dias
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.slice(0, 5).map((day, index) => (
          <ForecastCard day={day} index={index} key={day.date} unit={unit} />
        ))}
      </div>
    </section>
  );
}
