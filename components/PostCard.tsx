import Link from "next/link";
import type { Post } from "@/lib/types";
import { getFakeStats } from "@/lib/fakeStats";
import { pickStockImage } from "@/lib/stockImages";

export function formatGia(gia: string | null, loai?: string | null): string {
  if (!gia) return "Thỏa thuận";
  const s = String(gia).trim();
  if (!s) return "Thỏa thuận";
  if (/[a-zA-ZÀ-ỹ]/.test(s)) return s;
    if (loai === "thue") {
          const num = s.replace(/[.,\s]/g, "");
          if (/^\d+$/.test(num)) return Number(num).toLocaleString("vi-VN") + " VNĐ/tháng";
          return s;
    }
    const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
    if (Number.isFinite(n)) return n.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " tỷ";
    return s;
}

export function formatDienTich(dt: string | number | null): string {
  if (dt === null || dt === undefined) return "";
  const s = String(dt).trim();
  if (!s) return "";
  if (/[a-zA-ZÀ-ỹ]/.test(s)) return s;
  return s + " m²";
}

export function formatSoTang(st: string | number | null): string {
  if (st === null || st === undefined) return "";
  const s = String(st).trim();
  if (!s) return "";
  if (/[a-zA-ZÀ-ỹ]/.test(s)) return s;
  return s + " tầng";
}

const LOAI_LABEL: Record<string, string> = {
  ban: "Nhà bán",
  thue: "Cho thuê",
  dat: "Đất nền",
  can_ho: "Căn hộ",
  du_an: "Dự án",
  khac: "Khác",
};

export default function PostCard({ post, idx = 0 }: { post: Post; idx?: number }) {
  const loaiLabel = post.loai ? LOAI_LABEL[post.loai] || post.loai : null;
  const _pickCover = (x: any): string | null => {
    if (!x) return null;
    let v: any = x;
    if (typeof v === "string") { try { v = JSON.parse(v); } catch { return v || null; } }
    if (Array.isArray(v)) return v[0] ?? null;
    if (typeof v === "object") { if (Array.isArray(v.imgs)) return v.imgs[0] ?? null; if (v.tin) return v.tin; }
    return null;
  };
  const cover = _pickCover(post.anh);
  const coverFinal = cover || pickStockImage(post.id ?? idx);
  const diaChi = [post.duong, post.phuong, post.quan]
    .filter(Boolean)
    .join(", ");
  const vip =
    post.status === "kim_cuong"
      ? { label: "VIP Kim Cương", cls: "bg-gradient-to-r from-sky-500 to-indigo-600" }
      : post.status === "vang"
      ? { label: "VIP Vàng", cls: "bg-gradient-to-r from-amber-400 to-yellow-500" }
      : null;
  const stats = getFakeStats(post.id, post.created_at, {
    status: post.status,
    boostedAt: post.boosted_at,
    promotedAt: post.promoted_at,
    hetHanVip: post.het_han_vip,
  });

  return (
    <Link
      href={`/tin-dang/${post.id}`}
      className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {loaiLabel ? (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-brand px-2 py-0.5 text-xs font-semibold text-white shadow">
            {loaiLabel}
          </span>
        ) : null}
        {vip ? (
          <span className={`absolute right-2 top-2 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white shadow ${vip.cls}`}>
            {vip.label}
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverFinal}
          alt={post.title ?? "Tin đăng"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 font-semibold">
          {post.title ?? "(Không có tiêu đề)"}
        </h3>
        <p className="mt-1 font-bold text-brand">{formatGia(post.gia, post.loai)}</p>
        {post.dien_tich ? (
          <p className="mt-0.5 text-sm text-gray-600">
            Diện tích: {formatDienTich(post.dien_tich)}
          </p>
        ) : null}
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">{diaChi}</p>
</div>
    </Link>
  );
}
