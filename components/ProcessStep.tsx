type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 overflow-hidden">
      <div className="absolute right-6 top-6 text-6xl font-black text-orange-500/10">
        {number}
      </div>

      <div className="relative z-10">
        <p className="text-orange-500 font-semibold mb-4 text-[0.95rem]">
          Etapa {number}
        </p>

        <h3 className="text-xl md:text-2xl font-bold mb-4">
          {title}
        </h3>

        <p className="text-zinc-400 text-[0.95rem] leading-[1.6]">
          {description}
        </p>
      </div>
    </div>
  );
}
