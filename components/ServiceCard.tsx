type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
};

export default function ServiceCard({ title, description, index }: ServiceCardProps) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="group relative flex items-start gap-8 md:gap-14 py-8 md:py-10 border-b border-[#1a1a1a] transition-all duration-300 cursor-default pl-4">
      {/* Left orange accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Decorative number */}
      <div
        className="flex-shrink-0 leading-none select-none opacity-[0.15] group-hover:opacity-100 transition-opacity duration-300"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "4rem",
          color: "#FF6B00",
        }}
      >
        {num}
      </div>

      {/* Content */}
      <div className="flex-1 pt-3">
        <h3
          className="mb-2 md:mb-3 text-white"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
        <p
          className="text-[#999] text-[0.9rem] leading-[1.7]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
