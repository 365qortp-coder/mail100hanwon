"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** 페이지 이동 때마다 .sn-reveal 요소를 다시 관찰한다.
 *  (페이지별 인라인 스크립트는 클라이언트 내비게이션에서 재실행되지 않아
 *  요소가 숨김 상태로 남는 버그가 있었음) */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("sn-js");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sn-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    document.querySelectorAll(".sn-reveal:not(.sn-visible)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
