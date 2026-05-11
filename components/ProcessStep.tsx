type ServiceCardProps = {
  title: string;
  description: string;
};

export default function ServiceCard({
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="border border-zinc-800 rounded-3xl p-8 hover:border-orange-500 transition">

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>

    </div>
  );
}