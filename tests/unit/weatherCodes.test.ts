import { describe, expect, it } from 'vitest';
import { getWeatherCondition } from '../../src/lib/weatherCodes';

describe('getWeatherCondition', () => {
  it('retorna a condição conhecida para o código informado', () => {
    expect(getWeatherCondition(61)).toEqual({ label: 'Chuva leve', icon: '🌦' });
  });

  it('retorna a condição indisponível para código desconhecido', () => {
    expect(getWeatherCondition(999)).toEqual({ label: 'Indisponível', icon: '?' });
  });

  it('retorna a condição indisponível quando o código é null', () => {
    expect(getWeatherCondition(null)).toEqual({ label: 'Indisponível', icon: '?' });
  });
});
