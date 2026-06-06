export default function StatsStrip() {
  const items = [
    "Estratégia antes da execução",
    "Presença digital com percepção",
    "Branding, conteúdo e estrutura",
    "Tecnologia aplicada ao negócio",
  ];

  return (
    <section className="border-t border-[#1a1a1a] bg-[#080808] py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-4 md:grid-cols-4 md:px-8 lg:px-16">
        {items.map((text, i) => (
          <div
            key={text}
            className="px-5 py-4 border-r border-[#1a1a1a] last:border-r-0 first:pl-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  width: 20,
                  height: 1,
                  background: "#FF6B00",
                  opacity: 0.6,
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "#FF6B00",
                  fontWeight: 500,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
            </div>
            <p className="text-[0.9rem] leading-[1.55] text-zinc-400">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
