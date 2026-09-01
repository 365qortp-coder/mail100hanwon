import { NextRequest, NextResponse } from "next/server";
import { clinic } from "@/data/clinic";
import { CATEGORY_SECTION, getAllColumns } from "@/lib/columns";

/**
 * 병원 정보·카테고리 내보내기 — 관리 앱의 홈페이지 등록 화면이
 * "주소만 넣으면 병원 이름·전화·주소·진료시간이 자동으로 채워지게" 하는 문.
 * 규격: `마케팅의 정석 홈페이지 CMS 연결 규격.md` 4장·5장
 *
 * 공개 정보(사이트 하단에 이미 다 적혀 있는 내용)라 열쇠가 필요 없습니다.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || clinic.url || new URL(req.url).origin
  ).replace(/\/$/, "");

  // 카테고리: 이 사이트는 한글 이름을 그대로 식별자로 쓴다.
  // 미리 정해 둔 것 + 실제 글에 쓰인 것을 합쳐서 내보낸다.
  const used = new Set(getAllColumns().map((c) => c.category));
  const keys = [...new Set([...Object.keys(CATEGORY_SECTION), ...used])];
  const categories = keys.map((key, i) => ({ key, label: key, sort_order: i }));

  return NextResponse.json({
    ok: true,
    site_url: siteUrl,
    clinic: {
      name: clinic.name,
      tel: clinic.contact.phone,
      address: clinic.address.full,
      hours: [
        { day: "평일", time: clinic.hours.weekday },
        { day: "점심", time: clinic.hours.lunch },
        { day: "토요일", time: clinic.hours.saturday },
        { day: "일요일", time: clinic.hours.sunday },
      ],
      director: clinic.director.name,
      kakao: clinic.contact.kakao,
      naver_booking: clinic.contact.naverBooking,
    },
    categories,
  });
}
