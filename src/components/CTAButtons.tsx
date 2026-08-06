import { clinic } from "@/data/clinic";

type Props = {
  compact?: boolean;
  formUrl?: string;
  formLabel?: string;
  /** If set, replaces the form button with a Naver booking button. */
  naverUrl?: string;
};

export function CTAButtons({
  compact = false,
  formUrl,
  formLabel,
  naverUrl,
}: Props) {
  const sizeClass = compact ? "py-3 px-4 text-sm" : "py-4 px-5 text-base";
  const useNaver = Boolean(naverUrl);
  const targetForm = formUrl;
  const targetLabel = formLabel ?? "비대면 진료 신청";
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={`tel:${clinic.contact.phoneClean}`}
        className={`rn-btn-primary ${sizeClass} flex-1 flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] text-white font-bold hover:bg-[var(--brand-primary-dark)] transition`}
      >
        전화 상담
      </a>
      <a
        href={clinic.contact.kakao}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeClass} flex-1 flex items-center justify-center gap-2 rounded-full bg-[#FAE100] text-[#3C1E1E] font-bold hover:brightness-95 transition`}
      >
        카카오톡 상담
      </a>
      {useNaver && (
        <a
          href={naverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClass} flex-1 flex items-center justify-center gap-2 rounded-full bg-[#03C75A] text-white font-bold hover:brightness-95 transition`}
        >
          네이버 예약
        </a>
      )}
      {!useNaver && targetForm && (
        <a
          href={targetForm}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClass} flex-1 flex items-center justify-center gap-2 rounded-full bg-[#0F0D0A] text-white font-bold hover:bg-[var(--brand-primary)] transition`}
        >
          {targetLabel}
        </a>
      )}
    </div>
  );
}
