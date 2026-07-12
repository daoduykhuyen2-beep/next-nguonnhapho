// Sinh so luot xem / luot quan tam "ao" cho moi tin dang.
// - On dinh theo id (cung 1 tin luon ra cung con so tai mot thoi diem).
// - Tang dan theo so ngay ke tu ngay dang (created_at).
// - Luot quan tam = 5% luot xem.

// Ham bam don gian, tra ve so 0..1 on dinh theo seed.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export type FakeStats = {
  views: number;
  interested: number;
};

export function getFakeStats(id: number | null | undefined, createdAt?: string | null): FakeStats {
  const safeId = typeof id === "number" && !Number.isNaN(id) ? id : 1;

  // An luot xem / quan tam trong 5 gio dau sau khi dang tin
  if (createdAt) {
    const _t = new Date(createdAt).getTime();
    if (!Number.isNaN(_t) && Date.now() - _t < 5 * 60 * 60 * 1000) {
      return { views: 0, interested: 0 };
    }
  }

  // So ngay ke tu ngay dang (toi thieu 0).
  let days = 0;
  if (createdAt) {
    const created = new Date(createdAt).getTime();
    if (!Number.isNaN(created)) {
      days = Math.max(0, Math.floor((Date.now() - created) / 86400000));
    }
  }

  // So nen ban dau: 50..400 (on dinh theo id).
  const base = 50 + Math.floor(seededRandom(safeId * 7.13 + 1) * 351);

  // Toc do tang moi ngay: 30..250 (on dinh theo id).
  const perDay = 30 + Math.floor(seededRandom(safeId * 3.71 + 2) * 221);

  // Nhieu nho theo tung ngay de con so khong qua deu.
  let noise = 0;
  for (let d = 1; d <= days; d++) {
    noise += Math.floor(seededRandom(safeId * 1.37 + d) * 21) - 10; // -10..+10
  }

  const views = Math.max(0, base + perDay * days + noise);
  const interested = Math.round(views * 0.05);

  return { views, interested };
}
