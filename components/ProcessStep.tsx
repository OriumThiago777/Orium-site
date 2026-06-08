type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
  last?: boolean;
};

export default function ProcessStep({ number, title, description, last }: ProcessStepProps) {
  return (
    <div
      className={`group flex items-start border-l border-[#1a1a1a] pl-5 md:pl-8 py-5 md:py-6 hover:border-[#FF6B00] transition-all duration-300${
        last ? "" : " max-md:border-b max-md:pb-8"
      }`}
    >
      <div
        className="flex-shrink-0 select-none pointer-events-none opacity-[0.12] group-hover:opacity-[0.30] transition-opacity duration-300 leading-none w-[60px] md:w-[clamp(60px,12vw,80px)]"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(3rem, 8vw, 5rem)",
          color: "#FF6B00",
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div className="flex-1 pt-1">
        <p
          className="mb-2 uppercase font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.75rem",
            color: "#FF6B00",
            letterSpacing: "0.1em",
          }}
        >
          Etapa {number}
        </p>
        <h3
          className="mb-3 text-white"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
        <p
          className="text-[#999] leading-[1.6]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(0.875rem, 3.5vw, 0.9rem)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
