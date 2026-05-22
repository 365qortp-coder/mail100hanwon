import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "large" | "small" }) {
  const sizes = {
    small: { badge: "text-xs px-1.5 py-1", text: "text-base" },
    default: { badge: "text-sm px-2 py-1.5", text: "text-lg" },
    large: { badge: "text-base px-2.5 py-2", text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="logo-mark group" aria-label="매일백세한의원 홈">
      <span className={`logo-mark__badge ${s.badge}`}>
        <span>매</span>
        <span>일</span>
      </span>
      <span className={`logo-mark__text ${s.text}`}>백세한의원</span>
    </Link>
  );
}
