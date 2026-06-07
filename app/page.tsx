import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import ProcessStep from "../components/ProcessStep";
import StatsStrip from "../components/StatsStrip";
import Navbar from "../components/Navbar";
import CTALink from "../components/CTALink";
import Image from "next/image";

const GRAIN =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E";

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          color: "#FF6B00",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  const whatsappLink = "https://wa.me/5531999352065";
  const diagnosticWhatsappLink = `${whatsappLink}?text=${encodeURIComponent("Olá, quero solicitar um diagnóstico digital para minha marca.")}`;

  const primaryButton =
    "w-full sm:w-auto bg-[#FF6B00] text-black px-8 py-4 font-bold transition-all duration-300 text-center hover:bg-[#cc5500] tracking-[0.08em]";

  const secondaryButton =
    "w-full sm:w-auto border border-[#333] text-white px-8 py-4 font-semibold transition-all duration-300 text-center hover:border-[#FF6B00] hover:text-[#FF6B00]";

  const heroPrimaryButton =
    "inline-flex items-center justify-center bg-[#FF6B00] text-black px-[28px] py-[12px] text-[0.85rem] font-semibold tracking-[0.04em] border-none transition-all duration-[250ms] ease-[ease] hover:bg-[#ff7d1a] hover:-translate-y-0.5 w-full sm:w-auto";

  const heroSecondaryButton =
    "inline-flex items-center justify-center bg-transparent text-white px-[28px] py-[12px] text-[0.85rem] font-medium tracking-[0.04em] border border-[#333] transition-all duration-[250ms] ease-[ease] hover:border-[#FF6B00] hover:text-[#FF6B00] w-full sm:w-auto";

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <main
        id="inicio"
        className="relative w-full overflow-hidden"
      >
        <Image
          src="/fotos/hero2.png"
          alt="Ambiente criativo ORIUM"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay com profundidade — escuro à esquerda, respiro à direita */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.85) 45%, rgba(8,8,8,0.5) 100%)",
            zIndex: 1,
          }}
        />
        {/* Vinheta inferior */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,8,0.55) 0%, transparent 40%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 pt-[140px] pb-[100px]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
            <div className="max-w-2xl">
              {/* Eyebrow refinado */}
              <div className="flex items-center" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.35em",
                    color: "#FF6B00",
                    textTransform: "uppercase",
                  }}
                >
                  Estruturação Digital
                </span>
              </div>

              <h1
                className="font-bold text-white"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  marginBottom: "2rem",
                }}
              >
                Seu negócio<br />
                vale mais<br />
                do que parece.
              </h1>

              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "#b0b0b0",
                  maxWidth: "480px",
                  marginBottom: "3rem",
                }}
              >
                A ORIUM estrutura como você se apresenta. Posicionamento,
                presença e percepção de valor. Do Instagram ao site.
              </p>

              <div
                className="relative z-10 flex flex-col sm:flex-row sm:items-center"
                style={{ gap: "1rem" }}
              >
                <CTALink
                  href={whatsappLink}
                  className={heroPrimaryButton}
                  label="hero-falar-com-orium"
                >
                  Falar com a ORIUM
                </CTALink>
                <a href="#projetos" className={heroSecondaryButton}>
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
          className="bg-[#080808] text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a] scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-[800px] mx-auto">
              <div className="mb-12 md:mb-16">
                <Eyebrow>Serviços</Eyebrow>
                <h2
                  className="font-bold max-w-2xl leading-tight"
                  style={{
                    fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                    fontFamily: "'Anton', sans-serif",
                  }}
                >
                  Soluções integradas para empresas que querem crescer com clareza.
                </h2>
              </div>

              <div className="border-t border-[#1a1a1a]">
                <ServiceCard
                  title="Branding"
                  description="Construção de posicionamento, identidade visual e percepção premium para marcas locais."
                  index={0}
                  icon="branding"
                />
                <ServiceCard
                  title="Sites"
                  description="Landing pages e estruturas digitais modernas focadas em conversão e presença profissional."
                  index={1}
                  icon="sites"
                />
                <ServiceCard
                  title="Automação"
                  description="Sistemas, formulários, integrações e automações para aumentar capacidade operacional."
                  index={2}
                  icon="automacao"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── DIFERENCIAL ───────────────────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <section
          className="relative overflow-hidden text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a]"
          style={{
            background: "#080808",
            backgroundImage: `url("${GRAIN}")`,
          }}
        >
          <div className="absolute top-[-180px] left-[-160px] w-[360px] md:w-[420px] h-[360px] md:h-[420px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

            {/* Bloco superior: texto | imagem */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: "4rem" }}>
              {/* Imagem — acima no mobile, direita no desktop */}
              <div className="relative h-[280px] md:h-[460px] overflow-hidden order-first md:order-last">
                <Image
                  src="/fotos/estrategia.png"
                  alt="Estratégia digital ORIUM"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 60%, #080808 100%)" }}
                />
              </div>

              {/* Texto — abaixo no mobile, esquerda no desktop */}
              <div className="order-last md:order-first">
                <Eyebrow>Diferencial</Eyebrow>
                <h2
                  className="font-bold leading-tight mb-6"
                  style={{
                    fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                    fontFamily: "'Anton', sans-serif",
                  }}
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
            </div>

            {/* Bloco inferior: 4 cards horizontais */}
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{ marginTop: "4rem", gap: "1.5rem" }}
            >
              {[
                {
                  title: "Posicionamento",
                  text: "Como sua marca é percebida define quem ela atrai — e quanto cobra.",
                  icon: "posicionamento",
                },
                {
                  title: "Percepção Premium",
                  text: "Design, linguagem e presença alinhados ao valor real do que você entrega.",
                  icon: "percepcao",
                },
                {
                  title: "Operação Digital",
                  text: "Estruturas e automações para você operar com método, não no improviso.",
                  icon: "operacao",
                },
                {
                  title: "Crescimento Sustentável",
                  text: "Presença construída para gerar continuidade — não picos que somem em duas semanas.",
                  icon: "crescimento",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-[#1a1a1a] hover:border-[#FF6B00] transition-colors duration-300"
                  style={{
                    background: "#0f0f0f",
                    padding: "2rem 1.5rem",
                  }}
                >
                  <img
                    src={`/icons/icon-${item.icon}.svg`}
                    alt={item.title}
                    style={{ width: "68px", height: "68px", objectFit: "contain", display: "block", marginBottom: "1.25rem" }}
                  />
                  <h3
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "0.95rem",
                      color: "#fff",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.8rem",
                      color: "#999",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </Reveal>

      {/* ── PROCESSO ──────────────────────────────────────────────────────── */}
      <Reveal delay={0.2}>
        <section className="bg-[#080808] text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="mb-12 md:mb-16 max-w-3xl">
              <Eyebrow>Processo</Eyebrow>
              <h2
                className="font-bold leading-tight mb-6"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  fontFamily: "'Anton', sans-serif",
                }}
              >
                Um processo claro para transformar presença digital em resultado
                comercial consistente.
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
                Antes de executar, alinhamos estratégia, mensagem e operação
                para cada entrega cumprir uma função comercial real.
              </p>
            </div>

            <div className="flex flex-col gap-12">
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
          className="relative overflow-hidden bg-[#080808] text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a] scroll-mt-24"
        >
          <div className="absolute right-[-180px] top-[-220px] h-[380px] md:h-[460px] w-[380px] md:w-[460px] rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <Eyebrow>Projetos</Eyebrow>
                <h2
                  className="font-bold max-w-2xl leading-tight"
                  style={{
                    fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                    fontFamily: "'Anton', sans-serif",
                  }}
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

            <div className="flex flex-col border border-[#1a1a1a]">
              {/* Altemans — imagem esquerda | conteúdo direita */}
              <div className="group flex flex-col md:flex-row border-b border-[#1a1a1a] overflow-hidden transition-all duration-300">
                <div className="relative w-full md:w-[45%] h-[200px] md:h-auto flex-shrink-0 overflow-hidden">
                  <Image
                    src="/fotos/altemans.png"
                    alt="Projeto Altemans Barbearia"
                    fill
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-all duration-500" />
                </div>
                <div className="flex-1 p-7 md:p-10 bg-[#080808] flex flex-col justify-between gap-7">
                  <div>
                    <span
                      className="inline-block mb-5 px-3 py-1 text-[0.7rem] tracking-[0.15em] uppercase"
                      style={{
                        border: "1px solid #FF6B00",
                        color: "#FF6B00",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Barbearia
                    </span>
                    <h3
                      className="mb-4 text-white"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      Altemans Barbearia
                    </h3>
                    <p className="text-[#999] leading-[1.7] mb-6 text-[0.95rem]">
                      Reestruturação completa da presença digital: identidade
                      visual, perfil do Instagram, destaques, comunicação e
                      planejamento mensal de conteúdo. Resultado: presença mais
                      profissional, comunicação clara e consistência na publicação.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Social Media", "Direção Visual", "Conteúdo"].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[0.7rem] text-[#999]"
                          style={{
                            background: "#111",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
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

              {/* Prof. Marcelo — conteúdo esquerda | imagem direita */}
              <div className="group flex flex-col md:flex-row-reverse overflow-hidden transition-all duration-300">
                <div className="relative w-full md:w-[45%] h-[200px] md:h-auto flex-shrink-0 overflow-hidden">
                  <Image
                    src="/fotos/marcelo.png"
                    alt="Projeto Prof. Marcelo Félix"
                    fill
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-all duration-500" />
                </div>
                <div className="flex-1 p-7 md:p-10 bg-[#080808] flex flex-col justify-between gap-7 border-t md:border-t-0 border-[#1a1a1a]">
                  <div>
                    <span
                      className="inline-block mb-5 px-3 py-1 text-[0.7rem] tracking-[0.15em] uppercase"
                      style={{
                        border: "1px solid #FF6B00",
                        color: "#FF6B00",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Saúde e educação
                    </span>
                    <h3
                      className="mb-4 text-white"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      Prof. Marcelo Félix
                    </h3>
                    <p className="text-[#999] leading-[1.7] mb-6 text-[0.95rem]">
                      Posicionamento digital para autoridade profissional na área
                      de saúde e educação. Organização de perfil, identidade
                      visual, linguagem e comunicação para cursos, palestras e
                      treinamentos.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Branding", "Autoridade", "Posicionamento"].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[0.7rem] text-[#999]"
                          style={{
                            background: "#111",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
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
          className="relative overflow-hidden bg-[#080808] text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a]"
        >
          <div className="absolute left-[-160px] bottom-[-200px] h-[360px] md:h-[420px] w-[360px] md:w-[420px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mb-12 md:mb-16">
              <Eyebrow>DIAGNÓSTICO DIGITAL</Eyebrow>
              <h2
                className="font-bold leading-tight mb-6"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  fontFamily: "'Anton', sans-serif",
                }}
              >
                Antes de produzir conteúdo, avaliamos a estrutura da sua marca.
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
                A ORIUM analisa presença digital, posicionamento, imagem e
                comunicação para identificar melhorias e organizar uma estrutura
                mais profissional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-[#1a1a1a] mb-10">
              {[
                { title: "Presença visual", text: "Instagram, identidade e percepção da marca.", icon: "presenca" },
                { title: "Comunicação", text: "Clareza da mensagem, oferta e posicionamento.", icon: "comunicacao" },
                { title: "Estrutura digital", text: "Site, links, automações e jornada do cliente.", icon: "estrutura" },
                { title: "Próximos passos", text: "Plano inicial para organizar e fortalecer sua presença.", icon: "proximos" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 md:p-8 border-r border-b border-[#1a1a1a] flex flex-col gap-3"
                >
                  <img
                    src={`/icons/icon-${item.icon}.svg`}
                    alt={item.title}
                    style={{ width: "126px", height: "126px", objectFit: "contain", display: "block", marginBottom: "0.5rem" }}
                  />
                  <div>
                    <h3
                      className="mb-2 text-white"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "1.1rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[#999] text-[0.95rem] leading-[1.6]">{item.text}</p>
                  </div>
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
        <section className="relative overflow-hidden bg-[#0a0a0a] text-white border-t border-[#1a1a1a] py-16 md:py-24 lg:py-32">
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            {/* Header centralizado */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.3em",
                    color: "#FF6B00",
                    textTransform: "uppercase",
                  }}
                >
                  COMO FUNCIONA
                </span>
                <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
              </div>
              <h2
                className="font-bold leading-tight mb-5"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  fontFamily: "'Anton', sans-serif",
                }}
              >
                Como funciona o diagnóstico?
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-[1.6]">
                Um processo direto para entender sua presença atual e identificar
                caminhos práticos de melhoria.
              </p>
            </div>

            {/* Timeline horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {[
                {
                  n: "01",
                  title: "Primeiro contato",
                  text: "Entendemos seu negócio, momento atual e principais objetivos antes de qualquer análise.",
                  icon: "icon-contato",
                },
                {
                  n: "02",
                  title: "Analisamos sua presença",
                  text: "Observamos Instagram, identidade, comunicação, site, links e jornada do cliente.",
                  icon: "icon-analise",
                },
                {
                  n: "03",
                  title: "Indicamos melhorias",
                  text: "Mostramos onde sua marca pode ficar mais clara, profissional e preparada para vender.",
                  icon: "icon-melhorias",
                },
                {
                  n: "04",
                  title: "Montamos uma proposta",
                  text: "A ORIUM apresenta um plano de trabalho alinhado ao momento da sua marca.",
                  icon: "icon-proposta",
                },
              ].map((item, i) => (
                <div
                  key={item.n}
                  className={`group relative flex flex-col transition-all duration-300 px-0 py-6 md:px-8 md:py-0${
                    i < 3 ? " border-b border-[#1a1a1a] md:border-b-0" : ""
                  }`}
                >
                  {/* Borda vertical separadora (desktop, não no último) */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-0 right-0 bottom-0 w-px bg-[#1a1a1a] group-hover:bg-[#FF6B00] transition-colors duration-300" />
                  )}

                  <img
                    src={`/icons/${item.icon}.svg`}
                    alt={item.title}
                    className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ width: "100px", height: "100px", objectFit: "contain", display: "block", marginBottom: "1.25rem" }}
                  />

                  {/* Linha conectora — todas as colunas, gradiente invertido na última */}
                  <div
                    className="hidden md:block w-full mb-4"
                    style={{
                      height: "1px",
                      background: i < 3
                        ? "linear-gradient(to right, #FF6B00, transparent)"
                        : "linear-gradient(to left, #FF6B00, transparent)",
                    }}
                  />

                  {/* Número decorativo */}
                  <div
                    className="mb-2 opacity-[0.3] group-hover:opacity-[0.8] transition-opacity duration-300"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "2rem",
                      color: "#FF6B00",
                      lineHeight: 1,
                    }}
                  >
                    {item.n}
                  </div>

                  {/* Título */}
                  <h3
                    className="mb-2 text-white"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "1.1rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Descrição */}
                  <p
                    className="text-[#999] leading-[1.6]"
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.85rem" }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── DÚVIDAS ───────────────────────────────────────────────────────── */}
      <Reveal delay={0.43}>
        <section className="bg-[#080808] text-white py-16 md:py-20 border-t border-[#1a1a1a]">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mb-10 md:mb-12">
              <Eyebrow>DÚVIDAS FREQUENTES</Eyebrow>
              <h2
                className="font-bold leading-tight"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  fontFamily: "'Anton', sans-serif",
                }}
              >
                Antes de falar com a ORIUM, vale esclarecer:
              </h2>
            </div>

            <div className="flex flex-col border-t border-[#1a1a1a]">
              {[
                { n: "01", q: "O diagnóstico é gratuito?", a: "Sim. É uma conversa inicial para entender o momento da sua marca e mapear oportunidades de melhoria." },
                { n: "02", q: "A ORIUM faz apenas posts para Instagram?", a: "Não. A ORIUM trabalha com estrutura digital: posicionamento, branding, conteúdo, sites, automações e presença profissional." },
                { n: "03", q: "Vocês atendem apenas negócios locais?", a: "O foco principal são negócios locais, profissionais e marcas em crescimento que precisam de mais organização e confiança no digital." },
                { n: "04", q: "Depois do diagnóstico eu sou obrigado a contratar?", a: "Não. O diagnóstico serve para entender o cenário. Se fizer sentido para os dois lados, a ORIUM apresenta uma proposta." },
                { n: "05", q: "A ORIUM cria site também?", a: "Sim. Criamos landing pages, sites institucionais e estruturas digitais focadas em presença profissional e conversão." },
              ].map((item) => (
                <div
                  key={item.n}
                  className="flex items-start gap-6 md:gap-10 py-7 border-b border-[#1a1a1a]"
                >
                  <span
                    className="flex-shrink-0"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "1rem",
                      color: "#FF6B00",
                      letterSpacing: "0.05em",
                      minWidth: "2.5rem",
                    }}
                  >
                    {item.n}.
                  </span>
                  <div>
                    <h3
                      className="mb-2 text-white"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.q}
                    </h3>
                    <p className="text-[#999] text-[0.95rem] leading-[1.6]">{item.a}</p>
                  </div>
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
          className="relative overflow-hidden text-white py-16 md:py-24 lg:py-32 border-t border-[#1a1a1a] scroll-mt-24"
          style={{
            backgroundImage: "url(/fotos/cta.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(8,8,8,0.85)", zIndex: 0 }}
          />
          <div
            className="absolute top-[-220px] left-1/2 h-[360px] md:h-[420px] w-[360px] md:w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none"
            style={{ zIndex: 1 }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.3em",
                  color: "#FF6B00",
                  textTransform: "uppercase",
                }}
              >
                Vamos construir sua presença digital
              </span>
              <div style={{ width: 40, height: 1, background: "#FF6B00", flexShrink: 0 }} />
            </div>

            <h2
              className="font-bold leading-tight mb-6"
              style={{
                fontSize: "clamp(1.75rem, 6vw, 4.5rem)",
                fontFamily: "'Anton', sans-serif",
              }}
            >
              Sua marca pode operar com mais clareza, valor percebido e
              consistência comercial.
            </h2>

            {/* Linha decorativa */}
            <div
              className="mx-auto mb-8"
              style={{ width: 60, height: 2, background: "#FF6B00" }}
            />

            <p className="text-zinc-400 text-base md:text-xl leading-[1.6] max-w-3xl mx-auto mb-10">
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

      {/* WhatsApp flutuante — apenas na página principal, nunca nas ferramentas */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full hover:scale-110 transition-all duration-300"
        style={{
          background: "#25D366",
          boxShadow: "0 4px 24px rgba(37,211,102,0.4)",
        }}
        aria-label="Falar pelo WhatsApp"
      >
        <Image src="/wpp.png" alt="WhatsApp" width={30} height={30} />
      </a>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="bg-[#080808] py-12 md:py-14"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
            <div>
              <div className="mb-4">
                <Image
                  src="/lgbranca.png"
                  alt="ORIUM"
                  width={80}
                  height={26}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p
                className="max-w-sm mx-auto md:mx-0"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "1.1rem",
                  color: "#333",
                  lineHeight: 1.4,
                }}
              >
                Negócios bons merecem parecer tão bons quanto são.
              </p>
            </div>
            <div>
              <h4
                className="text-white mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Navegação
              </h4>
              <nav
                className="flex flex-col gap-3 text-zinc-400"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                <a href="#inicio" className="md:hover:text-orange-500 transition">Início</a>
                <a href="#servicos" className="md:hover:text-orange-500 transition">Serviços</a>
                <a href="#projetos" className="md:hover:text-orange-500 transition">Projetos</a>
                <a href="#diagnostico" className="md:hover:text-orange-500 transition">Diagnóstico</a>
                <a href="#contato" className="md:hover:text-orange-500 transition">Contato</a>
              </nav>
            </div>
            <div>
              <h4
                className="text-white mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Contato
              </h4>
              <div
                className="flex flex-col gap-3 text-zinc-400"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
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

          <div
            className="mt-10 pt-6 text-center"
            style={{ borderTop: "1px solid #1a1a1a" }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#444",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              © 2026 ORIUM. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
