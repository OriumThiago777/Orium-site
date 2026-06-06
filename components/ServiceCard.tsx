type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
  icon?: string;
};

export default function ServiceCard({ title, description, index, icon }: ServiceCardProps) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="group relative flex items-start gap-6 md:gap-14 py-6 border-b border-[#1a1a1a] transition-all duration-300 cursor-default pl-4">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex-shrink-0 flex flex-col items-start gap-3 pt-1" style={{ width: "80px" }}>
        {icon && (
          <div
            className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              width: "72px",
              height: "72px",
              minWidth: "72px",
              minHeight: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 107, 0, 0.06)",
              border: "1px solid rgba(255, 107, 0, 0.25)",
              padding: "8px",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            <img
              src={`/icons/icon-${icon}.svg`}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        )}
        <div
          className="leading-none select-none opacity-[0.15] group-hover:opacity-100 transition-opacity duration-300"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "3.5rem",
            color: "#FF6B00",
          }}
        >
          {num}
        </div>
      </div>

      <div className="flex-1 pt-2">
        <h3
          className="mb-2 md:mb-3 text-white"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 2rem)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
        <p
          className="text-[#999] leading-[1.7]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(0.875rem, 3.5vw, 0.9rem)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
