"use client";

import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import ProcessStep from "../components/ProcessStep";
import StatsStrip from "../components/StatsStrip";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";
import Image from "next/image";

const GRAIN =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E";

const projetos = [
  {
    nome: "Altemans Barbearia",
    ramo: "Beleza & Estética",
    descricao:
      "Gestão mensal completa da presença digital. Planejamento de conteúdo, produção de posts, stories e vídeos com identidade consistente e comunicação alinhada ao posicionamento da marca.",
    tags: ["Social Media", "Produção de Conteúdo", "Planejamento Mensal"],
    instagram: "https://www.instagram.com/altemansbarbearia",
    foto: "/fotos/altemans-capa.jpg",
  },
  {
    nome: "Prof. Marcelo Félix",
    ramo: "Educação",
    descricao:
      "Posicionamento profissional e autoridade digital para especialista em urgência e emergência. Identidade de comunicação estruturada e canais de captação para cursos e formações.",
    tags: ["Posicionamento", "Autoridade Digital", "Estratégia de Conteúdo"],
    instagram: "https://www.instagram.com/prof.marcelofelix",
    foto: "/fotos/marcelo-capa.jpg",
  },
  {
    nome: "Ogarete Restaurante Árabe",
    ramo: "Alimentação",
    descricao:
      "Reestruturação completa da presença digital. Identidade visual exclusiva, reconstrução do Instagram e gestão integral — captação, conteúdo, publicação e planejamento contínuo.",
    tags: ["Social Media", "Identidade Visual", "Direção Criativa", "Gestão Completa"],
    instagram: "https://www.instagram.com/ogarete.culinariaarabe",
    foto: "/fotos/ogarete-capa.jpg",
  },
  {
    nome: "Forno House",
    ramo: "Alimentação",
    descricao:
      "Fortalecimento de marca e valorização de produtos via presença digital estratégica. Identidade visual, direção criativa e gestão contínua com comunicação alinhada ao posicionamento.",
    tags: ["Social Media", "Identidade Visual", "Direção Criativa", "Produção de Conteúdo"],
    instagram: "https://www.instagram.com/fornohouse",
    foto: "/fotos/forno-house-capa.jpg",
  },
  {
    nome: "Boizão BBQ",
    ramo: "Alimentação",
    descricao:
      "Reformulação estratégica da presença digital. Nova identidade visual, planejamento de conteúdo e gestão completa do perfil — captação, produção e direção criativa contínua.",
    tags: ["Social Media", "Identidade Visual", "Direção Criativa", "Gestão Completa"],
    instagram: "https://www.instagram.com/boizaobarbque",
    foto: "/fotos/boizao-capa.jpg",
  },
  {
    nome: "Actos Espaço Terapêutico",
    ramo: "Saúde & Bem-estar",
    descricao:
      "Presença digital construída do zero. Identidade visual, linguagem de marca, organização do perfil e planejamento de conteúdo alinhados aos valores e ao propósito da Actos.",
    tags: ["Branding", "Social Media", "Direção Criativa", "Gestão Completa"],
    instagram: "https://www.instagram.com/actosespacoterapeutico",
    foto: "/fotos/actos-capa.jpg",
  },
  {
    nome: "Campanhas Políticas — Itabirito/MG",
    ramo: "Marketing Político",
    descricao:
      "Quatro campanhas eleitorais gerenciadas de ponta a ponta — identidade visual, marketing digital, produção audiovisual e materiais gráficos. Dois candidatos a vereador eleitos.",
    tags: ["Marketing Político", "Estratégia Eleitoral", "Produção Audiovisual", "Comunicação Integrada"],
    instagram: null,
    foto: "/fotos/campanha-politica-capa.jpg",
  },
  {
    nome: "Infinity",
    ramo: "MODA & LIFESTYLE",
    descricao:
      "A marca já tinha mercado. Faltava posicionamento que tornasse isso visível. Trabalhamos expansão de identidade visual, ensaios fotográficos e vídeos estratégicos com campanhas orientadas a alcance e reconhecimento de marca.",
    instagram: "",
    semLink: true,
    tags: ["Identidade Visual", "Produção de Conteúdo", "Direção Criativa"],
    foto: "/fotos/infinity-capa.jpg",
  },
  {
    nome: "Vetz",
    ramo: "PET & SAÚDE ANIMAL",
    descricao:
      "Captação audiovisual para mostrar o que uma clínica veterinária de verdade parece por dentro. Fotos e vídeos que comunicam cuidado, estrutura e competência, construindo presença digital que atrai tutores com intenção real.",
    instagram: "https://www.instagram.com/clinicavetz/",
    semLink: false,
    tags: ["Produção de Conteúdo", "Social Media"],
    foto: "/fotos/vetz-capa.jpg",
  },
  {
    nome: "Harmonize Gold",
    ramo: "SAÚDE & ESTÉTICA",
    descricao:
      "Cobertura de workshops, eventos e treinamentos com produção voltada a posicionamento e autoridade. Fotos e vídeos institucionais que constroem presença de marca no mercado mineiro e consolidam a empresa como referência no segmento.",
    instagram: "",
    semLink: true,
    tags: ["Produção de Conteúdo", "Direção Criativa"],
    foto: "/fotos/harmonize-gold-capa.jpg",
  },
  {
    nome: "Cervejaria Acuruí",
    ramo: "ALIMENTAÇÃO & EVENTOS",
    descricao:
      "Cobertura audiovisual de eventos com produção estratégica de fotos e vídeos. Conteúdo que reforça identidade, valoriza a experiência do público e amplia o alcance da marca nas redes.",
    instagram: "",
    semLink: true,
    tags: ["Produção de Conteúdo", "Direção Criativa"],
    foto: "/fotos/cervejaria-acurui-capa.jpg",
  },
];

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
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener("openContactModal", handler);
    return () => window.removeEventListener("openContactModal", handler);
  }, []);

  const primaryButton =
    "w-full md:w-auto bg-[#FF6B00] text-black px-8 py-4 font-bold transition-all duration-300 text-center hover:bg-[#cc5500] tracking-[0.08em]";

  const secondaryButton =
    "w-full md:w-auto border border-[#333] text-white px-8 py-4 font-semibold transition-all duration-300 text-center hover:border-[#FF6B00] hover:text-[#FF6B00]";

  const heroPrimaryButton =
    "inline-flex items-center justify-center bg-[#FF6B00] text-black px-[28px] py-[12px] text-[0.85rem] font-semibold tracking-[0.04em] border-none transition-all duration-[250ms] ease-[ease] hover:bg-[#ff7d1a] hover:-translate-y-0.5 w-full md:w-auto";

  const heroSecondaryButton =
    "inline-flex items-center justify-center bg-transparent text-white px-[28px] py-[12px] text-[0.85rem] font-medium tracking-[0.04em] border border-[#333] transition-all duration-[250ms] ease-[ease] hover:border-[#FF6B00] hover:text-[#FF6B00] w-full md:w-auto";

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

        <div className="relative z-10 pt-[100px] md:pt-[140px] pb-[100px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-16 w-full">
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
                className="font-bold text-white text-[clamp(2rem,8vw,3rem)] md:text-[clamp(1.8rem,4vw,3.2rem)]"
                style={{
                  fontFamily: "'Anton', sans-serif",
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
                className="relative z-10 flex flex-col md:flex-row md:items-center"
                style={{ gap: "1rem" }}
              >
                <button onClick={() => setModalOpen(true)} className={heroPrimaryButton}>
                  Falar com a ORIUM
                </button>
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
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
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

          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-16">

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
              className="grid grid-cols-1 md:grid-cols-4"
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
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
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
                last
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

          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
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
                  Projetos
                </h2>
              </div>
              <p className="text-zinc-400 max-w-md leading-[1.6] text-[0.95rem]">
                Marcas que estruturamos, posicionamos e fazemos crescer.
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: "20px" }}
            >
              {projetos.map((projeto) => (
                <div
                  key={projeto.nome}
                  data-ramo={projeto.ramo}
                  className="group flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.2)]"
                  style={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "28px",
                  }}
                >
                  <div>
                    {projeto.foto && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 rounded-lg">
                        <Image
                          src={projeto.foto}
                          alt={projeto.nome}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <span
                      className="inline-block px-3 py-1 uppercase"
                      style={{
                        background: "rgba(255,107,0,0.1)",
                        color: "#FF6B00",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        fontFamily: "Poppins, sans-serif",
                        borderRadius: "999px",
                      }}
                    >
                      {projeto.ramo}
                    </span>
                    <h3
                      className="text-white"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "20px",
                        marginTop: "12px",
                        lineHeight: 1.2,
                      }}
                    >
                      {projeto.nome}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        color: "#999999",
                        marginTop: "8px",
                        lineHeight: 1.6,
                      }}
                    >
                      {projeto.descricao}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {projeto.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#666666",
                            fontSize: "11px",
                            fontFamily: "Poppins, sans-serif",
                            borderRadius: "999px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {!projeto.semLink && projeto.instagram && (
                      <a
                        href={projeto.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                        style={{
                          marginTop: "10px",
                          color: "#FF6B00",
                          fontSize: "12px",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#FF6B00" strokeWidth="2" />
                          <circle cx="12" cy="12" r="4" stroke="#FF6B00" strokeWidth="2" />
                          <circle cx="17.5" cy="6.5" r="1.2" fill="#FF6B00" />
                        </svg>
                        Ver perfil
                      </a>
                    )}
                  </div>
                </div>
              ))}
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

          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
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

            <button onClick={() => setModalOpen(true)} className={primaryButton}>
              Solicitar diagnóstico
            </button>
          </div>
        </section>
      </Reveal>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────────── */}
      <Reveal delay={0.4}>
        <section className="relative overflow-hidden bg-[#0a0a0a] text-white border-t border-[#1a1a1a] py-16 md:py-24 lg:py-32">
          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
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
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}
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
          <div className="max-w-4xl mx-auto px-5 md:px-8 lg:px-16">
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

          <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 lg:px-16 text-center">
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
              className="font-bold leading-tight mb-6 text-[clamp(1.75rem,6vw,3.5rem)] md:text-[clamp(1.75rem,6vw,4.5rem)]"
              style={{
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
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button onClick={() => setModalOpen(true)} className={primaryButton}>
                Falar no WhatsApp
              </button>
              <a href="#projetos" className={secondaryButton}>
                Ver Projetos
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* WhatsApp flutuante — apenas na página principal, nunca nas ferramentas */}
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Falar com a ORIUM"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "56px",
          height: "56px",
          background: "#25D366",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
        }}
        className="hover:scale-110 transition-all duration-300"
      >
        <Image src="/wpp.png" alt="WhatsApp" width={30} height={30} />
      </button>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="bg-[#080808] py-12 md:py-14"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-16">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 text-center md:text-left">
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
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-center md:text-left md:hover:text-orange-500 transition"
                >
                  WhatsApp
                </button>
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

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
