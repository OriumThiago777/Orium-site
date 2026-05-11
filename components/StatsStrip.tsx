export default function StatsStrip() {
  return (
    <section className="border-t border-zinc-900 bg-black py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <p className="text-2xl font-black text-orange-500">01</p>
          <p className="mt-2 text-sm text-zinc-400">
            Estratégia antes da execução
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <p className="text-2xl font-black text-orange-500">02</p>
          <p className="mt-2 text-sm text-zinc-400">
            Presença digital com percepção
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <p className="text-2xl font-black text-orange-500">03</p>
          <p className="mt-2 text-sm text-zinc-400">
            Branding, conteúdo e estrutura
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <p className="text-2xl font-black text-orange-500">04</p>
          <p className="mt-2 text-sm text-zinc-400">
            Tecnologia aplicada ao negócio
          </p>
        </div>
      </div>
    </section>
  );
}