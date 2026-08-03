'use client';

import { useState } from 'react';
import Image from 'next/image';
import OriumInput from '@/components/OriumInput';
import { vitrines, postsGenericos, type Vitrine, type PostVitrine } from './data';

const WHATSAPP_NUMERO = '5531999352065';
const TOTAL_ETAPAS = 4;
const MINIMO_POSTS_GENERICOS = 3;

type OpcaoId = 'A' | 'B' | 'C';

type Selecoes = {
  post1: OpcaoId | null;
  post2: OpcaoId | null;
  post3: OpcaoId | null;
};

function ProgressoEtapas({ etapaAtual }: { etapaAtual: number }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p
        style={{
          color: '#FF6B00',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '0.85rem',
        }}
      >
        Etapa {etapaAtual} de {TOTAL_ETAPAS}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '320px', margin: '0 auto' }}>
        {Array.from({ length: TOTAL_ETAPAS }, (_, i) => i + 1).map(n => (
          <div
            key={n}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '999px',
              background: n <= etapaAtual ? '#FF6B00' : '#1e1e1e',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function VitrineCard({ vitrine, onSelect }: { vitrine: Vitrine; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid #1a1a1a',
        borderRadius: '16px',
        padding: '2rem',
        transition: 'border-color 0.2s',
      }}
    >
      <h3
        style={{
          fontFamily: 'Anton, sans-serif',
          textTransform: 'uppercase',
          fontSize: '1.4rem',
          color: '#fff',
          margin: 0,
        }}
      >
        {vitrine.nome}
      </h3>
      <p style={{ color: '#FF6B00', fontSize: '0.78rem', marginTop: '0.85rem', lineHeight: 1.6 }}>
        {vitrine.arco}
      </p>
      <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.85rem', lineHeight: 1.6 }}>
        {vitrine.paraQuem}
      </p>
    </div>
  );
}

function PostBlock({
  numero,
  post,
  selecionado,
  onSelect,
}: {
  numero: number;
  post: PostVitrine;
  selecionado: OpcaoId | null;
  onSelect: (id: OpcaoId) => void;
}) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p
        style={{
          color: '#555',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        Post {numero}
      </p>
      <h3
        style={{
          fontFamily: 'Anton, sans-serif',
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          color: '#fff',
          margin: '0 0 1rem',
        }}
      >
        {post.titulo}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {post.opcoes.map(opcao => (
          <div
            key={opcao.id}
            role="button"
            tabIndex={0}
            aria-pressed={selecionado === opcao.id}
            onClick={() => onSelect(opcao.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(opcao.id);
              }
            }}
            style={{
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${selecionado === opcao.id ? '#FF6B00' : '#1a1a1a'}`,
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              transition: 'border-color 0.2s',
            }}
          >
            <p style={{ color: '#FF6B00', fontFamily: 'Anton, sans-serif', fontSize: '0.75rem', margin: 0 }}>
              {opcao.id}
            </p>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: '0.5rem 0 0' }}>
              {opcao.titulo}
            </p>
            <p style={{ color: '#999', fontSize: '0.82rem', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
              {opcao.descricao}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostGenericoCard({
  titulo,
  descricao,
  selecionado,
  onToggle,
}: {
  titulo: string;
  descricao: string;
  selecionado: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${selecionado ? '#FF6B00' : '#1a1a1a'}`,
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        transition: 'border-color 0.2s',
      }}
    >
      <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{titulo}</p>
      <p style={{ color: '#999', fontSize: '0.82rem', margin: '0.35rem 0 0', lineHeight: 1.5 }}>{descricao}</p>
    </div>
  );
}

const CATEGORIAS_POSTS_GENERICOS: { id: 'o-que-fazem' | 'o-que-vendem'; titulo: string }[] = [
  { id: 'o-que-fazem', titulo: 'O que vocês fazem' },
  { id: 'o-que-vendem', titulo: 'O que vocês vendem' },
];

export default function VitrineEstrategicaPage() {
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);
  const [vitrineId, setVitrineId] = useState<Vitrine['id'] | null>(null);
  const [selecoes, setSelecoes] = useState<Selecoes>({ post1: null, post2: null, post3: null });
  const [postsGenericosEscolhidos, setPostsGenericosEscolhidos] = useState<Set<string>>(new Set());
  const [nome, setNome] = useState('');
  const [negocio, setNegocio] = useState('');

  const vitrineEscolhida = vitrines.find(v => v.id === vitrineId) ?? null;
  const posts3Preenchidos = !!(selecoes.post1 && selecoes.post2 && selecoes.post3);
  const genericosMinimoOk = postsGenericosEscolhidos.size >= MINIMO_POSTS_GENERICOS;

  function selecionarVitrine(id: Vitrine['id']) {
    setVitrineId(id);
    setEtapa(2);
  }

  function selecionarOpcao(postKey: keyof Selecoes, id: OpcaoId) {
    setSelecoes(prev => ({ ...prev, [postKey]: id }));
  }

  function togglePostGenerico(id: string) {
    setPostsGenericosEscolhidos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function montarMensagem(): string {
    if (!vitrineEscolhida || !selecoes.post1 || !selecoes.post2 || !selecoes.post3 || !genericosMinimoOk) return '';

    const linhaPost = (index: number, opcaoId: OpcaoId) => {
      const post = vitrineEscolhida.posts[index];
      const opcao = post.opcoes.find(o => o.id === opcaoId)!;
      return `Post ${index + 1} (${post.titulo}): ${opcao.titulo}, ${opcao.descricao}`;
    };

    const linhasPostsGenericos = [...postsGenericosEscolhidos]
      .map(id => {
        const post = postsGenericos.find(p => p.id === id)!;
        return `- ${post.titulo}: ${post.descricao}`;
      })
      .join('\n');

    return `Olá! Simulei minha Vitrine Estratégica no site da ORIUM.

Vitrine escolhida: ${vitrineEscolhida.nome}

${linhaPost(0, selecoes.post1!)}
${linhaPost(1, selecoes.post2!)}
${linhaPost(2, selecoes.post3!)}

Posts adicionais:
${linhasPostsGenericos}

Meu nome: ${nome || 'não informado'}
Meu negócio: ${negocio || 'não informado'}

Quero entender como fica na prática.`;
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagem())}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        overflowX: 'hidden',
        paddingBottom: '2rem',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600;700&display=swap"
      />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 20% 0%, rgba(255,107,0,0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Image
            src="/lgbranca.png"
            alt="ORIUM"
            width={140}
            height={44}
            style={{ objectFit: 'contain', margin: '0 auto 1.25rem' }}
          />
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            VITRINE ESTRATÉGICA™
          </p>
        </header>

        <ProgressoEtapas etapaAtual={etapa} />

        {etapa === 1 && (
          <section>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1
                style={{
                  fontFamily: 'Anton, sans-serif',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Simule sua <span style={{ color: '#FF6B00' }}>Vitrine Estratégica</span>
              </h1>
              <p style={{ color: '#999', fontSize: '0.95rem', marginTop: '1rem', lineHeight: 1.6 }}>
                Escolha a ordem narrativa que combina com o seu negócio.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {vitrines.map(v => (
                <VitrineCard key={v.id} vitrine={v} onSelect={() => selecionarVitrine(v.id)} />
              ))}
            </div>
          </section>
        )}

        {etapa === 2 && vitrineEscolhida && (
          <section>
            <button
              onClick={() => setEtapa(1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '0.85rem',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '2rem',
              }}
            >
              ← Voltar
            </button>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {vitrineEscolhida.nome}
              </p>
              <h2
                style={{
                  fontFamily: 'Anton, sans-serif',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  margin: '0.5rem 0 0',
                }}
              >
                Escolha os 3 posts
              </h2>
            </div>
            <PostBlock
              numero={1}
              post={vitrineEscolhida.posts[0]}
              selecionado={selecoes.post1}
              onSelect={id => selecionarOpcao('post1', id)}
            />
            <PostBlock
              numero={2}
              post={vitrineEscolhida.posts[1]}
              selecionado={selecoes.post2}
              onSelect={id => selecionarOpcao('post2', id)}
            />
            <PostBlock
              numero={3}
              post={vitrineEscolhida.posts[2]}
              selecionado={selecoes.post3}
              onSelect={id => selecionarOpcao('post3', id)}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => posts3Preenchidos && setEtapa(3)}
                disabled={!posts3Preenchidos}
                style={{
                  background: posts3Preenchidos ? '#FF6B00' : '#1e1e1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.9rem 2.75rem',
                  color: posts3Preenchidos ? '#fff' : '#555',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  cursor: posts3Preenchidos ? 'pointer' : 'not-allowed',
                  boxShadow: posts3Preenchidos ? '0 4px 20px rgba(255,107,0,0.25)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                CONTINUAR →
              </button>
            </div>
          </section>
        )}

        {etapa === 3 && vitrineEscolhida && (
          <section>
            <button
              onClick={() => setEtapa(2)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '0.85rem',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '2rem',
              }}
            >
              ← Voltar
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: 'Anton, sans-serif',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  margin: 0,
                }}
              >
                Escolha posts adicionais
              </h2>
              <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
                Selecione quantos fizerem sentido para o seu negócio, no mínimo {MINIMO_POSTS_GENERICOS}.
              </p>
              <p
                style={{
                  color: genericosMinimoOk ? '#FF6B00' : '#666',
                  fontSize: '0.8rem',
                  marginTop: '0.75rem',
                  letterSpacing: '0.05em',
                }}
              >
                {postsGenericosEscolhidos.size} posts selecionados (mínimo {MINIMO_POSTS_GENERICOS})
              </p>
            </div>
            {CATEGORIAS_POSTS_GENERICOS.map(categoria => (
              <div key={categoria.id} style={{ marginBottom: '2.5rem' }}>
                <h3
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    textTransform: 'uppercase',
                    fontSize: '1.1rem',
                    color: '#fff',
                    margin: '0 0 1rem',
                  }}
                >
                  {categoria.titulo}
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {postsGenericos
                    .filter(post => post.categoria === categoria.id)
                    .map(post => (
                      <PostGenericoCard
                        key={post.id}
                        titulo={post.titulo}
                        descricao={post.descricao}
                        selecionado={postsGenericosEscolhidos.has(post.id)}
                        onToggle={() => togglePostGenerico(post.id)}
                      />
                    ))}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => genericosMinimoOk && setEtapa(4)}
                disabled={!genericosMinimoOk}
                style={{
                  background: genericosMinimoOk ? '#FF6B00' : '#1e1e1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.9rem 2.75rem',
                  color: genericosMinimoOk ? '#fff' : '#555',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  cursor: genericosMinimoOk ? 'pointer' : 'not-allowed',
                  boxShadow: genericosMinimoOk ? '0 4px 20px rgba(255,107,0,0.25)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                CONTINUAR →
              </button>
            </div>
          </section>
        )}

        {etapa === 4 && vitrineEscolhida && (
          <section>
            <button
              onClick={() => setEtapa(3)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '0.85rem',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '2rem',
              }}
            >
              ← Voltar
            </button>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2
                style={{
                  fontFamily: 'Anton, sans-serif',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  margin: 0,
                }}
              >
                Sua Vitrine está pronta
              </h2>
              <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
                Deixe seus dados (opcional) e fale com a ORIUM para entender como isso funciona na prática.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <OriumInput
                label="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Opcional"
              />
              <OriumInput
                label="Nome do negócio"
                value={negocio}
                onChange={e => setNegocio(e.target.value)}
                placeholder="Opcional"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FF6B00',
                  color: '#fff',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  padding: '0.9rem 2.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 20px rgba(255,107,0,0.25)',
                  transition: 'all 0.2s',
                }}
              >
                FALAR COM A ORIUM
              </a>
            </div>
          </section>
        )}
      </div>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '3rem 1.5rem 2rem',
          borderTop: '1px solid #1a1a1a',
          marginTop: '2rem',
        }}
      >
        <p
          style={{
            fontFamily: 'Anton, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#666',
            fontSize: '0.95rem',
            margin: 0,
          }}
        >
          Estruturamos o que gera percepção, presença e resultado.
        </p>
      </footer>
    </div>
  );
}
