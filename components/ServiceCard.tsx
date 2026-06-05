type ServiceCardProps = {
  title: string;
  description: string;
};

export default function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 transition duration-300 md:hover:-translate-y-2 md:hover:border-orange-500/70 md:hover:bg-zinc-950 md:hover:shadow-2xl md:hover:shadow-orange-500/10">
      <div className="absolute right-[-80px] top-[-80px] h-40 w-40 rounded-full bg-orange-500/0 blur-xl transition duration-300 group-hover:bg-orange-500/10" />

      <div className="relative z-10">
        <div className="mb-6 h-2 w-12 rounded-full bg-orange-500/80 transition duration-300 group-hover:w-20" />

        <h3 className="mb-4 text-xl md:text-2xl font-bold text-white">
          {title}
        </h3>

        <p className="text-[0.95rem] leading-[1.6] text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
