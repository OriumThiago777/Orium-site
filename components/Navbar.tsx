"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const whatsappLink = "https://wa.me/5531999352065";

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
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

          <a href="#contato" className="hover:text-orange-500 transition">
            Contato
          </a>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex border border-orange-500/40 text-orange-500 hover:bg-orange-500 hover:text-black px-5 py-2 rounded-full transition font-semibold text-sm"
        >
          Falar agora
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden border border-zinc-700 text-zinc-200 px-4 py-2 rounded-full text-sm"
        >
          {menuOpen ? "Fechar" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black px-5 py-6">
          <div className="flex flex-col gap-5 text-zinc-300 text-sm font-medium">
            <a
              href="#inicio"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Início
            </a>

            <a
              href="#servicos"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Serviços
            </a>

            <a
              href="#projetos"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Projetos
            </a>

            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Contato
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-orange-500 text-black px-5 py-3 rounded-2xl text-center font-semibold"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}