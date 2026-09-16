import { describe, expect, it } from 'vitest';
import { formatForecastDay } from '../../src/lib/format';

describe('formatForecastDay', () => {
  it('formata o índice 0 como Hoje', () => {
    expect(formatForecastDay('2026-09-16', 0)).toBe('Hoje');
  });

  it('formata o índice 1 como Amanhã', () => {
    expect(formatForecastDay('2026-09-17', 1)).toBe('Amanhã');
  });

  it('formata os demais índices como dia da semana', () => {
    expect(formatForecastDay('2026-09-20', 2)).toBe('domingo');
  });
});
