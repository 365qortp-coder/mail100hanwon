import Link from "next/link";
import { clinic } from "@/data/clinic";

const groups = [
  {
    title: "진료",
    links: [
      { href: "/diet", label: "매일감비환" },
      { href: "/gongjindan", label: "공진단" },
      { href: "/nmc", label: "무릎관절 NMC" },
    ],
  },
  {
    title: "한의원",
    links: [
      { href: "/about", label: "원장 소개" },
      { href: "/columns", label: "건강 칼럼" },
      { href: "/faq", label: "자주 묻는 질문" },
      { href: "/bmr", label: "기초대사량 계산기" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.06] mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-12 md:py-14">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="md:max-w-[260px]">
            <div className="flex items-center gap-2 mb-5" aria-label={clinic.name}>
              <span className="flex flex-col items-center justify-center bg-[var(--brand-primary)] text-white font-extrabold rounded-[3px] w-8 h-11 text-sm leading-tight">
                <span>매</span>
                <span>일</span>
              </span>
              <span className="font-serif text-2xl font-bold text-white tracking-[-0.025em] whitespace-nowrap">
                백세한의원
              </span>
            </div>
            <address className="not-italic text-sm text-white/40 leading-[1.9]">
              {clinic.address.full}
              <br />
              먹골역 도보 5분 (7호선) · 대표원장 {clinic.director.name}
              <br />
              <a href={`tel:${clinic.contact.phoneClean}`} className="hover:text-white transition-colors duration-200">
                {clinic.contact.phone}
              </a>
            </address>
            <dl className="mt-4 text-xs text-white/30 leading-[1.9]">
              <div>평일 {clinic.hours.weekday} · 토 {clinic.hours.saturday}</div>
              <div>일요일 {clinic.hours.sunday} · 점심 {clinic.hours.lunch}</div>
            </dl>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-4">{g.title}</p>
                <ul className="space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-4">상담</p>
              <ul className="space-y-2.5">
                <li>
                  <a href={`tel:${clinic.contact.phoneClean}`} className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                    전화 {clinic.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={clinic.contact.kakao} target="_blank" rel="noopener noreferrer" className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                    카카오톡 채널
                  </a>
                </li>
                <li>
                  <a href={clinic.contact.onlineForm} target="_blank" rel="noopener noreferrer" className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                    비대면 신청
                  </a>
                </li>
                <li>
                  <a href="https://care.mail100hanwon.co.kr" rel="noopener" className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                    건강칼럼 블로그
                  </a>
                </li>
                <li>
                  <a href="https://hanbangwiki.kr" rel="noopener" className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                    한방위키 · 한의학 정보 백과
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-white/25 order-2 md:order-1 leading-relaxed">
            © {new Date().getFullYear()} {clinic.name}. 대표원장 {clinic.director.name}
            <br className="md:hidden" />
            <span className="md:ml-2">본 사이트의 의료광고는 대한한의사협회 의료광고 심의를 받은 콘텐츠만 게시합니다.</span>
          </p>
          <div className="flex items-center gap-5 order-1 md:order-2">
            <a href={clinic.youtube.diet} target="_blank" rel="noopener" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
              YouTube 다이어트
            </a>
            <a href={clinic.youtube.gongjindan} target="_blank" rel="noopener" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
              YouTube 공진단
            </a>
            <a href={clinic.youtube.pain} target="_blank" rel="noopener" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
              YouTube 통증
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
