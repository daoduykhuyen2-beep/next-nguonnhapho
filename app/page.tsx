import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

async function layTin(opts: { status?: string; limit?: number } = {}): Promise<Post[]> {
  const supabase = await createClient();
  let q = supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet");
  if (opts.status) q = q.eq("status", opts.status);
  q = q.order("created_at", { ascending: false }).limit(opts.limit ?? 8);
  const { data, error } = await q;
  if (error) return [];
  return (data as Post[]) ?? [];
}

type NewsItem = {
  id: number;
  tieu_de: string | null;
  mo_ta: string | null;
  anh_bia: string | null;
  loai: string | null;
};

async function layTinTuc(limit = 3): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, tieu_de, mo_ta, anh_bia, loai")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as NewsItem[]) ?? [];
}

function Khoi({
  tieuDe,
  moTa,
  tin,
  xemThem,
}: {
  tieuDe: string;
  moTa?: string;
  tin: Post[];
  xemThem?: string;
}) {
  if (!tin.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand sm:text-2xl">{tieuDe}</h2>
          {moTa ? <p className="mt-1 text-sm text-gray-500">{moTa}</p> : null}
        </div>
        {xemThem ? (
          <Link href={xemThem} className="text-sm font-medium text-brand hover:underline">
            Xem tất cả →
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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

const NHOM = [
  { label: "Nhà mặt tiền", href: "/tin-dang?nhom=mat-tien", icon: "🏬" },
  { label: "Nhà hẻm xe hơi", href: "/tin-dang?nhom=hem-xe-hoi", icon: "🚗" },
  { label: "Nhà giá tốt < 5 tỷ", href: "/tin-dang?nhom=gia-tot", icon: "💰" },
  { label: "Shophouse cho thuê", href: "/tin-dang?loai=thue", icon: "🏢" },
  { label: "Đất nền", href: "/tin-dang?nhom=dat-nen", icon: "🌱" },
  { label: "Căn hộ", href: "/tin-dang?nhom=can-ho", icon: "🏠" },
];

export default async function TrangChu() {
  const [kimCuong, vang, thuongMoi, moiVe, tinTuc] = await Promise.all([
    layTin({ status: "kim_cuong", limit: 4 }),
    layTin({ status: "vang", limit: 8 }),
    layTin({ status: "thuong", limit: 8 }),
    layTin({ limit: 8 }),
    layTinTuc(3),
  ]);

  return (
    <>
      {/* Hero + tìm kiếm */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Nhà phố trung tâm Sài Gòn
          </h1>
          <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
            Giá thật · Pháp lý rõ ràng · Uy tín — Kênh đăng tin mua bán, cho thuê
            nhà phố, căn hộ, đất nền tại TP. Hồ Chí Minh.
          </p>

          <form action="/tin-dang" className="mt-6 rounded-xl bg-white p-3 shadow-lg sm:p-4">
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
                <option value="">Mua bán</option>
                <option value="thue">Cho thuê</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 sm:col-span-2"
              >
                Tìm nhà
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/tin-dang" className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">
              Xem tất cả tin đăng
            </Link>
            <Link href="/dang-tin" className="rounded-full bg-white px-3 py-1 font-semibold text-brand hover:bg-gray-100">
              Đăng tin miễn phí
            </Link>
            <Link href="/gioi-thieu" className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">
              Quy trình làm việc →
            </Link>
          </div>
        </div>
      </section>

      <Khoi tieuDe="Nhà VIP Kim Cương" moTa="Bất động sản nổi bật, vị trí đắc địa" tin={kimCuong} xemThem="/tin-dang" />
      <Khoi tieuDe="Nhà VIP Vàng" moTa="Tin ưu tiên, cập nhật liên tục" tin={vang} xemThem="/tin-dang" />

      {/* Khám phá theo nhóm */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-5 text-xl font-bold text-brand sm:text-2xl">Khám phá theo nhóm</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {NHOM.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 text-center text-sm font-medium shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <span className="text-2xl">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </div>
      </section>

      <Khoi tieuDe="Nhà mới về tuần này" moTa="Tin đăng mới nhất trên hệ thống" tin={moiVe} xemThem="/tin-dang" />
      <Khoi tieuDe="Nhà tin thường mới" tin={thuongMoi} xemThem="/tin-dang" />

      {/* Tìm nhà theo khu vực */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-5 text-xl font-bold text-brand sm:text-2xl">Tìm nhà theo khu vực</h2>
        <div className="flex flex-wrap gap-3">
          {KHU_VUC.map((kv) => (
            <Link
              key={kv}
              href={"/tin-dang?quan=" + encodeURIComponent(kv)}
              className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:border-brand hover:bg-brand hover:text-white"
            >
              {kv}
            </Link>
          ))}
        </div>
      </section>

      {/* Tin tức teaser */}
      {tinTuc.length ? (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-brand sm:text-2xl">
              Tin tức & kiến thức mua nhà an toàn
            </h2>
            <Link href="/tin-tuc" className="text-sm font-medium text-brand hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tinTuc.map((t) => (
              <Link
                key={t.id}
                href={"/tin-tuc/" + t.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-40 w-full bg-gray-100">
                  {t.anh_bia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.anh_bia} alt={t.tieu_de ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold">{t.tieu_de}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{t.mo_ta}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA ký gửi */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-brand">
            Anh chị có nhà cần bán hoặc cho thuê?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Ký gửi cho Nguồn Nhà Phố HCM — kiểm tra pháp lý, định giá đúng thị
            trường và tiếp cận hàng ngàn khách hàng tiềm năng.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/dang-tin" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90">
              Đăng tin ngay
            </Link>
            <Link href="/gioi-thieu" className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand hover:text-white">
              Tìm hiểu quy trình
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
