import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import LoanCalculator from "@/components/LoanCalculator";

export const revalidate = 60;

// ----- Helpers: parse so tu cac truong string -----
function parseNumber(s?: string | null): number | null {
  if (!s) return null;
  const m = s.replace(/\s/g, "").match(/[\d.,]+/);
  if (!m) return null;
  const n = parseFloat(m[0].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseGiaTy(gia?: string | null): number | null {
  if (!gia) return null;
  const raw = gia.toLowerCase();
  const num = parseFloat(
    (raw.match(/[\d.,]+/)?.[0] ?? "").replace(/\./g, "").replace(",", ".")
  );
  if (!Number.isFinite(num)) return null;
  return num;
}

function parseDienTich(dt?: string | null): number | null {
  return parseNumber(dt);
}

function extractField(text: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return m[1];
  }
  return null;
}

function formatTrieuPerM2(giaTy: number | null, dt: number | null): string | null {
  if (!giaTy || !dt || dt === 0) return null;
  const trieu = (giaTy * 1000) / dt;
  return `${Math.round(trieu).toLocaleString("vi-VN")} tr/m²`;
}

type PriceHistoryRow = {
  gia: string | null;
  gia_tri: number | null;
  recorded_at: string;
};

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("web_posts")
    .select("*")
    .eq("id", id)
    .eq("trang_thai", "duyet")
    .maybeSingle();
  if (error) {
    console.error("getPost error:", error.message);
    return null;
  }
  return (data as Post) ?? null;
}

async function getPriceHistory(postId: number): Promise<PriceHistoryRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_post_price_history")
    .select("gia, gia_tri, recorded_at")
    .eq("post_id", postId)
    .order("recorded_at", { ascending: true });
  return (data as PriceHistoryRow[]) ?? [];
}

async function getSimilar(quan: string | null, excludeId: number): Promise<Post[]> {
  if (!quan) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .eq("quan", quan)
    .neq("id", excludeId)
    .limit(3);
  return (data as Post[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Không tìm thấy tin" };
  const cover = post.anh?.imgs?.[0] ?? post.anh?.tin ?? undefined;
  return {
    title: post.title ?? "Tin đăng",
    description: (post.mota ?? "").slice(0, 160),
    openGraph: {
      title: post.title ?? "Tin đăng",
      description: (post.mota ?? "").slice(0, 160),
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function TinChiTietPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const imgs = post.anh?.imgs ?? (post.anh?.tin ? [post.anh.tin] : []);
  const diaChi = [post.duong, post.phuong, post.quan].filter(Boolean).join(", ");
  const searchText = `${post.title ?? ""} ${post.mota ?? ""}`;

  const giaTy = parseGiaTy(post.gia);
  const dt = parseDienTich(post.dien_tich);
  const donGia = formatTrieuPerM2(giaTy, dt);
  const soTang = extractField(searchText, [/Số tầng:\s*(\d+)/i, /(\d+)\s*tầng/i]);
  const ngang = extractField(searchText, [/Mặt tiền:\s*([\d.,]+)\s*m/i, /ngang\s*([\d.,]+)\s*m/i, /([\d.,]+)\s*m\s*ngang/i]);

  const [similar, priceRows] = await Promise.all([
    getSimilar(post.quan, post.id),
    getPriceHistory(post.id),
  ]);

  // Lich su gia: dung du lieu that neu co >= 2 diem, nguoc lai fallback minh hoa
  const realPoints = priceRows.filter((r) => r.gia_tri != null);
  const usingReal = realPoints.length >= 2;
  const now = new Date();
  let history: { label: string; val: number }[];
  if (usingReal) {
    history = realPoints.map((r) => {
      const d = new Date(r.recorded_at);
      return {
        label: `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`,
        val: Math.round(Number(r.gia_tri)),
      };
    });
  } else {
    history = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const base = giaTy ?? 0;
      const val = i < 2 && base ? Math.round(base * 1.04) : base;
      return { label: `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`, val };
    });
  }

  const maxV = Math.max(...history.map((h) => h.val), 1);
  const minV = Math.min(...history.map((h) => h.val));
  const chartW = 600, chartH = 160, pad = 30;
  const points = history.map((h, i) => {
    const x = pad + (i * (chartW - 2 * pad)) / Math.max(history.length - 1, 1);
    const range = maxV - minV || 1;
    const y = chartH - pad - ((h.val - minV) / range) * (chartH - 2 * pad);
    return { x, y, ...h };
  });
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  const mapQuery = encodeURIComponent(diaChi || post.quan || "TP.HCM");

  return (
    <div>
      <Link href="/tin-dang" className="mb-4 inline-block text-sm text-brand hover:underline">
        ← Quay lại danh sách
      </Link>

      <h1 className="text-2xl font-bold">{post.title ?? "(Không có tiêu đề)"}</h1>
      <p className="mt-1 text-sm text-gray-500">📍 {diaChi} · Mã tin: NP{String(post.id).padStart(4, "0")}</p>

      {imgs.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {imgs.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`${post.title ?? "Ảnh"} ${i + 1}`} className="w-full rounded-lg object-cover" />
          ))}
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border bg-gray-50 p-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase text-gray-500">Giá bán</p>
          <p className="text-xl font-bold text-brand">{formatGia(post.gia)}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Diện tích</p>
          <p className="text-xl font-bold">{post.dien_tich ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Đơn giá</p>
          <p className="text-xl font-bold">{donGia ?? "—"}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Thông số chi tiết</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Chiều ngang</dt><dd className="font-semibold">{ngang ? `${ngang} m` : "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Số tầng</dt><dd className="font-semibold">{soTang ?? "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Loại</dt><dd className="font-semibold">{post.loai ?? "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Khu vực</dt><dd className="font-semibold">{post.quan ?? "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Pháp lý</dt><dd className="font-semibold">Liên hệ xem sổ trực tiếp</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Hướng</dt><dd className="font-semibold">Đang cập nhật</dd></div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Địa chỉ cập nhật (đường &amp; phường mới)</h2>
            <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2 sm:gap-x-6">
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Đường</dt><dd className="font-semibold text-right">{post.duong?.trim() ? post.duong : "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Phường mới</dt><dd className="font-semibold text-right">{post.phuong?.trim() ? post.phuong : "Đang cập nhật theo địa giới mới"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Quận / Khu vực</dt><dd className="font-semibold text-right">{post.quan?.trim() ? post.quan : "Đang cập nhật"}</dd></div>
              <div className="flex justify-between border-b py-1"><dt className="text-gray-500">Địa chỉ đầy đủ</dt><dd className="font-semibold text-right">{diaChi || "Đang cập nhật"}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-gray-400">Địa chỉ hiển thị theo tên đường &amp; phường mới sau sáp nhập địa giới hành chính. Địa chỉ số nhà chính xác gửi qua Zalo/điện thoại sau khi xác nhận nhu cầu.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Mô tả</h2>
            <p className="whitespace-pre-line text-gray-700">{post.mota ?? "Chưa có mô tả."}</p>
          </section>

          {giaTy ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Lịch sử giá bán</h2>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
                <polyline fill="none" stroke="#dc4633" strokeWidth="2" points={polyline} />
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#dc4633" />
                    <text x={p.x} y={p.y - 10} fontSize="11" textAnchor="middle" fill="#333">{p.val}</text>
                    <text x={p.x} y={chartH - 8} fontSize="10" textAnchor="middle" fill="#999">{p.label}</text>
                  </g>
                ))}
              </svg>
              <p className="text-xs text-gray-500">
                {usingReal
                  ? "Đơn vị: tỷ đồng — dữ liệu ghi nhận theo lịch sử cập nhật giá của tin."
                  : "Đơn vị: tỷ đồng — biểu đồ minh họa dựa trên giá hiện tại, chỉ mang tính tham khảo."}
              </p>
            </section>
          ) : null}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Vị trí & tiện ích xung quanh</h2>
            <iframe
              title="Bản đồ vị trí"
              className="w-full rounded-lg border"
              height="320"
              loading="lazy"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
            <p className="mt-2 text-xs text-gray-500">
              Bản đồ hiển thị theo tên đường để bảo mật cho chủ nhà — vị trí chính xác gửi qua Zalo sau khi xác nhận nhu cầu.
            </p>
          </section>

          {giaTy ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Máy tính vay ngân hàng</h2>
              <LoanCalculator giaTy={giaTy} />
              <p className="mt-2 text-xs text-gray-500">
                Số liệu chỉ mang tính tham khảo theo dư nợ giảm dần — không phải tư vấn tài chính.
              </p>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-xl border bg-white p-4">
          <p className="text-2xl font-bold text-brand">{formatGia(post.gia)}</p>
          {post.dien_tich ? <p className="mt-2 text-sm text-gray-600">Diện tích: <b>{post.dien_tich}</b></p> : null}
          {post.loai ? <p className="mt-1 text-sm text-gray-600">Loại: <b>{post.loai}</b></p> : null}
          <hr className="my-3" />
          <p className="text-sm font-semibold">Liên hệ</p>
          <p className="mt-1 text-sm text-gray-700">{post.contact_name ?? "Người đăng"}</p>
          {post.contact_phone ? (
            <a href={`tel:${post.contact_phone}`} className="mt-2 block rounded-lg bg-brand px-4 py-2 text-center font-semibold text-white">
              Gọi {post.contact_phone}
            </a>
          ) : null}
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Căn tương tự tại {post.quan}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {similar.map((s) => (
              <Link key={s.id} href={`/tin-dang/${s.id}`} className="rounded-xl border bg-white p-3 hover:shadow">
                <p className="font-semibold line-clamp-2">{s.title ?? "Tin đăng"}</p>
                <p className="mt-1 font-bold text-brand">{formatGia(s.gia)}</p>
                <p className="text-sm text-gray-500">{s.dien_tich ?? ""}</p>
                <p className="text-xs text-gray-400">📍 {[s.duong, s.quan].filter(Boolean).join(", ")}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
