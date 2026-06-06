import Image from "next/image";

type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
  icon?: string;
};

export default function ServiceCard({ title, description, index, icon }: ServiceCardProps) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="group relative flex items-start gap-8 md:gap-14 py-6 border-b border-[#1a1a1a] transition-all duration-300 cursor-default pl-4">
      {/* Left orange accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon + Decorative number stacked */}
      <div className="flex-shrink-0 flex flex-col items-start gap-3 pt-1" style={{ width: "100px" }}>
        {icon && (
          <Image
            src={`/icons/icon-${icon}.svg`}
            alt={title}
            width={32}
            height={32}
            className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
        <div
          className="leading-none select-none opacity-[0.15] group-hover:opacity-100 transition-opacity duration-300"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "4rem",
            color: "#FF6B00",
          }}
        >
          {num}
        </div>
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
