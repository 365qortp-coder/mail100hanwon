export const clinic = {
  name: "매일백세한의원",
  nameEn: "Mail100han Korean Medicine Clinic",
  director: {
    name: "송원석",
    title: "대표원장",
    description:
      "매일백세한의원 대표원장 송원석. 대전대학교 한의과대학 출신(05학번)으로, 한방 다이어트·공진단·통증 진료를 직접 처방합니다. 열린의사회·국경없는의사회 회원으로 의료 봉사 활동을 이어오고 있습니다.",
    school: "대전대학교 한의과대학 (05학번)",
    credentials: [
      "매일백세한의원 대표원장",
      "전) 365백세한의원 대표",
      "전) 대한상한금궤학회 교육위원",
      "전) 건강보험공단 등급판정의원",
      "대한한방비만학회 회원",
      "열린의사회 회원",
      "국경없는의사회 회원",
    ],
  },
  stats: {
    yearsOpen: 11,
    yearsMakingGongjindan: 7,
    dietConsults: 70000,
  },
  philosophy: {
    umbrella: "직접 해보고 효과 있는 치료만 합니다",
    byTreatment: [
      {
        slug: "pain",
        label: "통증",
        quote: "정확하게 진단하고 끝까지 치료합니다",
      },
      {
        slug: "diet",
        label: "다이어트",
        quote: "엄마들을 위한 쉽고 건강한 다이어트",
      },
      {
        slug: "gongjindan",
        label: "공진단",
        quote: "직접 빚고, 직접 복용하고, 우리 아이도 먹입니다",
      },
    ],
  },
  address: {
    full: "서울특별시 중랑구 공릉로 21",
    city: "서울특별시",
    district: "중랑구",
    street: "공릉로 21",
    postalCode: "",
    region: "서울",
    country: "KR",
  },
  contact: {
    phone: "02-2234-0102",
    phoneClean: "0222340102",
    phoneInternational: "+82-2-2234-0102",
    kakao: "http://pf.kakao.com/_JEzRK/chat",
    onlineForm:
      "https://docs.google.com/forms/d/1g2IhZ3c4dqW5nhrYuZBgguIPKBULiZZWI_PgroqlseQ/viewform",
    onlineFormDiet:
      "https://docs.google.com/forms/d/1g2IhZ3c4dqW5nhrYuZBgguIPKBULiZZWI_PgroqlseQ/viewform",
    onlineFormGongjindan:
      "https://docs.google.com/forms/d/1bY4A3UzxH1jkZQU6azXtrmVwtUxJwKYRRKDo5gLFqo0/viewform",
    naverBooking: "https://naver.me/F88gzvcg",
  },
  domain: "mail100hanwon.co.kr",
  url: "https://mail100hanwon.co.kr",
  brands: {
    diet: "매일감비환",
    chongmyeong: "총명공진단",
    gongjindan: "공진단",
  },
  nearestStations: [
    { name: "먹골역", line: "7호선", distance: "도보 5분" },
    { name: "태릉입구역", line: "6·7호선", distance: "도보 10분" },
    { name: "화랑대역", line: "6호선", distance: "차로 5분" },
  ],
  youtube: {
    diet: "https://www.youtube.com/channel/UC6Mf-wiyKvWup51wgGzjE4A",
    gongjindan:
      "https://www.youtube.com/@%EC%A7%81%EC%A0%91%EB%A7%8C%EB%93%A0%EC%A7%84%EC%A7%9C%EA%B3%B5%EC%A7%84%EB%8B%A8",
    pain: "https://www.youtube.com/@%EB%A7%A4%EC%9D%BC%EB%B0%B1%EC%84%B8%ED%95%9C%EC%9D%98%EC%9B%90_%ED%86%B5%EC%A6%9D",
  },
  hours: {
    weekday: "09:30 - 18:30",
    saturday: "09:30 - 13:00",
    sunday: "휴진",
    lunch: "13:00 - 14:00",
  },
  geo: {
    latitude: 37.6094,
    longitude: 127.0763,
  },
} as const;

export type Clinic = typeof clinic;
