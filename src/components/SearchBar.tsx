import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled: boolean;
}

export default function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = query.trim();

    if (!city) {
      return;
    }

    onSearch(city);
  }

  return (
    <form
      className="border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:p-5"
      onSubmit={handleSubmit}
      role="search"
    >
      <label className="sr-only" htmlFor="city-search">
        Pesquisar localidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="min-w-0 flex-1 border border-white/10 bg-night-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id="city-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite uma cidade ou localidade"
          type="search"
          value={query}
        />
        <button
          className="bg-accent-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          type="submit"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
