export default function StatsStrip() {
  const items = [
    { num: "01", text: "Estratégia antes da execução" },
    { num: "02", text: "Presença digital com percepção" },
    { num: "03", text: "Branding, conteúdo e estrutura" },
    { num: "04", text: "Tecnologia aplicada ao negócio" },
  ];

  return (
    <section
      className="py-16 border-t border-[#1a1a1a]"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 px-4 md:px-0">
        {items.map((item, i) => (
          <div
            key={item.num}
            className="group flex flex-col items-start transition-all duration-300 cursor-default px-6 md:px-12"
            style={{
              borderRight: i < items.length - 1 ? "1px solid #1a1a1a" : "none",
            }}
          >
            <div
              className="leading-none mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-none"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "3rem",
                color: "#FF6B00",
                lineHeight: 1,
                marginBottom: "0.75rem",
              }}
            >
              {item.num}
            </div>
            <p
              className="text-white group-hover:text-[#FF6B00] transition-colors duration-300"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
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
