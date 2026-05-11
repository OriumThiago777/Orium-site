export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        <h1 className="text-orange-500 text-2xl font-black">
          ORIUM
        </h1>

        <div className="hidden md:flex items-center gap-8 text-zinc-300 text-sm font-medium">
          <a href="#" className="hover:text-orange-500 transition">
            Início
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Serviços
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Projetos
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Contato
          </a>
        </div>

        <button className="border border-orange-500/40 text-orange-500 hover:bg-orange-500 hover:text-black px-5 py-2 rounded-full transition font-semibold text-sm">
          Falar agora
        </button>
      </nav>
    </header>
  );
}