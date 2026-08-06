import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  bg?: "white" | "muted" | "brand" | "accent";
};

export function Section({ children, className = "", id, bg = "white" }: Props) {
  const bgClass = {
    white: "bg-[var(--surface)]",
    muted: "bg-[var(--surface-muted)]",
    brand: "bg-[var(--brand-primary)] text-white",
    accent: "bg-[var(--brand-accent-light)]",
  }[bg];

  return (
    <section id={id} className={`${bgClass} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-3xl mb-10 ${alignClass}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="h-px w-6 bg-black/20" aria-hidden />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8A87]">
            {eyebrow}
          </span>
          {align === "center" && <span className="h-px w-6 bg-black/20" aria-hidden />}
        </div>
      )}
      <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.025em] text-[#0a0a0a] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-[#525252] leading-[1.75]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
