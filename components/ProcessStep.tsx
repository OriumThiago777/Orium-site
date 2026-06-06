type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="group relative border-l border-[#1a1a1a] pl-6 md:pl-8 py-6 overflow-hidden transition-all duration-300 hover:border-[#FF6B00]">
      {/* Decorative large number behind content */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.08] group-hover:opacity-[0.20] transition-opacity duration-300"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "6rem",
          lineHeight: 1,
          color: "#FF6B00",
          zIndex: 0,
        }}
      >
        {number}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <p className="text-orange-500 font-semibold mb-4 text-[0.95rem]">
          Etapa {number}
        </p>
        <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>
        <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">{description}</p>
      </div>
    </div>
  );
}
