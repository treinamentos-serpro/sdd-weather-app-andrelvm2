export function formatForecastDay(date: string, index: number): string {
  if (index === 0) {
    return 'Hoje';
  }

  if (index === 1) {
    return 'Amanhã';
  }

  if (!date || Number.isNaN(Date.parse(`${date}T12:00:00Z`))) {
    return 'Data indisponível';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    weekday: 'long',
  }).format(new Date(`${date}T12:00:00Z`));
}
