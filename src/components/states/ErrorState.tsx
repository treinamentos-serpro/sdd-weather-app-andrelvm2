interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      aria-labelledby="error-state-title"
      className="border border-red-300/30 bg-red-950/30 p-6 text-center text-white shadow-glass backdrop-blur-md"
      role="alert"
    >
      <h2 className="text-xl font-bold" id="error-state-title">
        Não foi possível consultar o clima
      </h2>
      <p className="mt-2 text-slate-200">{message}</p>
      <button
        className="mt-5 bg-accent-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </section>
  );
}
