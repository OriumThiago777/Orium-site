import ServiceCard from "../components/ServiceCard";
import ProcessStep from "../components/ProcessStep";
import StatsStrip from "../components/StatsStrip";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Home() {
  const whatsappLink = "https://wa.me/5531999352065";

  const primaryButton =
    "bg-orange-500 text-black px-8 py-4 rounded-2xl font-bold transition duration-300 text-center hover:bg-orange-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/20";

  const secondaryButton =
    "border border-zinc-700 text-white px-8 py-4 rounded-2xl font-semibold transition duration-300 text-center hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1 hover:bg-orange-500/5";

  return (
    <>
      <Navbar />

      <main
        id="inicio"
        className="relative overflow-hidden min-h-screen bg-black text-white flex items-center pt-28 md:pt-32 pb-16"
      >
        <div className="absolute top-[-220px] right-[-160px] w-[420px] md:w-[520px] h-[420px] md:h-[520px] bg-orange-500/20 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-260px] left-[-180px] w-[360px] md:w-[460px] h-[360px] md:h-[460px] bg-orange-500/10 blur-[130px] rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-3xl">
            <p className="text-orange-500 font-semibold mb-4 tracking-widest uppercase text-sm md:text-base">
              Estruturação Digital
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transformamos negócios locais em marcas com estrutura digital e presença que vende.
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl mb-10 leading-relaxed">
              Não é só sobre postar. É sobre posicionar, organizar e escalar a
              presença digital com branding, conteúdo, sites e automação.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
              >
                Falar com a ORIUM
              </a>

              <a href="#projetos" className={secondaryButton}>
                Ver Projetos
              </a>
            </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative h-[460px] rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl shadow-orange-500/10">
                <Image
                  src="/hero.jpg"
                  alt="Ambiente criativo ORIUM"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-orange-500/10" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <StatsStrip />

      <section
        id="servicos"
        className="bg-black text-white py-24 md:py-32 border-t border-zinc-900 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 md:mb-16">
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
              Serviços
            </p>

            <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
              Soluções integradas para empresas que querem crescer com método.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ServiceCard
              title="Branding"
              description="Construção de posicionamento, identidade visual e percepção premium para marcas locais."
            />

            <ServiceCard
              title="Sites"
              description="Landing pages e estruturas digitais modernas focadas em conversão e presença profissional."
            />

            <ServiceCard
              title="Automação"
              description="Sistemas, formulários, integrações e automações para aumentar capacidade operacional."
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 text-white py-24 md:py-32 border-t border-zinc-900">
        <div className="absolute top-[-180px] left-[-160px] w-[360px] md:w-[420px] h-[360px] md:h-[420px] bg-orange-500/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8">
            <div>
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
              Diferencial
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              Não entregamos só conteúdo. Construímos uma operação digital completa.
            </h2>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              A ORIUM organiza posicionamento, comunicação e ativos digitais
              para sua empresa parecer mais profissional, gerar confiança e
              converter com consistência.
            </p>
            </div>

            <div className="relative h-56 md:h-64 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl shadow-orange-500/10">
              <Image
                src="/estrategia.jpg"
                alt="Estratégia digital ORIUM"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">Posicionamento</h3>
              <p className="text-zinc-400">
                Clareza sobre como a marca deve ser percebida pelo público.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">Percepção premium</h3>
              <p className="text-zinc-400">
                Design, linguagem e presença visual alinhados a valor.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">Operação digital</h3>
              <p className="text-zinc-400">
                Estruturas, páginas e automações para reduzir improviso.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">
                Crescimento sustentável
              </h3>

              <p className="text-zinc-400">
                Presença digital pensada para gerar continuidade, não apenas
                volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-24 md:py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 md:mb-16 max-w-3xl">
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
              Processo
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              Um processo claro para transformar presença digital em crescimento previsível.
            </h2>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Antes de executar, estruturamos estratégia, mensagem e operação
              para cada entrega ter função comercial real.
            </p>
          </div>

          <div className="relative mb-10 md:mb-12 h-44 md:h-56 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl shadow-orange-500/10">
            <Image
              src="/processo.jpg"
              alt="Processo ORIUM"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ProcessStep
              number="1"
              title="Diagnóstico"
              description="Entendemos o momento da marca, seus objetivos, posicionamento atual e principais gargalos digitais."
            />

            <ProcessStep
              number="2"
              title="Estratégia"
              description="Definimos a direção visual, narrativa, comunicação e prioridades para fortalecer a percepção da marca."
            />

            <ProcessStep
              number="3"
              title="Estrutura"
              description="Organizamos perfil, conteúdo, páginas, automações e materiais para criar uma presença mais profissional."
            />

            <ProcessStep
              number="4"
              title="Execução"
              description="Colocamos a estrutura em prática com entregas consistentes, ajustes e melhoria contínua."
            />
          </div>
        </div>
      </section>

      <section
        id="projetos"
        className="relative overflow-hidden bg-black text-white py-24 md:py-32 border-t border-zinc-900 scroll-mt-24"
      >
        <div className="absolute right-[-180px] top-[-220px] h-[380px] md:h-[460px] w-[380px] md:w-[460px] rounded-full bg-orange-500/10 blur-[130px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
            <div>
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                Projetos
              </p>

              <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
                Projetos reais com foco em percepção, autoridade e conversão.
              </h2>
            </div>

            <p className="text-zinc-400 max-w-md leading-relaxed">
              Cada projeto mostra como a ORIUM transforma presença digital em
              posicionamento forte e resultado comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 transition duration-300 hover:-translate-y-2 hover:border-orange-500/70 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-orange-500/0 blur-3xl transition duration-300 group-hover:bg-orange-500/10"></div>

              <div className="relative z-10">
                <div className="relative mb-8 h-44 rounded-2xl border border-zinc-800 overflow-hidden">
                  <Image
                    src="/altemans.jpg"
                    alt="Projeto Altemans Barbearia"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <p className="text-orange-500 text-sm uppercase tracking-widest font-semibold mb-4">
                  Barbearia
                </p>

                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Altemans Barbearia
                </h3>

                <p className="text-zinc-400 leading-relaxed mb-8">
                  Estruturação de Instagram, posts fixados, criativos, vídeos,
                  comunicação visual e presença digital para fortalecer percepção
                  e facilitar o contato com clientes.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Social Media
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Direção Visual
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Conteúdo
                  </span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.instagram.com/altemansbarbearia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={secondaryButton}
                  >
                    Ver Instagram
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryButton}
                  >
                    Quero algo parecido
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 transition duration-300 hover:-translate-y-2 hover:border-orange-500/70 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-orange-500/0 blur-3xl transition duration-300 group-hover:bg-orange-500/10"></div>

              <div className="relative z-10">
                <div className="relative mb-8 h-44 rounded-2xl border border-zinc-800 overflow-hidden">
                  <Image
                    src="/marcelo.jpg"
                    alt="Projeto Prof. Marcelo Félix"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <p className="text-orange-500 text-sm uppercase tracking-widest font-semibold mb-4">
                  Saúde e educação
                </p>

                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Prof. Marcelo Félix
                </h3>

                <p className="text-zinc-400 leading-relaxed mb-8">
                  Posicionamento digital para autoridade profissional,
                  organização de perfil, destaques, posts fixados, identidade
                  visual e comunicação para cursos, palestras e treinamentos.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Branding
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Autoridade
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-black/50 px-4 py-2 text-sm text-zinc-300">
                    Posicionamento
                  </span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.instagram.com/prof.marcelofelix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={secondaryButton}
                  >
                    Ver Instagram
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryButton}
                  >
                    Quero algo parecido
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contato"
        className="relative overflow-hidden bg-zinc-950 text-white py-20 md:py-32 border-t border-zinc-900 scroll-mt-24"
      >
        <div className="absolute inset-0">
          <Image src="/cta.jpg" alt="CTA ORIUM" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="absolute top-[-220px] left-1/2 h-[360px] md:h-[420px] w-[360px] md:w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center">
          <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
            Vamos construir sua presença digital
          </p>

          <h2 className="text-3xl md:text-6xl font-bold leading-tight mb-8">
            Sua marca pode operar em outro nível de percepção e resultado.
          </h2>

          <p className="text-zinc-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            Estruturamos sua presença digital de ponta a ponta para atrair,
            convencer e vender com mais consistência.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButton}
            >
              Falar no WhatsApp
            </a>

            <a href="#projetos" className={secondaryButton}>
              Ver Projetos
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black text-zinc-500 border-t border-zinc-900 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <h3 className="text-orange-500 text-xl font-bold">ORIUM</h3>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://www.instagram.com/orium.agc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              Instagram
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              WhatsApp
            </a>

            <a href="#contato" className="hover:text-orange-500 transition">
              Contato
            </a>
          </div>

          <p className="text-sm">
            © 2026 ORIUM. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
