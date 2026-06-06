import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import ProcessStep from "../components/ProcessStep";
import StatsStrip from "../components/StatsStrip";
import Navbar from "../components/Navbar";
import CTALink from "../components/CTALink";
import Image from "next/image";

export default function Home() {
  const whatsappLink = "https://wa.me/5531999352065";
  const diagnosticWhatsappLink = `${whatsappLink}?text=${encodeURIComponent("Olá, quero solicitar um diagnóstico digital para minha marca.")}`;

  const primaryButton =
    "w-full sm:w-auto bg-orange-500 text-black px-8 py-4 rounded-2xl font-bold transition duration-300 text-center md:hover:bg-orange-400 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:shadow-orange-500/20";

  const secondaryButton =
    "w-full sm:w-auto border border-zinc-700 text-white px-8 py-4 rounded-2xl font-semibold transition duration-300 text-center md:hover:border-orange-500 md:hover:text-orange-500 md:hover:-translate-y-1 md:hover:bg-orange-500/5";

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <main
        id="inicio"
        className="relative w-full overflow-hidden h-[75vh] min-h-[480px]"
      >
        <Image
          src="/hero.jpg"
          alt="Ambiente criativo ORIUM"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay principal: escuro na esquerda → transparente */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,8,8,0.93) 0%, rgba(8,8,8,0.70) 40%, rgba(8,8,8,0.20) 65%, transparent 100%)",
          }}
        />
        {/* Vinheta inferior */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,8,0.55) 0%, transparent 40%)",
          }}
        />

        <div className="relative z-10 h-full flex items-center pt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
            <div className="max-w-2xl">
              <p className="text-orange-500 font-semibold mb-4 tracking-widest uppercase text-[0.95rem]">
                Estruturação Digital
              </p>

              <h1
                className="font-bold leading-tight mb-5 md:mb-6 text-white"
                style={{ fontSize: "clamp(2rem, 7vw, 5rem)" }}
              >
                Seu negócio vale mais do que parece.
              </h1>

              <p className="text-zinc-300 text-[0.95rem] sm:text-lg md:text-xl mb-8 md:mb-10 leading-[1.6]">
                A ORIUM estrutura como você se apresenta — posicionamento,
                presença e percepção de valor, do Instagram ao site.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <CTALink
                  href={whatsappLink}
                  className={primaryButton}
                  label="hero-falar-com-orium"
                >
                  Falar com a ORIUM
                </CTALink>
                <a href="#projetos" className={secondaryButton}>
                  Ver Projetos
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StatsStrip />

      {/* ── SERVIÇOS ──────────────────────────────────────────────────────── */}
      <Reveal>
        <section
          id="servicos"
          className="bg-black text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="mb-12 md:mb-16">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                Serviços
              </p>
              <h2
                className="font-bold max-w-2xl leading-tight"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                Soluções integradas para empresas que querem crescer com clareza.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

      {/* ── DIFERENCIAL ───────────────────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <section className="relative overflow-hidden bg-zinc-950 text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900">
          <div className="absolute top-[-180px] left-[-160px] w-[360px] md:w-[420px] h-[360px] md:h-[420px] bg-orange-500/10 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                  Diferencial
                </p>
                <h2
                  className="font-bold leading-tight mb-6"
                  style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
                >
                  Não entregamos só conteúdo. Estruturamos sua presença digital
                  de ponta a ponta.
                </h2>
                <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
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
              {[
                {
                  title: "Posicionamento",
                  text: "Como sua marca é percebida define quem ela atrai — e quanto cobra.",
                },
                {
                  title: "Percepção premium",
                  text: "Design, linguagem e presença alinhados ao valor real do que você entrega.",
                },
                {
                  title: "Operação digital",
                  text: "Estruturas e automações para você operar com método, não no improviso.",
                },
                {
                  title: "Crescimento sustentável",
                  text: "Presença construída para gerar continuidade — não picos que somem em duas semanas.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-800 bg-black/70 p-5 md:p-6 backdrop-blur-sm"
                >
                  <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── PROCESSO ──────────────────────────────────────────────────────── */}
      <Reveal delay={0.2}>
        <section className="bg-black text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="mb-12 md:mb-16 max-w-3xl">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                Processo
              </p>
              <h2
                className="font-bold leading-tight mb-6"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                Um processo claro para transformar presença digital em resultado
                comercial consistente.
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* ── PROJETOS ──────────────────────────────────────────────────────── */}
      <Reveal delay={0.3}>
        <section
          id="projetos"
          className="relative overflow-hidden bg-black text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900 scroll-mt-24"
        >
          <div className="absolute right-[-180px] top-[-220px] h-[380px] md:h-[460px] w-[380px] md:w-[460px] rounded-full bg-orange-500/10 blur-[130px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                  Projetos
                </p>
                <h2
                  className="font-bold max-w-2xl leading-tight"
                  style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
                >
                  Projetos reais com foco em percepção, autoridade e geração de
                  demanda.
                </h2>
              </div>
              <p className="text-zinc-400 max-w-md leading-[1.6] text-[0.95rem]">
                Cada projeto mostra como a ORIUM transforma presença digital em
                posicionamento claro e resultado comercial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Altemans */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 transition duration-300 md:hover:-translate-y-2 md:hover:border-orange-500/70 md:hover:shadow-2xl md:hover:shadow-orange-500/10">
                <div className="absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-orange-500/0 blur-3xl transition duration-300 group-hover:bg-orange-500/10" />
                <div className="relative z-10">
                  <div className="relative mb-8 h-[200px] md:h-44 rounded-2xl border border-zinc-800 overflow-hidden">
                    <Image
                      src="/altemans.jpg"
                      alt="Projeto Altemans Barbearia"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <p className="text-orange-500 text-[0.95rem] uppercase tracking-widest font-semibold mb-4">
                    Barbearia
                  </p>
                  <h3
                    className="font-bold mb-4"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
                  >
                    Altemans Barbearia
                  </h3>
                  <p className="text-zinc-400 leading-[1.6] mb-8 text-[0.95rem]">
                    Reestruturação completa da presença digital: identidade
                    visual, perfil do Instagram, destaques, comunicação e
                    planejamento mensal de conteúdo. Resultado: presença mais
                    profissional, comunicação clara e consistência na publicação.
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
                    <CTALink
                      href={whatsappLink}
                      className={primaryButton}
                      label="projetos-altemans"
                    >
                      Quero algo parecido
                    </CTALink>
                  </div>
                </div>
              </div>

              {/* Prof. Marcelo */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 transition duration-300 md:hover:-translate-y-2 md:hover:border-orange-500/70 md:hover:shadow-2xl md:hover:shadow-orange-500/10">
                <div className="absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-orange-500/0 blur-3xl transition duration-300 group-hover:bg-orange-500/10" />
                <div className="relative z-10">
                  <div className="relative mb-8 h-[200px] md:h-44 rounded-2xl border border-zinc-800 overflow-hidden">
                    <Image
                      src="/marcelo.jpg"
                      alt="Projeto Prof. Marcelo Félix"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <p className="text-orange-500 text-[0.95rem] uppercase tracking-widest font-semibold mb-4">
                    Saúde e educação
                  </p>
                  <h3
                    className="font-bold mb-4"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
                  >
                    Prof. Marcelo Félix
                  </h3>
                  <p className="text-zinc-400 leading-[1.6] mb-8 text-[0.95rem]">
                    Posicionamento digital para autoridade profissional na área
                    de saúde e educação. Organização de perfil, identidade
                    visual, linguagem e comunicação para cursos, palestras e
                    treinamentos.
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
                    <CTALink
                      href={whatsappLink}
                      className={primaryButton}
                      label="projetos-marcelo"
                    >
                      Quero algo parecido
                    </CTALink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── DIAGNÓSTICO ───────────────────────────────────────────────────── */}
      <Reveal delay={0.35}>
        <section
          id="diagnostico"
          className="relative overflow-hidden bg-black text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900"
        >
          <div className="absolute left-[-160px] bottom-[-200px] h-[360px] md:h-[420px] w-[360px] md:w-[420px] rounded-full bg-orange-500/10 blur-[120px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mb-12 md:mb-16">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                DIAGNÓSTICO DIGITAL
              </p>
              <h2
                className="font-bold leading-tight mb-6"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                Antes de produzir conteúdo, avaliamos a estrutura da sua marca.
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
                A ORIUM analisa presença digital, posicionamento, imagem e
                comunicação para identificar melhorias e organizar uma estrutura
                mais profissional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
              {[
                { title: "Presença visual", text: "Instagram, identidade e percepção da marca." },
                { title: "Comunicação", text: "Clareza da mensagem, oferta e posicionamento." },
                { title: "Estrutura digital", text: "Site, links, automações e jornada do cliente." },
                { title: "Próximos passos", text: "Plano inicial para organizar e fortalecer sua presença." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 md:p-7"
                >
                  <h3 className="text-lg md:text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">{item.text}</p>
                </div>
              ))}
            </div>

            <CTALink
              href={diagnosticWhatsappLink}
              className={primaryButton}
              label="diagnostico-solicitar"
            >
              Solicitar diagnóstico
            </CTALink>
          </div>
        </section>
      </Reveal>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────────── */}
      <Reveal delay={0.4}>
        <section className="relative overflow-hidden bg-zinc-950 text-white py-16 md:py-20 lg:py-24 border-t border-zinc-900">
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mb-10 md:mb-12">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                COMO FUNCIONA
              </p>
              <h2
                className="font-bold leading-tight mb-5"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                Como funciona o diagnóstico?
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
                Um processo direto para entender sua presença atual e identificar
                caminhos práticos de melhoria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { n: "01", title: "Primeiro contato", text: "Entendemos seu negócio, momento atual e principais objetivos antes de qualquer análise." },
                { n: "02", title: "Analisamos sua presença digital", text: "Observamos Instagram, identidade, comunicação, site, links e jornada do cliente." },
                { n: "03", title: "Indicamos pontos de melhoria", text: "Mostramos onde sua marca pode ficar mais clara, profissional e preparada para vender." },
                { n: "04", title: "Se fizer sentido, montamos uma proposta", text: "A ORIUM apresenta um plano de trabalho alinhado ao momento da sua marca." },
              ].map((item) => (
                <div key={item.n} className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                  <p className="text-orange-500 text-sm font-semibold mb-3">{item.n}</p>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── DÚVIDAS ───────────────────────────────────────────────────────── */}
      <Reveal delay={0.43}>
        <section className="bg-zinc-950 text-white py-16 md:py-20 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mb-10 md:mb-12">
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
                DÚVIDAS FREQUENTES
              </p>
              <h2
                className="font-bold leading-tight"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                Antes de falar com a ORIUM, vale esclarecer:
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {[
                { q: "1. O diagnóstico é gratuito?", a: "Sim. É uma conversa inicial para entender o momento da sua marca e mapear oportunidades de melhoria." },
                { q: "2. A ORIUM faz apenas posts para Instagram?", a: "Não. A ORIUM trabalha com estrutura digital: posicionamento, branding, conteúdo, sites, automações e presença profissional." },
                { q: "3. Vocês atendem apenas negócios locais?", a: "O foco principal são negócios locais, profissionais e marcas em crescimento que precisam de mais organização e confiança no digital." },
                { q: "4. Depois do diagnóstico eu sou obrigado a contratar?", a: "Não. O diagnóstico serve para entender o cenário. Se fizer sentido para os dois lados, a ORIUM apresenta uma proposta." },
                { q: "5. A ORIUM cria site também?", a: "Sim. Criamos landing pages, sites institucionais e estruturas digitais focadas em presença profissional e conversão." },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-zinc-800 bg-black/40 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{item.q}</h3>
                  <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <Reveal delay={0.45}>
        <section
          id="contato"
          className="relative overflow-hidden bg-zinc-950 text-white py-16 md:py-24 lg:py-32 border-t border-zinc-900 scroll-mt-24"
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
          <div className="absolute top-[-220px] left-1/2 h-[360px] md:h-[420px] w-[360px] md:w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-4 text-[0.95rem]">
              Vamos construir sua presença digital
            </p>
            <h2
              className="font-bold leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
            >
              Sua marca pode operar com mais clareza, valor percebido e
              consistência comercial.
            </h2>
            <p className="text-zinc-400 text-base md:text-xl leading-[1.6] max-w-3xl mx-auto mb-8">
              Estruturamos sua presença digital de ponta a ponta para atrair os
              clientes certos, comunicar melhor e vender com consistência.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <CTALink
                href={whatsappLink}
                className={primaryButton}
                label="cta-final-falar-whatsapp"
              >
                Falar no WhatsApp
              </CTALink>
              <a href="#projetos" className={secondaryButton}>
                Ver Projetos
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-black border-t border-zinc-900 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-orange-500 text-xl md:text-2xl font-bold mb-4">ORIUM</h3>
              <p className="text-zinc-400 leading-[1.6] text-[0.95rem] max-w-sm mx-auto md:mx-0">
                Negócios bons merecem parecer tão bons quanto são.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <nav className="flex flex-col gap-3 text-zinc-400 text-[0.95rem]">
                <a href="#inicio" className="md:hover:text-orange-500 transition">Início</a>
                <a href="#servicos" className="md:hover:text-orange-500 transition">Serviços</a>
                <a href="#projetos" className="md:hover:text-orange-500 transition">Projetos</a>
                <a href="#diagnostico" className="md:hover:text-orange-500 transition">Diagnóstico</a>
                <a href="#contato" className="md:hover:text-orange-500 transition">Contato</a>
              </nav>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="flex flex-col gap-3 text-zinc-400 text-[0.95rem]">
                <a
                  href="https://www.instagram.com/orium.agc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:hover:text-orange-500 transition"
                >
                  Instagram
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:hover:text-orange-500 transition"
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
    </div>
  );
}
