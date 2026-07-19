import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import BannerCarousel from "@/components/BannerCarousel";
import TiktokEmbed from "@/components/TiktokEmbed";
import { getTongSoCan } from "@/lib/stats";
import TieuDiem from "@/components/home/TieuDiem";
import DichVu from "@/components/home/DichVu";
import CamNhan from "@/components/home/CamNhan";

type HomeVideo = { id: number; title: string | null; tiktok_url: string };

async function layVideoTiktok(limit = 6): Promise<HomeVideo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_videos")
    .select("id, title, tiktok_url")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as HomeVideo[]) ?? [];
}

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
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Banner[]) ?? [];
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

  const [banners, hotHomNay, kimCuong, vang, tinMoi, tinTuc, video, canhBao, khoNha] =
    await Promise.all([
      layBanner(),
      layTin({ hotToday: true, limit: 8 }),
      layTin({ status: "kim_cuong", limit: 8 }),
      layTin({ status: "vang", limit: 8 }),
      layTin({ limit: 8 }),
      layTinTuc({ limit: 3 }),
      layVideoTiktok(6),
      layTinTuc({ loai: "tin_tuc", limit: 4 }),
      getTongSoCan(),
    ]);

  return (
    <>
      {/* Hero + tìm kiếm */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-[color:var(--np-do,#c1121f)] text-white">
        {/* Banner lam nen chay vong (quan ly tai /admin/banner) */}
        {banners.length > 0 && (
          <div className="absolute inset-0 z-0">
            <BannerCarousel banners={banners} heightClass="h-full" chromeless />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Nhà phố trung tâm Sài Gòn
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/90 drop-shadow sm:text-base">
            Giá thật · Pháp lý rõ ràng · Uy tín — Kênh đăng tin mua bán, cho thuê
            nhà phố, căn hộ, đất nền tại TP. Hồ Chí Minh.
          </p>

          <form action="/tin-dang" className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            {/* Tabs Mua ban / Cho thue / Du an */}
            <div className="flex bg-gray-50">
              <label className="flex-1">
                <input type="radio" name="loai" value="ban" defaultChecked className="peer sr-only" />
                <span className="block cursor-pointer border-b-[3px] border-transparent px-4 py-3 text-center text-sm font-semibold text-gray-500 transition peer-checked:border-[color:var(--np-do)] peer-checked:bg-white peer-checked:text-[color:var(--np-do)]">Mua bán</span>
              </label>
              <label className="flex-1">
                <input type="radio" name="loai" value="thue" className="peer sr-only" />
                <span className="block cursor-pointer border-b-[3px] border-transparent px-4 py-3 text-center text-sm font-semibold text-gray-500 transition peer-checked:border-[color:var(--np-do)] peer-checked:bg-white peer-checked:text-[color:var(--np-do)]">Cho thuê</span>
              </label>
              <label className="flex-1">
                <input type="radio" name="loai" value="dat" className="peer sr-only" />
                <span className="block cursor-pointer border-b-[3px] border-transparent px-4 py-3 text-center text-sm font-semibold text-gray-500 transition peer-checked:border-[color:var(--np-do)] peer-checked:bg-white peer-checked:text-[color:var(--np-do)]">Dự án / Đất nền</span>
              </label>
            </div>
            {/* Thanh tim kiem */}
            <div className="grid gap-3 border-t border-gray-200 p-3 sm:grid-cols-12 sm:p-4">
              <input
                type="text"
                name="q"
                placeholder="Nhập tên đường, phường, từ khóa… VD: Nguyễn Đình Chiểu"
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none sm:col-span-6"
              />
              <select name="quan" className="rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none sm:col-span-3">
                <option value="">Tất cả khu vực</option>
                {KHU_VUC.map((kv) => (
                  <option key={kv} value={kv}>{kv}</option>
                ))}
              </select>
              <button
                type="submit"
                className="np-btn rounded-lg px-5 py-3 text-sm font-semibold sm:col-span-3"
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


      {/* Cam ket nha that - dat ngay dau trang de khach de thay */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-green-800 sm:text-xl">
            {khoNha.toLocaleString("vi-VN")}+ căn nhà đang rao — 100% là nhà thật, có thật, đúng chủ
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
            Toàn bộ <b>{khoNha.toLocaleString("vi-VN")}</b> căn đang đăng trên website đều là bất động sản có thật, cập nhật liên tục mỗi ngày.
            Bạn thích căn nào, chỉ cần <b>để lại thông tin</b> — chúng tôi sẽ gửi lại{" "}
            <b>đúng căn đó</b>, đúng vị trí và đúng diện tích như mô tả.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Vì số lượng tin rất lớn nên không thể cập nhật hình ảnh đầy đủ cho từng căn,
            do đó một số tin có thể chỉ dùng <b>ảnh minh họa</b>. Dù vậy, thông tin vị trí
            và diện tích luôn chính xác, và nhân viên sẽ tư vấn trực tiếp căn bạn quan tâm.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/tin-dang" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Xem danh sách nhà
            </Link>
            <Link href="/dang-tin" className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100">
              Để lại nhu cầu của bạn
            </Link>
          </div>
        </div>
      </section>

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
                Tin HÓT trong ngày
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
      <Khoi tieuDe="Nhà VIP Kim Cương" moTa="Bất động sản nổi bật, vị trí đắc địa — xếp từ mới đến cũ" tin={kimCuong} xemThem="/tin-dang" />

      {/* 3. VIP Vang */}
      <Khoi tieuDe="Nhà VIP Vàng" moTa="Tin chọn lọc — xếp từ mới đến cũ" tin={vang} xemThem="/tin-dang" />

      {/* 4. Tin moi */}
      <Khoi tieuDe="Tin mới nhất" moTa="Tất cả tin đăng mới — xếp từ mới đến cũ" tin={tinMoi} xemThem="/tin-dang" />

      {/* 6. Tin tuc */}
      {tinTuc.length ? (
        <section className={"mx-auto max-w-6xl px-4 py-8"}>
          <div className={"mb-5 flex items-end justify-between"}>
            <h2 className={"text-xl font-bold text-brand sm:text-2xl"}>Tin tức</h2>
            <Link href={"/tin-tuc"} className={"shrink-0 text-sm font-semibold text-brand hover:underline"}>Xem tất cả →</Link>
          </div>
          <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
            {tinTuc.slice(0, 3).map((n) => (
              <Link key={n.loai + "-" + n.id} href={"/tin-tuc"} className={"overflow-hidden rounded-xl border bg-white transition hover:shadow-md"}>
                <div className={"aspect-[16/9] w-full bg-gray-100"}>
                  {n.anh_bia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.anh_bia} alt={n.tieu_de ?? ""} className={"h-full w-full object-cover"} />
                  ) : null}
                </div>
                <div className={"p-4"}>
                  {n.loai === "video" ? <span className={"mb-1 inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand"}>Video</span> : null}
                  <h3 className={"line-clamp-2 font-semibold text-gray-900"}>{n.tieu_de}</h3>
                  {n.mo_ta ? <p className={"mt-1 line-clamp-2 text-sm text-gray-500"}>{n.mo_ta}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {/* 7. Video TikTok */}
      {video.length ? (
        <section className={"mx-auto max-w-6xl px-4 py-8"}>
          <div className={"mb-5 flex items-end justify-between"}>
            <h2 className={"text-xl font-bold text-brand sm:text-2xl"}>Video</h2>
          </div>
          <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
            {video.map((v) => (
              <TiktokEmbed key={v.id} url={v.tiktok_url} title={v.title} />
            ))}
          </div>
        </section>
      ) : null}

      {/* 7. Canh bao rui ro phap ly */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-red-700 sm:text-2xl">
            Cảnh báo rủi ro & lừa đảo
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
      <TieuDiem />
      <DichVu />
      <CamNhan />
    </>
  );
}
