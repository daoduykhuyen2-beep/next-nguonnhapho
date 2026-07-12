import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import { getTongSoCan } from "@/lib/stats";

export const revalidate = 60;

async function layTin(opts: { status?: string; limit?: number; hotToday?: boolean } = {}): Promise<Post[]> {
  const supabase = await createClient();
  let q = supabase.from("web_posts").select("*").eq("trang_thai", "duyet");
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.hotToday) {
    q = q.order("luot_xem", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(opts.limit ?? 8);
  } else {
    q = q.order("created_at", { ascending: false }).limit(opts.limit ?? 8);
  }
  const { data, error } = await q;
  if (error) return [];
  return (data as Post[]) ?? [];
}

type Banner = { id: number; title: string | null; image_url: string; link_url: string | null };

async function layBanner(): Promise<Banner[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("id, title, image_url, link_url")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Banner[]) ?? [];
}

type XepHang = { ten: string; so: number };

async function layXepHang(limit = 8): Promise<XepHang[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_posts")
    .select("owner, contact_name")
    .eq("trang_thai", "duyet")
    .not("owner", "is", null);
  if (!data) return [];
  const dem = new Map<string, { ten: string; so: number }>();
  for (const row of data as { owner: string | null; contact_name: string | null }[]) {
    if (!row.owner) continue;
    const cur = dem.get(row.owner) ?? { ten: row.contact_name || "Thành viên", so: 0 };
    cur.so += 1;
    if (row.contact_name) cur.ten = row.contact_name;
    dem.set(row.owner, cur);
  }
  return [...dem.values()].sort((a, b) => b.so - a.so).slice(0, limit);
}

type NewsItem = {
  id: number;
  tieu_de: string | null;
  mo_ta: string | null;
  anh_bia: string | null;
  loai: string | null;
};

async function layTinTuc(opts: { loai?: string; limit?: number } = {}): Promise<NewsItem[]> {
  const supabase = await createClient();
  let q = supabase.from("news").select("id, tieu_de, mo_ta, anh_bia, loai");
  if (opts.loai) q = q.eq("loai", opts.loai);
  q = q.order("created_at", { ascending: false }).limit(opts.limit ?? 3);
  const { data, error } = await q;
  if (error) return [];
  return (data as NewsItem[]) ?? [];
}

function Khoi({
  tieuDe,
  moTa,
  tin,
  xemThem,
  huy,
}: {
  tieuDe: string;
  moTa?: string;
  tin: Post[];
  xemThem?: string;
  huy?: string;
}) {
  if (!tin.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className={`text-xl font-bold sm:text-2xl ${huy ?? "text-brand"}`}>{tieuDe}</h2>
          {moTa ? <p className="mt-1 text-sm text-gray-500">{moTa}</p> : null}
        </div>
        {xemThem ? (
          <Link href={xemThem} className="shrink-0 text-sm font-semibold text-brand hover:underline">
            Xem tất cả →
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tin.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}

const KHU_VUC = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 10",
  "Bình Thạnh",
  "Phú Nhuận",
  "Tân Bình",
  "Gò Vấp",
  "Bình Chánh",
];

export default async function TrangChu() {
    // Tự động hạ cấp tin VIP đã hết hạn về tin thường trước khi hiển thị
  try {
    const sb = await createClient();
    await sb.rpc("expire_vip_posts");
  } catch {}

  const [banners, hotHomNay, kimCuong, vang, tinMoi, xepHang, tinTuc, video, canhBao, khoNha] =
    await Promise.all([
      layBanner(),
      layTin({ hotToday: true, limit: 8 }),
      layTin({ status: "kim_cuong", limit: 8 }),
      layTin({ status: "vang", limit: 8 }),
      layTin({ limit: 8 }),
      layXepHang(8),
      layTinTuc({ limit: 3 }),
      layTinTuc({ loai: "video", limit: 3 }),
      layTinTuc({ loai: "tin_tuc", limit: 4 }),
      getTongSoCan(),
    ]);

  return (
    <>
      {/* Hero + tìm kiếm */}
      <section className="border-b border-gray-200 bg-white text-black">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Nhà phố trung tâm Sài Gòn
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Giá thật · Pháp lý rõ ràng · Uy tín — Kênh đăng tin mua bán, cho thuê
            nhà phố, căn hộ, đất nền tại TP. Hồ Chí Minh.
          </p>

          <form action="/tin-dang" className="mt-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid gap-3 sm:grid-cols-12">
              <input
                type="text"
                name="q"
                placeholder="Nhập tên đường, phường, từ khóa… VD: Nguyễn Đình Chiểu"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 sm:col-span-5"
              />
              <select name="quan" className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 sm:col-span-3">
                <option value="">Tất cả khu vực</option>
                {KHU_VUC.map((kv) => (
                  <option key={kv} value={kv}>{kv}</option>
                ))}
              </select>
              <select name="loai" className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 sm:col-span-2">
                <option value="">Tất cả</option>
                <option value="ban">Nhà bán</option>
                <option value="thue">Cho thuê</option>
                <option value="dat">Đất nền</option>
                <option value="can_ho">Căn hộ</option>
              </select>
              <button
                type="submit"
                className="np-btn px-4 py-2 text-sm sm:col-span-2"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/tin-dang?quan=Quận 1" className="np-chip">Nhà Quận 1</Link>
            <Link href="/tin-dang?quan=Quận 3" className="np-chip">Nhà Quận 3</Link>
            <Link href="/tin-dang" className="np-chip">Nhà mặt tiền</Link>
            <Link href="/tin-dang" className="np-chip">Dưới 10 tỷ</Link>
            <Link href="/tin-dang" className="np-chip">Hẻm xe hơi</Link>
            <Link href="/tin-dang?loai=thue" className="np-chip">Thuê mặt bằng kinh doanh</Link>
          </div>
        </div>
      </section>

      {/* Banner quang cao (quan ly tai /admin/banner) */}
      {banners.length ? (
        <section className="mx-auto max-w-6xl px-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b) => {
              const img = (
                <img
                  src={b.image_url}
                  alt={b.title ?? "Banner"}
                  className="h-40 w-full rounded-xl object-cover shadow-sm sm:h-44"
                />
              );
              return b.link_url ? (
                <a key={b.id} href={b.link_url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl transition hover:opacity-95">
                  {img}
                </a>
              ) : (
                <div key={b.id} className="overflow-hidden rounded-xl">{img}</div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Bang thong ke kho nha cong khai */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-brand/5 px-6 py-5 text-center">
          <div>
            <div className="text-3xl font-extrabold text-brand">{khoNha.toLocaleString("vi-VN")}</div>
            <div className="text-xs font-medium text-gray-500">Tin nhà đang công khai trong kho</div>
          </div>
          <div className="hidden h-10 w-px bg-gray-200 sm:block" />
          <p className="max-w-md text-sm text-gray-600">
            Toàn bộ tin đăng bán được công khai tức thì. Đăng tin nhà của bạn để tiếp cận hàng ngàn khách mua mỗi ngày.
          </p>
          <Link href="/dang-tin" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Đăng tin ngay
          </Link>
        </div>
      </section>

      {/* 1. Tin HOT trong ngay */}
      {hotHomNay.length ? (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-brand sm:text-2xl">
                <span>🔥</span> Tin HÓT trong ngày
              </h2>
              <p className="mt-1 text-sm text-gray-500">Những tin được xem nhiều &amp; nổi bật nhất, cập nhật liên tục</p>
            </div>
            <Link href="/tin-dang" className="shrink-0 text-sm font-semibold text-brand hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {hotHomNay.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      ) : null}

      {/* 2. VIP Kim Cuong */}
      <Khoi tieuDe="💎 Nhà VIP Kim Cương" moTa="Bất động sản nổi bật, vị trí đắc địa — xếp từ mới đến cũ" tin={kimCuong} xemThem="/tin-dang" />

      {/* 3. VIP Vang */}
      <Khoi tieuDe="🏅 Nhà VIP Vàng" moTa="Tin chọn lọc — xếp từ mới đến cũ" tin={vang} xemThem="/tin-dang" />

      {/* 4. Tin moi */}
      <Khoi tieuDe="🆕 Tin mới nhất" moTa="Tất cả tin đăng mới — xếp từ mới đến cũ" tin={tinMoi} xemThem="/tin-dang" />

      {/* 5. Bang xep hang nguoi day tin */}
      {xepHang.length ? (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-brand sm:text-2xl">🏆 Bảng xếp hạng người đẩy tin</h2>
            <p className="mt-1 text-sm text-gray-500">Thành viên đăng nhiều tin nhất được vinh danh top đầu</p>
          </div>
          <div className="overflow-hidden rounded-xl border bg-white">
            {xepHang.map((h, i) => (
              <div key={i} className="flex items-center justify-between border-b px-4 py-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-gray-300 text-white" : i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"}`}>{i + 1}</span>
                  <span className="font-medium text-gray-800">{h.ten}</span>
                </div>
                <span className="text-sm font-semibold text-brand">{h.so} tin</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 6. Tin tuc & Video */}
      {tinTuc.length || video.length ? (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-brand sm:text-2xl">📰 Tin tức & Video</h2>
            <Link href="/tin-tuc" className="shrink-0 text-sm font-semibold text-brand hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...tinTuc, ...video].slice(0, 6).map((n) => (
              <Link key={n.loai + "-" + n.id} href="/tin-tuc" className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md">
                <div className="aspect-[16/9] w-full bg-gray-100">
                  {n.anh_bia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.anh_bia} alt={n.tieu_de ?? ""} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  {n.loai === "video" ? <span className="mb-1 inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">Video</span> : null}
                  <h3 className="line-clamp-2 font-semibold text-gray-900">{n.tieu_de}</h3>
                  {n.mo_ta ? <p className="mt-1 line-clamp-2 text-sm text-gray-500">{n.mo_ta}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 7. Canh bao rui ro phap ly */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-red-700 sm:text-2xl">
            <span>⚠️</span> Cảnh báo rủi ro & lừa đảo
          </h2>
          <p className="mt-1 text-sm text-red-600/80">Kiến thức pháp lý giúp bạn mua nhà an toàn, tránh bẫy lừa đảo</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {canhBao.map((n) => (
              <Link key={n.id} href="/tin-tuc" className="flex items-start gap-3 rounded-lg bg-white p-3 transition hover:shadow">
                <span className="mt-0.5 text-red-500">•</span>
                <div>
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{n.tieu_de}</h3>
                  {n.mo_ta ? <p className="mt-1 line-clamp-2 text-xs text-gray-500">{n.mo_ta}</p> : null}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/tin-tuc" className="mt-4 inline-block text-sm font-semibold text-red-700 hover:underline">Xem thêm cảnh báo →</Link>
        </div>
      </section>
    </>
  );
}
