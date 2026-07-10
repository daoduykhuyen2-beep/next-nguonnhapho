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

function Khoi({
  tieuDe,
  moTa,
  mau,
  tin,
}: {
  tieuDe: string;
  moTa?: string;
  mau?: string;
  tin: Post[];
}) {
  if (!tin || tin.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className={"text-xl font-bold sm:text-2xl " + (mau ?? "text-gray-900")}>
            {tieuDe}
          </h2>
          {moTa ? <p className="mt-1 text-sm text-gray-500">{moTa}</p> : null}
        </div>
        <Link
          href="/tin-dang"
          className="shrink-0 text-sm font-medium text-red-600 hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tin.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}

const KHU_VUC = [
  "Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10",
  "Bình Thạnh", "Phú Nhuận", "Gò Vấp", "Tân Bình", "Bình Chánh",
  "Thủ Đức", "Nhà Bè",
];

export default async function TrangChu() {
  const [kimCuong, vang, moiVe] = await Promise.all([
    layTin({ status: "kim_cuong", limit: 4 }),
    layTin({ status: "vang", limit: 8 }),
    layTin({ limit: 8 }),
  ]);

  const chuaCoTin =
    kimCuong.length === 0 && vang.length === 0 && moiVe.length === 0;

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Nhà phố trung tâm Sài Gòn
          </h1>
          <p className="mt-4 max-w-2xl text-base text-red-100 sm:text-lg">
            Giá thật · Pháp lý rõ ràng · Uy tín — Kênh đăng tin mua bán, cho thuê
            nhà phố, căn hộ, đất nền tại TP. Hồ Chí Minh.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tin-dang"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-red-700 shadow hover:bg-red-50"
            >
              Xem tất cả tin đăng
            </Link>
            <Link
              href="/dang-tin"
              className="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Đăng tin miễn phí
            </Link>
          </div>
        </div>
      </section>

      <Khoi
        tieuDe="Nhà VIP Kim Cương"
        moTa="Bất động sản nổi bật, vị trí đắc địa"
        mau="text-red-600"
        tin={kimCuong}
      />
      <Khoi
        tieuDe="Nhà VIP Vàng"
        moTa="Tin đăng ưu tiên, chọn lọc"
        mau="text-amber-600"
        tin={vang}
      />
      <Khoi
        tieuDe="Nhà mới về tuần này"
        moTa="Những tin đăng mới nhất"
        tin={moiVe}
      />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Tìm nhà theo khu vực
        </h2>
        <div className="flex flex-wrap gap-2">
          {KHU_VUC.map((kv) => (
            <Link
              key={kv}
              href={"/tin-dang?quan=" + encodeURIComponent(kv)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:border-red-300 hover:text-red-600"
            >
              {kv}
            </Link>
          ))}
        </div>
      </section>

      {chuaCoTin ? (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Chưa có tin đăng nào. Hãy quay lại sau nhé!
          </div>
        </section>
      ) : null}
    </div>
  );
}
