// Sinh so luot xem / luot quan tam "ao" cho moi tin dang.
// - On dinh theo id + moc thoi gian (cung 1 tin, cung 1 thoi diem luon ra cung con so).
// - Tin thuong: an trong 5 tieng dau, sau do tang nhe theo ngay.
// - Day tin (boost): trong 24h ke tu luc day. 10 phut dau +200..300,
//   sau do moi gio +50..70. Het 24h thi giu nguyen so da tich.
// - VIP Vang: trong 15 ngay ke tu luc nang, moi 6 tieng +300..500.
// - VIP Kim Cuong: trong 15 ngay ke tu luc nang, moi 6 tieng +800..1200.
// - Het han thi khong tang nua, chi hien lai so da tich.
// - Luot quan tam ~ 5% luot xem.

// Ham bam on dinh, tra ve so 0..1 theo seed.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Tra ve so nguyen trong [min, max] on dinh theo (seed).
function seededInt(seed: number, min: number, max: number): number {
  return min + Math.floor(seededRandom(seed) * (max - min + 1));
}

export type FakeStats = {
  views: number;
  interested: number;
};

export type FakeStatsOpts = {
  status?: string | null;
  boostedAt?: string | null;
  promotedAt?: string | null;
  hetHanVip?: string | null;
};

const MS_PHUT = 60 * 1000;
const MS_GIO = 60 * MS_PHUT;
const MS_NGAY = 24 * MS_GIO;

function parseTime(v?: string | null): number | null {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

// Tong luot cong them do DAY TIN (boost) trong 24h ke tu boostedAt.
function boostViews(safeId: number, boostedAt: number, now: number): number {
  const elapsed = now - boostedAt;
  if (elapsed < 10 * MS_PHUT) return 0; // chua qua 10 phut dau
  let total = 0;
  // Cu tang vot 10 phut dau: +200..300 (on dinh theo id).
  total += seededInt(safeId * 1.7 + 11, 200, 300);
  // Moi gio tiep theo +50..70, toi da 24 gio.
  const gio = Math.min(24, Math.floor(elapsed / MS_GIO));
  for (let h = 1; h <= gio; h++) {
    total += seededInt(safeId * 2.3 + h * 7 + 101, 50, 70);
  }
  return total;
}

// Tong luot cong them do VIP (vang / kim cuong) trong 15 ngay ke tu promotedAt.
function vipViews(safeId: number, promotedAt: number, now: number, min: number, max: number, seedBase: number): number {
  const elapsed = now - promotedAt;
  if (elapsed < 0) return 0;
  const capped = Math.min(elapsed, 15 * MS_NGAY); // toi da 15 ngay
  const blocks = Math.floor(capped / (6 * MS_GIO)); // moi 6 tieng 1 lan
  let total = 0;
  for (let b = 1; b <= blocks; b++) {
    total += seededInt(safeId * 3.1 + b * 13 + seedBase, min, max);
  }
  return total;
}

export function getFakeStats(
  id: number | null | undefined,
  createdAt?: string | null,
  opts: FakeStatsOpts = {}
): FakeStats {
  const safeId = typeof id === "number" && !Number.isNaN(id) ? id : 1;
  const now = Date.now();
  const { status, boostedAt, promotedAt, hetHanVip } = opts;

  const boostTs = parseTime(boostedAt);
  // Moc nang cap VIP: uu tien promotedAt; neu chi co het_han_vip (tin nang bang kho tin)
  // thi suy ra moc nang = het_han_vip - 15 ngay (dung bang cua so tang view VIP).
  const hetHanVipTs = parseTime(hetHanVip);
  const promoteTs =
    parseTime(promotedAt) ??
    (hetHanVipTs !== null ? hetHanVipTs - 15 * MS_NGAY : null);
  const createdTs = parseTime(createdAt);

  // So nen ban dau on dinh theo id (nho, de tin nao cung co chut view).
  const base = 50 + Math.floor(seededRandom(safeId * 7.13 + 1) * 351);

  let views = base;

  // 1) Cong luot do DAY TIN (boost) neu co moc boostedAt.
  if (boostTs) {
    views += boostViews(safeId, boostTs, now);
  }

  // 2) Cong luot do VIP theo status (moc promotedAt).
  if (promoteTs && status === "kim_cuong") {
    views += vipViews(safeId, promoteTs, now, 800, 1200, 501);
  } else if (promoteTs && status === "vang") {
    views += vipViews(safeId, promoteTs, now, 300, 500, 301);
  }

  // 3) Tin thuong (khong boost, khong VIP): an trong 5 tieng dau,
  //    sau do tang nhe theo ngay cho tu nhien.
  const coBoost = !!boostTs && now - boostTs < 24 * MS_GIO;
  const coVip = !!promoteTs && (status === "vang" || status === "kim_cuong");
  if (!coBoost && !coVip) {
    if (createdTs && now - createdTs < 5 * MS_GIO) {
      return { views: 0, interested: 0 };
    }
    if (createdTs) {
      const days = Math.max(0, Math.floor((now - createdTs) / MS_NGAY));
      const perDay = 30 + Math.floor(seededRandom(safeId * 3.71 + 2) * 221);
      let noise = 0;
      for (let d = 1; d <= days; d++) {
        noise += Math.floor(seededRandom(safeId * 1.37 + d) * 21) - 10;
      }
      views += perDay * days + noise;
    }
  }

  views = Math.max(0, Math.round(views));
  const interested = Math.round(views * 0.05);
  return { views, interested };
}
