import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import ProcessStep from "../components/ProcessStep";
import StatsStrip from "../components/StatsStrip";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Home() {
  const whatsappLink = "https://wa.me/5531999352065";
  const diagnosticWhatsappLink = `${whatsappLink}?text=${encodeURIComponent("Olá, quero solicitar um diagnóstico digital para minha marca.")}`;

  const primaryButton =
    "bg-orange-500 text-black px-8 py-4 rounded-2xl font-bold transition duration-300 text-center hover:bg-orange-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/20";

  const secondaryButton =
    "border border-zinc-700 text-white px-8 py-4 rounded-2xl font-semibold transition duration-300 text-center hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1 hover:bg-orange-500/5";

  return (
    <>
      <Navbar />

      <main
        id="inicio"
        className="relative overflow-hidden min-h-screen bg-black text-white flex items-center pt-24 md:pt-32 pb-12 md:pb-16"
      >
        <div className="absolute top-[-220px] right-[-160px] w-[420px] md:w-[520px] h-[420px] md:h-[520px] bg-orange-500/20 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-260px] left-[-180px] w-[360px] md:w-[460px] h-[360px] md:h-[460px] bg-orange-500/10 blur-[130px] rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-3xl">
              <p className="text-orange-500 font-semibold mb-4 tracking-widest uppercase text-sm md:text-base">
                Estruturação Digital
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-5 md:mb-6">
                Seu negócio vale mais do que parece.
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg md:text-xl mb-8 md:mb-10 leading-relaxed">
                A ORIUM estrutura como você se apresenta — posicionamento,
                presença e percepção de valor, do Instagram ao site.
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

      <Reveal>
        <section
          id="servicos"
          className="bg-black text-white py-20 md:py-32 border-t border-zinc-900 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                Serviços
              </p>
              <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
                Soluções integradas para empresas que querem crescer com clareza.
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
      </Reveal>

      <Reveal delay={0.1}>
        <section className="relative overflow-hidden bg-zinc-950 text-white py-20 md:py-32 border-t border-zinc-900">
          <div className="absolute top-[-180px] left-[-160px] w-[360px] md:w-[420px] h-[360px] md:h-[420px] bg-orange-500/10 blur-[120px] rounded-full"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                  Diferencial
                </p>

                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                  Não entregamos só conteúdo. Estruturamos sua presença digital
                  de ponta a ponta.
                </h2>

                <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                  A ORIUM organiza posicionamento, comunicação e ativos digitais
                  para sua empresa transmitir valor, gerar confiança e vender
                  com consistência.
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
                  Como sua marca é percebida define quem ela atrai — e quanto cobra.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">Percepção premium</h3>
                <p className="text-zinc-400">
                  Design, linguagem e presença alinhados ao valor real do que você entrega.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">Operação digital</h3>
                <p className="text-zinc-400">
                  Estruturas e automações para você operar com método, não no improviso.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/70 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">
                  Crescimento sustentável
                </h3>

                <p className="text-zinc-400">
                  Presença construída para gerar continuidade — não picos que somem em duas semanas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2}>
        <section className="bg-black text-white py-20 md:py-32 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="mb-12 md:mb-16 max-w-3xl">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                Processo
              </p>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Um processo claro para transformar presença digital em resultado
                comercial consistente.
              </h2>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Antes de executar, alinhamos estratégia, mensagem e operação
                para cada entrega cumprir uma função comercial real.
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
                title="Diagnóstico antes de qualquer post."
                description="Entendemos onde sua marca está e o que está travando sua presença antes de propor qualquer solução."
              />

              <ProcessStep
                number="2"
                title="Percepção é estratégia."
                description="A forma como você aparece define o quanto as pessoas confiam — e quanto estão dispostas a pagar."
              />

              <ProcessStep
                number="3"
                title="Estrutura que sustenta crescimento."
                description="Branding, conteúdo e presença digital organizados para funcionar de forma consistente, não pontual."
              />

              <ProcessStep
                number="4"
                title="Tecnologia a serviço do negócio."
                description="Automações, sites e sistemas que reduzem fricção operacional e aumentam capacidade de atendimento."
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.3}>
        <section
          id="projetos"
          className="relative overflow-hidden bg-black text-white py-20 md:py-32 border-t border-zinc-900 scroll-mt-24"
        >
          <div className="absolute right-[-180px] top-[-220px] h-[380px] md:h-[460px] w-[380px] md:w-[460px] rounded-full bg-orange-500/10 blur-[130px]"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                  Projetos
                </p>

              <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
                  Projetos reais com foco em percepção, autoridade e geração de
                  demanda.
              </h2>
              </div>

              <p className="text-zinc-400 max-w-md leading-relaxed">
                Cada projeto mostra como a ORIUM transforma presença digital em
                posicionamento claro e resultado comercial.
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
                    Reestruturação completa da presença digital: identidade visual, perfil do Instagram, destaques, comunicação e planejamento mensal de conteúdo. Resultado: presença mais profissional, comunicação clara e consistência na publicação.
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
                    Posicionamento digital para autoridade profissional na área de saúde e educação. Organização de perfil, identidade visual, linguagem e comunicação para cursos, palestras e treinamentos.
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
      </Reveal>


      <Reveal delay={0.35}>
        <section
          id="diagnostico"
          className="relative overflow-hidden bg-black text-white py-20 md:py-32 border-t border-zinc-900"
        >
          <div className="absolute left-[-160px] bottom-[-200px] h-[360px] md:h-[420px] w-[360px] md:w-[420px] rounded-full bg-orange-500/10 blur-[120px]"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
            <div className="max-w-3xl mb-12 md:mb-16">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                DIAGNÓSTICO DIGITAL
              </p>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Antes de produzir conteúdo, avaliamos a estrutura da sua marca.
              </h2>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                A ORIUM analisa presença digital, posicionamento, imagem e
                comunicação para identificar melhorias e organizar uma estrutura
                mais profissional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-7">
                <h3 className="text-xl font-bold mb-3">Presença visual</h3>
                <p className="text-zinc-400">Instagram, identidade e percepção da marca.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-7">
                <h3 className="text-xl font-bold mb-3">Comunicação</h3>
                <p className="text-zinc-400">Clareza da mensagem, oferta e posicionamento.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-7">
                <h3 className="text-xl font-bold mb-3">Estrutura digital</h3>
                <p className="text-zinc-400">Site, links, automações e jornada do cliente.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-7">
                <h3 className="text-xl font-bold mb-3">Próximos passos</h3>
                <p className="text-zinc-400">Plano inicial para organizar e fortalecer sua presença.</p>
              </div>
            </div>

            <a
              href={diagnosticWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${primaryButton} inline-flex`}
            >
              Solicitar diagnóstico
            </a>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.4}>
        <section className="relative overflow-hidden bg-zinc-950 text-white py-16 md:py-20 border-t border-zinc-900">
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
            <div className="max-w-3xl mb-10 md:mb-12">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                COMO FUNCIONA
              </p>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
                Como funciona o diagnóstico?
              </h2>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Um processo direto para entender sua presença atual e identificar
                caminhos práticos de melhoria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <p className="text-orange-500 text-sm font-semibold mb-3">01</p>
                <h3 className="text-lg md:text-xl font-bold mb-2">Primeiro contato</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Entendemos seu negócio, momento atual e principais objetivos antes de qualquer análise.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <p className="text-orange-500 text-sm font-semibold mb-3">02</p>
                <h3 className="text-lg md:text-xl font-bold mb-2">Analisamos sua presença digital</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Observamos Instagram, identidade, comunicação, site, links e jornada do cliente.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <p className="text-orange-500 text-sm font-semibold mb-3">03</p>
                <h3 className="text-lg md:text-xl font-bold mb-2">Indicamos pontos de melhoria</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Mostramos onde sua marca pode ficar mais clara, profissional e
                  preparada para vender.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <p className="text-orange-500 text-sm font-semibold mb-3">04</p>
                <h3 className="text-lg md:text-xl font-bold mb-2">Se fizer sentido, montamos uma proposta</h3>
                <p className="text-zinc-400 leading-relaxed">
                  A ORIUM apresenta um plano de trabalho alinhado ao momento da
                  sua marca.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>


      <Reveal delay={0.43}>
        <section className="bg-zinc-950 text-white py-16 md:py-20 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="max-w-3xl mb-10 md:mb-12">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
                DÚVIDAS FREQUENTES
              </p>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Antes de falar com a ORIUM, vale esclarecer:
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-5">
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">1. O diagnóstico é gratuito?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Sim. É uma conversa inicial para entender o momento da sua
                  marca e mapear oportunidades de melhoria.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">2. A ORIUM faz apenas posts para Instagram?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Não. A ORIUM trabalha com estrutura digital: posicionamento, branding, conteúdo, sites, automações e presença profissional.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">3. Vocês atendem apenas negócios locais?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  O foco principal são negócios locais, profissionais e marcas
                  em crescimento que precisam de mais organização e confiança no
                  digital.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">4. Depois do diagnóstico eu sou obrigado a contratar?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Não. O diagnóstico serve para entender o cenário. Se fizer sentido para os dois lados, a ORIUM apresenta uma proposta.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">5. A ORIUM cria site também?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Sim. Criamos landing pages, sites institucionais e estruturas digitais focadas em presença profissional e conversão.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.45}>
        <section
          id="contato"
          className="relative overflow-hidden bg-zinc-950 text-white py-16 md:py-32 border-t border-zinc-900 scroll-mt-24"
        >
          <div className="absolute inset-0">
            <Image
              src="/cta.jpg"
              alt="CTA ORIUM"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="absolute top-[-220px] left-1/2 h-[360px] md:h-[420px] w-[360px] md:w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center">
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">
              Vamos construir sua presença digital
            </p>

            <h2 className="text-3xl md:text-6xl font-bold leading-tight mb-8">
              Sua marca pode operar com mais clareza, valor percebido e
              consistência comercial.
            </h2>

            <p className="text-zinc-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Estruturamos sua presença digital de ponta a ponta para atrair os
              clientes certos, comunicar melhor e vender com consistência.
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
      </Reveal>

      <footer className="bg-black border-t border-zinc-900 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-orange-500 text-xl md:text-2xl font-bold mb-4">ORIUM</h3>
              <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto md:mx-0">
                Negócios bons merecem parecer tão bons quanto são.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <nav className="flex flex-col gap-3 text-zinc-400">
                <a href="#inicio" className="hover:text-orange-500 transition">Início</a>
                <a href="#servicos" className="hover:text-orange-500 transition">Serviços</a>
                <a href="#projetos" className="hover:text-orange-500 transition">Projetos</a>
                <a href="#diagnostico" className="hover:text-orange-500 transition">Diagnóstico</a>
                <a href="#contato" className="hover:text-orange-500 transition">Contato</a>
              </nav>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="flex flex-col gap-3 text-zinc-400">
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
                <p className="text-zinc-500">Belo Horizonte - MG</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-900 text-center">
            <p className="text-sm text-zinc-500">© 2026 ORIUM. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
