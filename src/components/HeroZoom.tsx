"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * 홈 히어로 — 줌인 시작 + 스크롤 2막 전환.
 *
 * 규칙 전문: C:\claude\홈페이지\홈페이지디자인\규칙\히어로-줌인트로.md
 * 스타일은 globals.css 의 .hz-* 규칙. 움직임 값은 그 규칙집이 정하고,
 * 색·글꼴은 이 사이트 기준(DESIGN-BASELINE.md)을 따른다.
 *
 * 헤더는 이 히어로가 화면에 있는 동안 투명해진다 —
 * Header.tsx 가 #hz-track 을 보고 스스로 판단하므로 여기서 건드릴 것은 없다.
 */
export function HeroZoom() {
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

    let ticking = false;
    const update = () => {
      ticking = false;
      const t = track.current;
      if (!t) return;
      const span = t.offsetHeight - window.innerHeight;
      const p = clamp(-t.getBoundingClientRect().top / (span || 1), 0, 1);
      const e = reduce ? (p > 0.5 ? 1 : 0) : ease(p);   // 움직임 줄이기면 중간값 없이 스냅

      // 사진은 크기 그대로 화면을 채운다. 2막 글자를 살릴 만큼만 어둡게.
      if (frame.current) frame.current.style.filter = `brightness(${1 - 0.38 * e})`;

      // 1막 — 위로 빠지며 사라진다
      const k = clamp(p / 0.3, 0, 1);
      if (copy.current) {
        copy.current.style.transform = `translateY(${-40 * k}px)`;
        copy.current.style.opacity = String(1 - k);
        copy.current.style.pointerEvents = k > 0.9 ? "none" : "";
      }
      if (hint.current) hint.current.style.opacity = String(1 - k);

      // 2막 — 떠오른다
      const q = clamp((p - 0.38) / 0.42, 0, 1);
      if (reveal.current) {
        reveal.current.style.transform = `translateY(${28 * (1 - q)}px)`;
        reveal.current.style.opacity = String(q);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="hz-track" id="hz-track" ref={track}>
      <div className="hz-stage">
        <div className="hz-frame" ref={frame}>
          <div className="hz-photo">
            <Image
              src="/photos/director-interview.webp"
              alt="서울 중랑구 매일백세한의원 송원석 원장이 비대면 진료 상담을 하는 모습"
              fill
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* 1막 — 첫 화면. 줄마다 래퍼가 있어야 줄 단위로 떠오른다 */}
        <div className="hz-copy" ref={copy}>
          <p className="hz-place">서울 중랑구 · 매일백세한의원</p>
          <h1 className="hz-main">
            <span className="hz-line">
              <span>직접 해보고,</span>
            </span>
            <span className="hz-line">
              <span className="hz-l2">효과 있는 진료만</span>
            </span>
          </h1>
          <p className="hz-sub">
            <span className="hz-line">
              <span>정확하게 진단하고 끝까지 치료합니다.</span>
            </span>
          </p>
          <ul className="hz-tags">
            <li>다이어트 한약</li>
            <li>공진단</li>
            <li>무릎관절 NMC</li>
            <li>비대면 진료</li>
          </ul>
        </div>

        {/* 2막 — 스크롤하면 떠오른다 */}
        <div className="hz-reveal" ref={reveal}>
          <p className="hz-eyebrow">CONSULTATION FIRST</p>
          <h2 className="hz-title">
            비대면 진료도
            <br />
            똑같이 진료합니다
          </h2>
          <p className="hz-body">꼼꼼하게 상담한 뒤 처방합니다.</p>
          <p className="hz-sign">송원석 원장</p>
        </div>

        <div className="hz-hint" ref={hint}>
          <span>SCROLL</span>
          <i />
        </div>
      </div>
    </div>
  );
}
