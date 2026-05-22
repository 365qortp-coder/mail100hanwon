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

export function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}
