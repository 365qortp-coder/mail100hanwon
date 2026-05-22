import { clinic } from "@/data/clinic";

export function CTAButtons({
  compact = false,
  formUrl,
  formLabel,
}: {
  compact?: boolean;
  formUrl?: string;
  formLabel?: string;
}) {
  const sizeClass = compact ? "py-3 px-4 text-sm" : "py-4 px-5 text-base";
  const targetForm = formUrl ?? clinic.contact.onlineForm;
  const targetLabel = formLabel ?? "비대면 진료 신청";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <a
        href={`tel:${clinic.contact.phoneClean}`}
        className={`${sizeClass} flex items-center justify-center gap-2 rounded-md bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition`}
      >
        📞 전화 상담
      </a>
      <a
        href={clinic.contact.kakao}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeClass} flex items-center justify-center gap-2 rounded-md bg-[#FAE100] text-[#3C1E1E] font-semibold hover:brightness-95 transition`}
      >
        💬 카카오톡 상담
      </a>
      <a
        href={targetForm}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeClass} flex items-center justify-center gap-2 rounded-md bg-[var(--brand-accent)] text-white font-semibold hover:brightness-95 transition`}
      >
        📝 {targetLabel}
      </a>
    </div>
  );
}
