export default function StatsStrip() {
  const items = [
    "Estratégia antes da execução",
    "Presença digital com percepção",
    "Branding, conteúdo e estrutura",
    "Tecnologia aplicada ao negócio",
  ];

  return (
    <section className="border-t border-zinc-900 bg-black py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-8 lg:px-16">
        {items.map((text, i) => (
          <div key={text} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <p className="text-2xl font-black text-orange-500">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-[0.9rem] leading-[1.55] text-zinc-400">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
