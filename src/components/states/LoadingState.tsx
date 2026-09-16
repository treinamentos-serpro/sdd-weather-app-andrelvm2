export default function LoadingState() {
  return (
    <section
      aria-live="polite"
      className="border border-white/10 bg-white/5 p-6 text-center text-white shadow-glass backdrop-blur-md"
      role="status"
    >
      <p className="font-semibold">Carregando informações meteorológicas...</p>
    </section>
  );
}
