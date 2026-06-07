'use client';

import { useEffect, useState, type CSSProperties, type FocusEvent } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEGMENTOS = [
  'Barbearia',
  'Restaurante / Alimentação',
  'Saúde e Estética',
  'Educação / Infoproduto',
  'Moda e Varejo',
  'Serviços Locais',
  'Fitness / Academia',
  'Outro',
];

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#666',
  marginBottom: '0.5rem',
  fontFamily: 'Poppins',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: '#080808',
  border: '1px solid #222',
  borderRadius: 0,
  padding: '12px 16px',
  color: '#fff',
  fontSize: '0.95rem',
  fontFamily: 'Poppins',
  outline: 'none',
  boxSizing: 'border-box',
};

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function focusOrange(e: FocusEvent<FieldElement>) {
  e.target.style.borderColor = '#FF6B00';
}

function blurGray(e: FocusEvent<FieldElement>) {
  e.target.style.borderColor = '#222';
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [nome, setNome] = useState('');
  const [segmento, setSegmento] = useState('');
  const [necessidade, setNecessidade] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const disabled = !nome || !segmento || !necessidade;

  const handleSubmit = () => {
    if (!nome || !segmento || !necessidade) return;
    setLoading(true);

    const mensagem = `Olá! Vim pelo site da ORIUM.

*Nome:* ${nome}
*Segmento:* ${segmento}
*Instagram:* ${instagram || 'Não informado'}
*Necessidade:* ${necessidade}

Gostaria de saber mais sobre estruturação digital.`;

    const url = `https://wa.me/5531999352065?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    setLoading(false);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#0f0f0f',
          border: '1px solid #1a1a1a',
          padding: '3rem',
          width: 'min(520px, 90vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 1001,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: '#666',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
        >
          ×
        </button>

        <span
          style={{
            display: 'block',
            color: '#FF6B00',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            fontFamily: 'Poppins',
            marginBottom: '1rem',
          }}
        >
          — FALAR COM A ORIUM
        </span>

        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '1.75rem',
            color: '#fff',
            marginBottom: '0.5rem',
          }}
        >
          Conta um pouco sobre seu negócio
        </h2>
        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#999', marginBottom: '2rem' }}>
          Assim chegamos na conversa já alinhados.
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>SEU NOME</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como posso te chamar?"
            style={inputStyle}
            onFocus={focusOrange}
            onBlur={blurGray}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>SEGMENTO DO NEGÓCIO</label>
          <select
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            style={inputStyle}
            onFocus={focusOrange}
            onBlur={blurGray}
          >
            <option value="">Selecione uma opção</option>
            {SEGMENTOS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>INSTAGRAM DO NEGÓCIO</label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@seunegocio"
            style={inputStyle}
            onFocus={focusOrange}
            onBlur={blurGray}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>PRINCIPAL NECESSIDADE</label>
          <textarea
            rows={3}
            value={necessidade}
            onChange={(e) => setNecessidade(e.target.value)}
            placeholder="Ex: Quero melhorar minha presença no Instagram e parecer mais profissional."
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={focusOrange}
            onBlur={blurGray}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={disabled || loading}
          style={{
            background: '#FF6B00',
            color: '#000',
            width: '100%',
            padding: '16px',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            border: 'none',
            borderRadius: 0,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            opacity: disabled || loading ? 0.5 : 1,
            fontFamily: 'Poppins',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!disabled && !loading) e.currentTarget.style.background = '#ff7d1a';
          }}
          onMouseLeave={(e) => {
            if (!disabled && !loading) e.currentTarget.style.background = '#FF6B00';
          }}
        >
          Continuar no WhatsApp →
        </button>

        <p style={{ fontSize: '0.75rem', color: '#444', textAlign: 'center', marginTop: '1rem', fontFamily: 'Poppins' }}>
          Você será redirecionado para o WhatsApp. Nenhum dado é armazenado.
        </p>
      </div>
    </>
  );
}
