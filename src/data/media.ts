/**
 * Media references pulled from existing imweb sites and YouTube channels.
 * These URLs are stable CDN paths from the clinic's prior websites.
 */

export const media = {
  diet: {
    hero: "https://cdn.imweb.me/thumbnail/20260507/4e9bc4d71df3a.png",
    product1: "https://cdn.imweb.me/thumbnail/20251101/65e885a87e9ea.jpg",
    product2: "https://cdn.imweb.me/thumbnail/20251101/864debd7ad50b.jpg",
    feature1: "https://cdn.imweb.me/thumbnail/20251101/95ed6b56dbe23.jpg",
    feature2: "https://cdn.imweb.me/thumbnail/20251101/fb610c264eb9e.jpg",
    feature3: "https://cdn.imweb.me/thumbnail/20251101/4411af74e2f1d.jpg",
    feature4: "https://cdn.imweb.me/thumbnail/20251101/f73fceef1b608.jpg",
    director: "https://cdn.imweb.me/thumbnail/20260128/e8066237ca2fc.png",
  },
  gongjindan: {
    hero: "https://cdn.imweb.me/thumbnail/20240309/8e8a5bf2dd22a.png",
    product1: "https://cdn.imweb.me/thumbnail/20240309/2c24fe6347141.jpg",
    ingredient: "https://cdn.imweb.me/thumbnail/20240309/c26eca8d354e5.png",
    process1: "https://cdn.imweb.me/thumbnail/20240316/867be3b39e9b1.jpg",
    process2: "https://cdn.imweb.me/thumbnail/20240316/3876ef976414b.jpg",
    process3: "https://cdn.imweb.me/thumbnail/20240420/00f1b7a585328.jpg",
    process4: "https://cdn.imweb.me/thumbnail/20240420/94e38f2b38beb.jpg",
  },
  chongmyeong: {
    hero: "https://cdn.imweb.me/thumbnail/20250730/f886ae386ac98.png",
    product1: "https://cdn.imweb.me/thumbnail/20250730/4022b03c3aacb.png",
    product2: "https://cdn.imweb.me/thumbnail/20250730/f748bd592dd18.png",
    product3: "https://cdn.imweb.me/thumbnail/20250730/29810db49481f.png",
    student: "https://cdn.imweb.me/thumbnail/20250730/4812940593685.jpg",
  },
  // 채널 ID 또는 핸들에서 직접 추출한 채널 썸네일은 추후 추가 가능.
  youtube: {
    dietChannelId: "UC6Mf-wiyKvWup51wgGzjE4A",
  },
} as const;
