import Link from "next/link";
import { clinic } from "@/data/clinic";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-primary-dark)] text-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">{clinic.name}</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              {clinic.address.full}
              <br />
              대표원장 {clinic.director.name}
              <br />
              전화{" "}
              <a
                href={`tel:${clinic.contact.phoneClean}`}
                className="underline hover:text-white"
              >
                {clinic.contact.phone}
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">진료 시간</h4>
            <dl className="text-sm text-white/80 space-y-1">
              <div className="flex gap-3">
                <dt>평일</dt>
                <dd>{clinic.hours.weekday}</dd>
              </div>
              <div className="flex gap-3">
                <dt>토요일</dt>
                <dd>{clinic.hours.saturday}</dd>
              </div>
              <div className="flex gap-3">
                <dt>일요일</dt>
                <dd>{clinic.hours.sunday}</dd>
              </div>
              <div className="flex gap-3">
                <dt>점심</dt>
                <dd>{clinic.hours.lunch}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-semibold mb-3">진료 안내</h4>
            <ul className="text-sm text-white/80 space-y-1.5">
              <li>
                <Link href="/treatments/diet" className="hover:text-white">
                  매일감비환 다이어트
                </Link>
              </li>
              <li>
                <Link href="/treatments/gongjindan" className="hover:text-white">
                  공진단
                </Link>
              </li>
              <li>
                <Link href="/treatments/chongmyeong" className="hover:text-white">
                  총명공진단
                </Link>
              </li>
              <li>
                <Link href="/treatments/pain" className="hover:text-white">
                  통증 치료
                </Link>
              </li>
              <li>
                <Link href="/online" className="hover:text-white">
                  비대면 진료
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

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
            <br />
            본 사이트의 의료광고는 대한한의사협회 의료광고 심의를 받은 콘텐츠만 게시합니다.
          </p>
          <div className="flex gap-4">
            <a href={clinic.youtube.diet} target="_blank" rel="noopener" className="hover:text-white">
              유튜브 (다이어트)
            </a>
            <a href={clinic.youtube.gongjindan} target="_blank" rel="noopener" className="hover:text-white">
              유튜브 (공진단)
            </a>
            <a href={clinic.youtube.pain} target="_blank" rel="noopener" className="hover:text-white">
              유튜브 (통증)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
