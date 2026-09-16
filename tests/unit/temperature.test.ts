import { describe, expect, it } from 'vitest';
import { displayTemperature } from '../../src/lib/temperature';

describe('displayTemperature', () => {
  it('converte 0 °C para 32 °F', () => {
    expect(displayTemperature(0, 'fahrenheit')).toBe(32);
  });

  it('converte 100 °C para 212 °F', () => {
    expect(displayTemperature(100, 'fahrenheit')).toBe(212);
  });

  it('converte -40 °C para -40 °F', () => {
    expect(displayTemperature(-40, 'fahrenheit')).toBe(-40);
  });

  it('mantém o valor em Celsius e converte para Fahrenheit conforme a unidade', () => {
    expect(displayTemperature(25, 'celsius')).toBe(25);
    expect(displayTemperature(25, 'fahrenheit')).toBe(77);
  });

  it('arredonda o resultado para o inteiro mais próximo', () => {
    expect(displayTemperature(20.1, 'fahrenheit')).toBe(68);
    expect(displayTemperature(20.6, 'fahrenheit')).toBe(69);
  });

  it('retorna null quando a temperatura de origem é null', () => {
    expect(displayTemperature(null, 'celsius')).toBeNull();
    expect(displayTemperature(null, 'fahrenheit')).toBeNull();
  });
});
