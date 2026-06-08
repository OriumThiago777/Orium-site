export default function StatsStrip() {
  const items = [
    { num: "01", text: "Estratégia antes da execução", icon: "icon-estrategia", alt: "Estratégia" },
    { num: "02", text: "Presença digital com percepção", icon: "icon-percepcao-digital", alt: "Percepção digital" },
    { num: "03", text: "Branding, conteúdo e estrutura", icon: "icon-conteudo", alt: "Conteúdo" },
    { num: "04", text: "Tecnologia aplicada ao negócio", icon: "icon-tecnologia", alt: "Tecnologia" },
  ];

  return (
    <section
      className="py-12 border-t border-[#1a1a1a]"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 px-4 md:px-0">
        {items.map((item, i) => (
          <div
            key={item.num}
            className={`group flex flex-col items-start transition-all duration-300 cursor-default px-5 md:px-12 py-6 md:py-0
              ${i < 2 ? "border-b border-[#1a1a1a] md:border-b-0" : ""}
              ${i < 3 ? "md:border-r md:border-r-[#1a1a1a]" : ""}
            `}
          >
            <img
              src={`/icons/${item.icon}.svg`}
              alt={item.alt}
              className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              style={{ objectFit: "contain", display: "block" }}
            />
            <div
              className="leading-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-none"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "2rem",
                color: "#FF6B00",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              {item.num}
            </div>
            <p
              className="text-white group-hover:text-[#FF6B00] transition-colors duration-300"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
