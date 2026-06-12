import Image from 'next/image';

const RADIAL = 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)';
const FULL = `${RADIAL}, linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)`;

type Props = {
  /** 'fixed' para páginas com scroll próprio (hub, biblioteca); 'absolute' para layouts fixed/overflow hidden */
  position?: 'fixed' | 'absolute';
  /** 'full' = radial + linear (padrão das ferramentas); 'radial' = só o brilho laranja */
  gradient?: 'full' | 'radial';
};

export default function ToolBackground({ position = 'fixed', gradient = 'full' }: Props) {
  return (
    <div style={{ position, inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: gradient === 'full' ? FULL : RADIAL }} />
    </div>
  );
}
