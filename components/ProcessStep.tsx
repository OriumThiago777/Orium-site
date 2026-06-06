type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="group flex items-start border-l border-[#1a1a1a] pl-8 py-6 hover:border-[#FF6B00] transition-all duration-300">
      <div
        className="flex-shrink-0 select-none pointer-events-none opacity-[0.12] group-hover:opacity-[0.30] transition-opacity duration-300 leading-none"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "5rem",
          color: "#FF6B00",
          width: "80px",
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
            fontSize: "0.8rem",
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
            fontSize: "1.5rem",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
        <p
          className="text-[#999] leading-[1.6]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
