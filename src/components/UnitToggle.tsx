import { type KeyboardEvent, useRef } from 'react';

type Unit = 'celsius' | 'fahrenheit';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const units: Unit[] = ['celsius', 'fahrenheit'];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const celsiusButtonRef = useRef<HTMLButtonElement>(null);
  const fahrenheitButtonRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentUnit: Unit) {
    const currentIndex = units.indexOf(currentUnit);
    let nextUnit: Unit | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextUnit = units[(currentIndex + 1) % units.length];
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextUnit = units[(currentIndex - 1 + units.length) % units.length];
    }

    if (event.key === 'Home') {
      nextUnit = units[0];
    }

    if (event.key === 'End') {
      nextUnit = units[units.length - 1];
    }

    if (!nextUnit) {
      return;
    }

    event.preventDefault();
    onChange(nextUnit);

    if (nextUnit === 'celsius') {
      celsiusButtonRef.current?.focus();
      return;
    }

    fahrenheitButtonRef.current?.focus();
  }

  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
      role="group"
    >
      <button
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        className="min-h-11 min-w-12 px-3 py-2 font-semibold text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 aria-pressed:bg-accent-500 aria-pressed:text-white aria-pressed:hover:bg-accent-400"
        onClick={() => onChange('celsius')}
        onKeyDown={(event) => handleKeyDown(event, 'celsius')}
        ref={celsiusButtonRef}
        type="button"
      >
        °C
      </button>
      <button
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        className="min-h-11 min-w-12 px-3 py-2 font-semibold text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 aria-pressed:bg-accent-500 aria-pressed:text-white aria-pressed:hover:bg-accent-400"
        onClick={() => onChange('fahrenheit')}
        onKeyDown={(event) => handleKeyDown(event, 'fahrenheit')}
        ref={fahrenheitButtonRef}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
