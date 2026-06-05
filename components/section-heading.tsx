type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <span className="text-xs font-semibold tracking-[0.3em] text-cyan-300 uppercase">
        {eyebrow}
      </span>
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
