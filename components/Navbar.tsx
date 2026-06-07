"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openContactModal"));
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-5 py-3 md:py-3.5 flex items-center justify-between">
        <a href="#inicio" className="flex items-center">
          <Image
            src="/lgdc.png"
            alt="ORIUM"
            width={160}
            height={48}
            priority
            className="h-10 md:h-11 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-8 text-zinc-300 text-sm font-medium">
          <a href="#inicio" className="hover:text-orange-500 transition">
            Início
          </a>

          <a href="#servicos" className="hover:text-orange-500 transition">
            Serviços
          </a>

          <a href="#projetos" className="hover:text-orange-500 transition">
            Projetos
          </a>

          <a href="#diagnostico" className="hover:text-orange-500 transition">
            Diagnóstico
          </a>

          <a href="#contato" className="hover:text-orange-500 transition">
            Contato
          </a>
        </div>

        <a
          href="#"
          onClick={handleCTAClick}
          className="hidden md:inline-flex border border-orange-500/40 text-orange-500 hover:bg-orange-500 hover:text-black px-5 py-2 rounded-full transition font-semibold text-sm"
        >
          Falar agora
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden border border-zinc-700/90 bg-zinc-950/70 text-zinc-100 px-4 py-2 rounded-full text-sm transition hover:border-orange-500/60 hover:text-orange-400"
        >
          {menuOpen ? "Fechar" : "Menu"}
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <div className="flex flex-col gap-2 text-zinc-200 text-base font-medium">
            <a
              href="#inicio"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-zinc-900 hover:text-orange-400 transition"
            >
              Início
            </a>

            <a
              href="#servicos"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-zinc-900 hover:text-orange-400 transition"
            >
              Serviços
            </a>

            <a
              href="#projetos"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-zinc-900 hover:text-orange-400 transition"
            >
              Projetos
            </a>

            <a
              href="#diagnostico"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-zinc-900 hover:text-orange-400 transition"
            >
              Diagnóstico
            </a>

            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-zinc-900 hover:text-orange-400 transition"
            >
              Contato
            </a>
            </div>

            <a
              href="#"
              onClick={(e) => {
                handleCTAClick(e);
                setMenuOpen(false);
              }}
              className="mt-4 block bg-orange-500 text-black px-5 py-3 rounded-2xl text-center font-semibold transition hover:bg-orange-400"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
