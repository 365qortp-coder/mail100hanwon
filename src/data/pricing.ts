export type PricingItem = {
  label: string;
  packages: { name: string; price: number; unit: string }[];
  note?: string;
};

export const pricing: PricingItem[] = [
  {
    label: "매일감비환 다이어트 한약",
    packages: [
      { name: "1개월 다이어트 (5통)", price: 110000, unit: "원" },
      { name: "2개월 다이어트 (10통)", price: 179000, unit: "원" },
      { name: "3개월 다이어트 (15통)", price: 259000, unit: "원" },
      { name: "2개월 + 6개월 요요케어 (20통)", price: 339000, unit: "원" },
      { name: "3개월 + 6개월 요요케어 (30통)", price: 479000, unit: "원" },
    ],
    note: "통당 한약은 일정 기간 복용분입니다. 자세한 복용법은 상담 시 안내드립니다.",
  },
  {
    label: "장기 처방",
    packages: [
      { name: "48통", price: 660000, unit: "원" },
      { name: "72통", price: 936000, unit: "원" },
      { name: "96통", price: 1152000, unit: "원" },
    ],
    note: "장기 처방은 재진 환자 기준 처방 가능합니다.",
  },
];

export const gongjindanPricing: PricingItem[] = [
  {
    label: "사향공진단",
    packages: [
      { name: "30구 (약 1개월)", price: 1350000, unit: "원" },
      { name: "60구 (약 2개월)", price: 2400000, unit: "원" },
      { name: "100구", price: 3500000, unit: "원" },
    ],
    note: "천연 사향 100mg 포함. 기력 상승·남성 스태미너·뇌기능 회복.",
  },
  {
    label: "녹용 2배 공진단",
    packages: [
      { name: "30구 (약 1개월)", price: 420000, unit: "원" },
      { name: "60구 (약 2개월)", price: 780000, unit: "원" },
      { name: "120구", price: 1200000, unit: "원" },
    ],
    note: "체력·면역력 회복, 수술 후·항암 후 회복에 적합.",
  },
  {
    label: "총명공진단",
    packages: [
      { name: "30구 (약 1개월)", price: 450000, unit: "원" },
      { name: "60구 (약 2개월)", price: 840000, unit: "원" },
      { name: "90구 (약 3개월)", price: 1080000, unit: "원" },
    ],
    note: "수험생·고시생 대상. 원지·석창포 추가 처방.",
  },
];

export function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}
