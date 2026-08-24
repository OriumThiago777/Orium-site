'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const FORMANDOS = [
  'Amanda Carina dos Santos',
  'Ana Luiza Gouvêa',
  'Bruno Silva',
  'Daniel de Almeida',
  'Isabelle Moreira',
  'Kathleen Ohana',
  'Luis Souza',
  'Tarcisio Pieroni',
  'Thiago Pedro',
];

const serifFont = cormorant.style.fontFamily;
const sansFont = inter.style.fontFamily;

const underlineInputStyle: CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #cfcfc9',
  borderRadius: 0,
  padding: '0.55rem 0.1rem',
  fontFamily: sansFont,
  fontSize: '0.95rem',
  color: '#111',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderBottomColor = '#000';
}

function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderBottomColor = '#cfcfc9';
}

function CornerMarks() {
  const base: CSSProperties = { position: 'absolute', width: '18px', height: '18px', pointerEvents: 'none' };
  return (
    <>
      <span style={{ ...base, top: '16px', left: '16px', borderTop: '1.5px solid #000', borderLeft: '1.5px solid #000' }} />
      <span style={{ ...base, top: '16px', right: '16px', borderTop: '1.5px solid #000', borderRight: '1.5px solid #000' }} />
      <span style={{ ...base, bottom: '16px', left: '16px', borderBottom: '1.5px solid #000', borderLeft: '1.5px solid #000' }} />
      <span style={{ ...base, bottom: '16px', right: '16px', borderBottom: '1.5px solid #000', borderRight: '1.5px solid #000' }} />
    </>
  );
}

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: serifFont, fontStyle: 'italic', fontWeight: 500, fontSize: '30px', color: '#111', margin: 0 }}>
        Thiago Duarte
      </p>
      <p style={{ fontFamily: sansFont, fontSize: '10.5px', letterSpacing: '4px', textTransform: 'uppercase', color: '#5c5c5c', margin: '0.5rem 0 0' }}>
        Fotógrafo
      </p>
      <div style={{ width: '40px', height: '1px', background: '#000', opacity: 0.45, margin: '1.15rem auto 0' }} />
    </div>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: sansFont,
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#000',
        margin: '0 0 1.35rem',
        paddingBottom: '0.6rem',
        borderBottom: '1px solid #e6e6e0',
      }}
    >
      {children}
    </p>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: '1.65rem' }}>
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          fontFamily: sansFont,
          fontSize: '0.85rem',
          fontWeight: 500,
          color: '#1a1a1a',
          marginBottom: '0.45rem',
        }}
      >
        {label}
        {hint && (
          <span style={{ fontWeight: 400, color: '#8a8a8a', marginLeft: '0.45rem', fontSize: '0.78rem' }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function ChecklistFormandos({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (name: string) => void;
}) {
  if (options.length === 0) {
    return (
      <p style={{ fontFamily: sansFont, fontSize: '0.85rem', color: '#999', margin: 0 }}>
        Nenhum outro formando disponível.
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {options.map(name => {
        const checked = selected.includes(name);
        return (
          <label
            key={name}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(name)}
              style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
            />
            <span
              style={{
                width: '18px',
                height: '18px',
                minWidth: '18px',
                border: '1px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: checked ? '#000' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {checked && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span style={{ fontFamily: sansFont, fontSize: '0.92rem', color: '#111' }}>{name}</span>
          </label>
        );
      })}
    </div>
  );
}

function AutorizacaoButtons({
  value,
  onChange,
}: {
  value: 'Sim' | 'Não' | '';
  onChange: (v: 'Sim' | 'Não') => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      {(['Sim', 'Não'] as const).map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              fontFamily: sansFont,
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid #000',
              background: active ? '#000' : 'transparent',
              color: active ? '#fff' : '#000',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SuccessState({ nome }: { nome: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 0 1.5rem' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '1.5px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.75rem',
        }}
      >
        <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
          <path d="M1 8.5L8 15.5L21 1.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: serifFont,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: '1.7rem',
          color: '#111',
          margin: '0 0 0.85rem',
        }}
      >
        Obrigado, {nome}.
      </h2>
      <p style={{ fontFamily: sansFont, fontSize: '0.95rem', color: '#555', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
        Suas respostas foram registradas. Nos vemos no dia da colação.
      </p>
    </div>
  );
}

export default function ColacaoDeGrauPage() {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [horario, setHorario] = useState('');
  const [acompanhantes, setAcompanhantes] = useState('');
  const [fotoGarantida, setFotoGarantida] = useState('');
  const [fotosFormandos, setFotosFormandos] = useState<string[]>([]);
  const [autorizacao, setAutorizacao] = useState<'Sim' | 'Não' | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (nome) {
      setFotosFormandos(prev => prev.filter(n => n !== nome));
    }
  }, [nome]);

  const opcoesFormandos = FORMANDOS.filter(f => f !== nome);

  function toggleFormando(name: string) {
    setFotosFormandos(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
  }

  const podeEnviar = Boolean(nome.trim() && apelido.trim() && whatsapp.trim() && horario.trim() && autorizacao);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!podeEnviar || submitting) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/colacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_completo: nome,
          apelido,
          whatsapp,
          instagram,
          horario_chegada: horario,
          acompanhantes,
          foto_garantida: fotoGarantida,
          fotos_formandos: fotosFormandos.join(', '),
          autorizacao,
          enviado_em: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Falha no envio');
      setSubmitted(true);
    } catch {
      setErrorMsg('Não foi possível enviar. Verifique sua conexão e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafaf9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.25rem, 5vw, 3rem) 1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: '#fff',
          border: '1px solid #000',
          padding: 'clamp(2.25rem, 6vw, 3.5rem) clamp(1.5rem, 6vw, 3rem)',
          boxSizing: 'border-box',
        }}
      >
        <CornerMarks />

        {submitted ? (
          <SuccessState nome={apelido || nome} />
        ) : (
          <form onSubmit={handleSubmit}>
            <Header />

            <h1
              style={{
                fontFamily: serifFont,
                fontWeight: 600,
                fontSize: '26px',
                color: '#111',
                textAlign: 'center',
                margin: '0 0 0.65rem',
              }}
            >
              Formulário — Colação de Grau
            </h1>
            <p
              style={{
                fontFamily: sansFont,
                fontSize: '0.92rem',
                color: '#555',
                textAlign: 'center',
                margin: '0 0 0.6rem',
                lineHeight: 1.55,
              }}
            >
              Preencha os dados abaixo para organizarmos as fotos do seu dia.
            </p>
            <p
              style={{
                fontFamily: sansFont,
                fontStyle: 'italic',
                fontSize: '0.82rem',
                color: '#777',
                textAlign: 'center',
                margin: '0 0 2.5rem',
              }}
            >
              Estarei no local a partir das 18h — a colação começa às 19h.
            </p>

            <SectionEyebrow>Identificação</SectionEyebrow>
            <div style={{ marginBottom: '2.5rem' }}>
              <Field label="Seu nome" htmlFor="nome">
                <select
                  id="nome"
                  required
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...underlineInputStyle, cursor: 'pointer' }}
                >
                  <option value="">Selecione...</option>
                  {FORMANDOS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </Field>

              <Field label="Como prefere ser chamado(a)" htmlFor="apelido">
                <input
                  id="apelido"
                  type="text"
                  required
                  value={apelido}
                  onChange={e => setApelido(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={underlineInputStyle}
                />
              </Field>

              <Field label="WhatsApp" htmlFor="whatsapp">
                <input
                  id="whatsapp"
                  type="text"
                  required
                  placeholder="(31) 99999-9999"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={underlineInputStyle}
                />
              </Field>

              <Field label="Instagram" hint="(opcional, para marcar você nas fotos)" htmlFor="instagram">
                <input
                  id="instagram"
                  type="text"
                  placeholder="@seuusuario"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={underlineInputStyle}
                />
              </Field>
            </div>

            <SectionEyebrow>No dia</SectionEyebrow>
            <div style={{ marginBottom: '2.5rem' }}>
              <Field label="Horário previsto de chegada" htmlFor="horario">
                <input
                  id="horario"
                  type="time"
                  required
                  value={horario}
                  onChange={e => setHorario(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={underlineInputStyle}
                />
              </Field>

              <Field
                label="Quem estará presente para fotos com você?"
                hint="(opcional)"
                htmlFor="acompanhantes"
              >
                <textarea
                  id="acompanhantes"
                  rows={2}
                  placeholder="Nomes e parentesco. Ex: Maria (mãe), João (pai). Deixe em branco se estiver sozinho(a)."
                  value={acompanhantes}
                  onChange={e => setAcompanhantes(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...underlineInputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </Field>

              <Field
                label="Existe alguém específico com quem você quer garantir uma foto?"
                hint="(opcional)"
                htmlFor="fotoGarantida"
              >
                <input
                  id="fotoGarantida"
                  type="text"
                  value={fotoGarantida}
                  onChange={e => setFotoGarantida(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={underlineInputStyle}
                />
              </Field>

              <Field
                label="Com quais formandos você gostaria de tirar fotos?"
                hint="(opcional)"
                htmlFor="fotosFormandos"
              >
                <ChecklistFormandos options={opcoesFormandos} selected={fotosFormandos} onToggle={toggleFormando} />
              </Field>
            </div>

            <SectionEyebrow>Autorização de imagem</SectionEyebrow>
            <div style={{ marginBottom: '2.5rem' }}>
              <Field
                label="Autoriza o uso de algumas fotografias para portfólio e divulgação do fotógrafo?"
                htmlFor="autorizacao"
              >
                <AutorizacaoButtons value={autorizacao} onChange={setAutorizacao} />
              </Field>
            </div>

            {errorMsg && (
              <p
                style={{
                  fontFamily: sansFont,
                  fontSize: '0.82rem',
                  color: '#111',
                  background: '#f4f4f0',
                  border: '1px solid #000',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                }}
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!podeEnviar || submitting}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#000',
                color: '#fff',
                border: 'none',
                fontFamily: sansFont,
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: !podeEnviar || submitting ? 'not-allowed' : 'pointer',
                opacity: !podeEnviar || submitting ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {submitting ? 'Enviando...' : 'Enviar respostas'}
            </button>
            <p
              style={{
                fontFamily: sansFont,
                fontSize: '0.72rem',
                color: '#999',
                textAlign: 'center',
                marginTop: '1.1rem',
                lineHeight: 1.5,
              }}
            >
              Seus dados serão usados apenas para organizar as fotos deste evento.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
