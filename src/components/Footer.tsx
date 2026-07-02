import Link from "next/link";
import { clinic } from "@/data/clinic";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <Logo size="default" />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {clinic.address.full}
              <br />
              대표원장 {clinic.director.name}
              <br />
              전화{" "}
              <a
                href={`tel:${clinic.contact.phoneClean}`}
                className="text-[var(--brand-primary)] font-semibold hover:text-white"
              >
                {clinic.contact.phone}
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white">진료 시간</h4>
            <dl className="text-sm text-white/70 space-y-1.5">
              <div className="flex gap-3">
                <dt className="w-12">평일</dt>
                <dd>{clinic.hours.weekday}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12">토요일</dt>
                <dd>{clinic.hours.saturday}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12">일요일</dt>
                <dd>{clinic.hours.sunday}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12">점심</dt>
                <dd>{clinic.hours.lunch}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white">진료 안내</h4>
            <ul className="text-sm text-white/70 space-y-2">
              <li>
                <Link href="/diet" className="hover:text-white">
                  매일감비환 다이어트
                </Link>
              </li>
              <li>
                <Link href="/gongjindan" className="hover:text-white">
                  공진단
                </Link>
              </li>
              <li>
                <Link href="/nmc" className="hover:text-white">
                  무릎관절 NMC
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
            <br />
            본 사이트의 의료광고는 대한한의사협회 의료광고 심의를 받은 콘텐츠만 게시합니다.
          </p>
          <div className="flex gap-4">
            <a href={clinic.youtube.diet} target="_blank" rel="noopener" className="hover:text-white">
              YouTube 다이어트
            </a>
            <a href={clinic.youtube.gongjindan} target="_blank" rel="noopener" className="hover:text-white">
              YouTube 공진단
            </a>
            <a href={clinic.youtube.pain} target="_blank" rel="noopener" className="hover:text-white">
              YouTube 통증
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
