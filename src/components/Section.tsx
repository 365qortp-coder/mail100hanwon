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
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">{children}</div>
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
    <div className={`max-w-3xl mb-8 ${alignClass}`}>
      {eyebrow && (
        <p className="text-xs md:text-sm font-semibold tracking-widest text-[var(--brand-primary)] uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-snug">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
