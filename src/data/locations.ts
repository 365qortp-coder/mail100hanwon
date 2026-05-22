export type Location = {
  slug: string;
  name: string;
  fullName: string;
  type: "district" | "neighborhood" | "city" | "station";
  keywords: string[];
  description: string;
  access: string;
  highlights: string[];
};

export const locations: Location[] = [
  {
    slug: "jungnang",
    name: "중랑구",
    fullName: "서울 중랑구",
    type: "district",
    keywords: ["중랑구 한의원", "중랑구 다이어트 한의원", "중랑구 공진단", "중랑한의원"],
    description:
      "매일백세한의원은 서울 중랑구 공릉로 21에 위치해 있습니다. 중랑구 주민분들이 가장 가까이 이용할 수 있는 한의원이며, 다이어트 한약·공진단·통증 치료를 모두 진행합니다.",
    access: "중랑구청에서 차량 10분, 먹골역에서 도보 5분 거리",
    highlights: ["중랑구청 인근", "먹골역세권", "주차 가능"],
  },
  {
    slug: "muk",
    name: "묵동",
    fullName: "중랑구 묵동",
    type: "neighborhood",
    keywords: ["묵동 한의원", "묵동 다이어트", "묵동 공진단"],
    description:
      "매일백세한의원은 묵동 인근에서 도보로 접근할 수 있는 거리에 있습니다. 다이어트 한약, 공진단, 총명공진단 모두 처방 가능합니다.",
    access: "묵동에서 도보 10분 내",
    highlights: ["묵동 인근", "먹골역세권"],
  },
  {
    slug: "junghwa",
    name: "중화동",
    fullName: "중랑구 중화동",
    type: "neighborhood",
    keywords: ["중화동 한의원", "중화동 다이어트 한의원"],
    description: "중화동에서 매일백세한의원까지는 차량으로 5~10분 거리입니다.",
    access: "중화역에서 차량 10분",
    highlights: ["중화동 인근", "주차 가능"],
  },
  {
    slug: "sangbong",
    name: "상봉동",
    fullName: "중랑구 상봉동",
    type: "neighborhood",
    keywords: ["상봉동 한의원", "상봉 다이어트 한의원", "상봉역 한의원"],
    description: "상봉역(7호선·경의중앙)에서 매일백세한의원까지 가까운 거리입니다.",
    access: "상봉역에서 차량 10분",
    highlights: ["상봉역 인근"],
  },
  {
    slug: "myeonmok",
    name: "면목동",
    fullName: "중랑구 면목동",
    type: "neighborhood",
    keywords: ["면목동 한의원", "면목 다이어트 한의원"],
    description: "면목동에서 매일백세한의원까지 차량 10~15분 거리입니다.",
    access: "면목역에서 차량 10~15분",
    highlights: ["면목동 인근"],
  },
  {
    slug: "sinnae",
    name: "신내동",
    fullName: "중랑구 신내동",
    type: "neighborhood",
    keywords: ["신내동 한의원", "신내 다이어트 한의원"],
    description: "신내동 주민분들도 매일백세한의원을 자주 찾으십니다.",
    access: "신내역에서 차량 10분",
    highlights: ["신내동 인근"],
  },
  {
    slug: "mangu",
    name: "망우동",
    fullName: "중랑구 망우동",
    type: "neighborhood",
    keywords: ["망우동 한의원", "망우 다이어트 한의원"],
    description: "망우동에서 매일백세한의원까지 차량 10분 거리입니다.",
    access: "망우역에서 차량 10분",
    highlights: ["망우동 인근"],
  },
  {
    slug: "nowon",
    name: "노원구",
    fullName: "서울 노원구",
    type: "district",
    keywords: ["노원 한의원", "노원구 한의원", "노원 다이어트 한의원", "노원 공진단"],
    description:
      "노원구(공릉동·하계동·월계동·중계동·상계동)에서 매일백세한의원까지 차량 15~20분 거리입니다. 비대면 진료도 가능합니다.",
    access: "공릉역·태릉입구역에서 차량 5~15분",
    highlights: ["공릉동 인근", "태릉입구역세권"],
  },
  {
    slug: "gongneung",
    name: "공릉동",
    fullName: "노원구 공릉동",
    type: "neighborhood",
    keywords: ["공릉동 한의원", "공릉 다이어트 한의원", "공릉역 한의원"],
    description:
      "한의원이 공릉로에 위치해 공릉동 주민분들이 가장 가까이 이용할 수 있습니다.",
    access: "공릉역에서 차량 5분",
    highlights: ["공릉동 인근", "공릉역세권"],
  },
  {
    slug: "hagye",
    name: "하계동",
    fullName: "노원구 하계동",
    type: "neighborhood",
    keywords: ["하계동 한의원", "하계 다이어트 한의원"],
    description: "하계동에서 매일백세한의원까지 차량 10~15분 거리입니다.",
    access: "하계역에서 차량 10분",
    highlights: ["하계동 인근"],
  },
  {
    slug: "wolgye",
    name: "월계동",
    fullName: "노원구 월계동",
    type: "neighborhood",
    keywords: ["월계동 한의원", "월계 다이어트 한의원"],
    description: "월계동에서 차량 10~15분 거리입니다.",
    access: "월계역에서 차량 15분",
    highlights: ["월계동 인근"],
  },
  {
    slug: "dongdaemun",
    name: "동대문구",
    fullName: "서울 동대문구",
    type: "district",
    keywords: [
      "동대문 한의원",
      "동대문구 한의원",
      "동대문 다이어트 한의원",
      "동대문 공진단",
      "회기 한의원",
      "청량리 한의원",
    ],
    description:
      "동대문구(회기·이문·답십리·청량리·장안)에서 매일백세한의원까지 접근성이 좋습니다.",
    access: "회기역·청량리역에서 차량 10~15분",
    highlights: ["회기동·청량리 인근"],
  },
  {
    slug: "gwangjin",
    name: "광진구",
    fullName: "서울 광진구",
    type: "district",
    keywords: ["광진구 한의원", "중곡동 한의원", "군자 한의원"],
    description: "광진구(중곡·군자·능동)에서 매일백세한의원까지 차량 15분 거리입니다.",
    access: "중곡역·군자역에서 차량 15분",
    highlights: ["중곡동·군자동 인근"],
  },
  {
    slug: "seongbuk",
    name: "성북구",
    fullName: "서울 성북구",
    type: "district",
    keywords: ["성북구 한의원", "장위동 한의원", "석관동 한의원"],
    description: "성북구(장위·석관·돌곶이)에서 매일백세한의원까지 차량 15~20분 거리입니다.",
    access: "석계역·돌곶이역에서 차량 15분",
    highlights: ["장위동·석관동 인근"],
  },
  {
    slug: "namyangju",
    name: "남양주",
    fullName: "경기 남양주시",
    type: "city",
    keywords: [
      "남양주 한의원",
      "별내 한의원",
      "다산 한의원",
      "평내호평 한의원",
      "남양주 다이어트 한의원",
      "남양주 공진단",
    ],
    description:
      "남양주(별내·다산신도시·평내호평·도농)에서 매일백세한의원까지 차량 20~30분 거리입니다. 비대면 진료도 활발히 이용되고 있습니다.",
    access: "별내·다산에서 차량 20분",
    highlights: ["별내·다산신도시 인근"],
  },
  {
    slug: "guri",
    name: "구리시",
    fullName: "경기 구리시",
    type: "city",
    keywords: ["구리 한의원", "구리 다이어트 한의원", "구리 공진단"],
    description: "구리시에서 매일백세한의원까지 차량 20분 거리입니다.",
    access: "구리역에서 차량 20분",
    highlights: ["구리시 인근"],
  },
  {
    slug: "uijeongbu",
    name: "의정부",
    fullName: "경기 의정부시",
    type: "city",
    keywords: ["의정부 한의원", "의정부 다이어트 한의원"],
    description: "의정부에서 매일백세한의원까지 차량 30분 거리입니다. 비대면 진료도 가능합니다.",
    access: "의정부에서 차량 30분",
    highlights: ["의정부 인근"],
  },
  {
    slug: "seoul",
    name: "서울 전역",
    fullName: "서울특별시",
    type: "city",
    keywords: [
      "서울 한의원",
      "서울 다이어트 한의원",
      "서울 공진단",
      "서울 한약 다이어트",
      "비대면 한의원",
    ],
    description:
      "서울 전 지역에서 비대면 진료로 매일백세한의원의 한약을 받아보실 수 있습니다. 구글 설문 → 전화 상담 → 택배 발송으로 진행됩니다.",
    access: "전국 비대면 진료 가능",
    highlights: ["서울 전역 비대면 가능", "당일~익일 택배 발송"],
  },
];

export const stations: Location[] = [
  {
    slug: "mokgol",
    name: "먹골역",
    fullName: "7호선 먹골역",
    type: "station",
    keywords: ["먹골역 한의원", "먹골역 다이어트 한의원", "먹골 한의원"],
    description:
      "매일백세한의원은 7호선 먹골역에서 도보 5분 거리에 있습니다. 먹골역세권에서 가장 가까운 한의원 중 하나입니다.",
    access: "먹골역 도보 5분",
    highlights: ["7호선 먹골역세권", "도보 5분"],
  },
  {
    slug: "taereung",
    name: "태릉입구역",
    fullName: "6·7호선 태릉입구역",
    type: "station",
    keywords: ["태릉입구역 한의원", "태릉입구 한의원"],
    description: "태릉입구역(6·7호선)에서 도보 10분 거리입니다.",
    access: "태릉입구역 도보 10분",
    highlights: ["6·7호선 환승역", "도보 10분"],
  },
  {
    slug: "hwarangdae",
    name: "화랑대역",
    fullName: "6호선 화랑대역",
    type: "station",
    keywords: ["화랑대역 한의원", "화랑대 한의원"],
    description: "화랑대역에서 차량 5분 거리입니다.",
    access: "화랑대역에서 차량 5분",
    highlights: ["6호선 화랑대역세권"],
  },
  {
    slug: "sangbong-station",
    name: "상봉역",
    fullName: "7호선·경의중앙선 상봉역",
    type: "station",
    keywords: ["상봉역 한의원", "상봉 한의원"],
    description: "상봉역에서 차량 10분 거리입니다.",
    access: "상봉역에서 차량 10분",
    highlights: ["7호선·경의중앙 환승역"],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

export function getStation(slug: string) {
  return stations.find((s) => s.slug === slug);
}
