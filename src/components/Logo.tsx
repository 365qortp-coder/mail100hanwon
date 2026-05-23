"use client";

import Link from "next/link";
import { useState } from "react";

type Size = "default" | "large" | "small";

const dimensions: Record<Size, { w: number; h: number; cls: string; fallbackBadge: string; fallbackText: string }> = {
  small: {
    w: 163,
    h: 38,
    cls: "h-8 w-auto",
    fallbackBadge: "text-[10px] px-1 py-0.5",
    fallbackText: "text-base",
  },
  default: {
    w: 214,
    h: 50,
    cls: "h-10 w-auto",
    fallbackBadge: "text-xs px-1.5 py-1",
    fallbackText: "text-lg",
  },
  large: {
    w: 300,
    h: 70,
    cls: "h-14 w-auto",
    fallbackBadge: "text-base px-2 py-1.5",
    fallbackText: "text-2xl",
  },
};

export function Logo({ size = "default" }: { size?: Size }) {
  const d = dimensions[size];
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      href="/"
      aria-label="매일백세한의원 홈"
      className="inline-flex items-center select-none"
    >
      {imgFailed ? (
        <span className="inline-flex items-stretch gap-1.5">
          <span
            className={`flex flex-col items-center justify-center bg-[#c0252d] text-white font-black leading-none rounded ${d.fallbackBadge}`}
          >
            <span>매</span>
            <span className="mt-0.5">일</span>
          </span>
          <span
            className={`self-center font-black tracking-tight text-black ${d.fallbackText}`}
          >
            백세한의원
          </span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="매일백세한의원"
          width={d.w}
          height={d.h}
          className={`${d.cls} object-contain`}
          onError={() => setImgFailed(true)}
        />
      )}
    </Link>
  );
}
