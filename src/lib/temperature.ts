export type TemperatureUnit = 'celsius' | 'fahrenheit';

export function displayTemperature(celsius: number | null, unit: TemperatureUnit): number | null {
  if (celsius === null) {
    return null;
  }

  const temperature = unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;

  return Math.round(temperature);
}
