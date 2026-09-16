export default function EmptyState() {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="border border-white/10 bg-white/5 p-6 text-center text-white shadow-glass backdrop-blur-md"
    >
      <h2 className="text-xl font-bold" id="empty-state-title">
        Nenhuma cidade encontrada
      </h2>
      <p className="mt-2 text-slate-200">Verifique o nome informado e tente pesquisar novamente.</p>
    </section>
  );
}
