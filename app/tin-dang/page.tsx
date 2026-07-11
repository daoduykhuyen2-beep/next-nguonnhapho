import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import { getDanhSachQuan } from "@/lib/stats";

export const revalidate = 60;

export const metadata = {
  title: "Tin đăng bất động sản",
  description: "Danh sách tin mua bán, cho thuê nhà đất tại TP. Hồ Chí Minh.",
};

const PAGE_SIZE = 12;

type SearchParams = {
  q?: string;
  loai?: string;
  quan?: string;
  duong?: string;
  giaMin?: string;
  giaMax?: string;
  dtMin?: string;
  dtMax?: string;
  tang?: string;
  page?: string;
};

async function getPosts(sp: SearchParams) {
  const supabase = await createClient();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet");

  if (sp.loai) query = query.eq("loai", sp.loai);
  if (sp.quan) query = query.ilike("quan", `%${sp.quan}%`);
  if (sp.duong) query = query.ilike("duong", `%${sp.duong}%`);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("getPosts error", error.message);
    return { posts: [] as Post[], total: 0, page };
  }

  const parseNum = (v?: string | null): number | null => {
    if (!v) return null;
    const m = String(v).replace(/\./g, "").replace(",", ".").match(/[\d.]+/);
    const n = m ? parseFloat(m[0]) : NaN;
    return Number.isFinite(n) ? n : null;
  };
  const parseTang = (p: Post): number | null => {
    const txt = `${p.title ?? ""} ${p.mota ?? ""}`;
    const m = txt.match(/Số tầng:\s*(\d+)/i) ?? txt.match(/(\d+)\s*tầng/i);
    return m ? parseInt(m[1], 10) : null;
  };

  const giaMin = sp.giaMin ? parseFloat(sp.giaMin) : null;
  const giaMax = sp.giaMax ? parseFloat(sp.giaMax) : null;
  const dtMin = sp.dtMin ? parseFloat(sp.dtMin) : null;
  const dtMax = sp.dtMax ? parseFloat(sp.dtMax) : null;
  const tang = sp.tang ? parseInt(sp.tang, 10) : null;

  let list = (data as Post[]) ?? [];
  list = list.filter((p) => {
    const gia = parseNum(p.gia);
    const dt = parseNum(p.dien_tich);
    const t = parseTang(p);
    if (giaMin !== null && (gia === null || gia < giaMin)) return false;
    if (giaMax !== null && (gia === null || gia > giaMax)) return false;
    if (dtMin !== null && (dt === null || dt < dtMin)) return false;
    if (dtMax !== null && (dt === null || dt > dtMax)) return false;
    if (tang !== null) {
      if (t === null) return false;
      if (tang >= 5 ? t < 5 : t !== tang) return false;
    }
    return true;
  });

  const total = list.length;
  const posts = list.slice(from, from + PAGE_SIZE);
  return { posts, total, page };
}

function buildPageHref(sp: SearchParams, page: number) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.loai) params.set("loai", sp.loai);
  if (sp.quan) params.set("quan", sp.quan);
  if (sp.duong) params.set("duong", sp.duong);
  if (sp.giaMin) params.set("giaMin", sp.giaMin);
  if (sp.giaMax) params.set("giaMax", sp.giaMax);
  if (sp.dtMin) params.set("dtMin", sp.dtMin);
  if (sp.dtMax) params.set("dtMax", sp.dtMax);
  if (sp.tang) params.set("tang", sp.tang);
  params.set("page", String(page));
  return `/tin-dang?${params.toString()}`;
}

export default async function TinDangPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { posts, total, page } = await getPosts(sp);
  const quanOptions = await getDanhSachQuan();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isChoThueSapRaMat = sp.loai === "thue" && total === 0;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">
        {sp.loai === "thue" ? "Nhà cho thuê" : sp.loai === "ban" ? "Nhà bán" : "Tin đăng bất động sản"}
      </h1>

      {isChoThueSapRaMat ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-3xl">
            🏠
          </div>
          <h2 className="mb-2 text-2xl font-bold text-brand">Sắp ra mắt</h2>
          <p className="mx-auto max-w-xl text-gray-600">
            Chuyên mục <b>Nhà cho thuê</b> đang được hoàn thiện. Ngay khi có tin
            đăng cho thuê đầu tiên, các tin sẽ tự động hiển thị công khai tại đây.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dang-tin" className="np-btn px-5 py-2 text-sm">
              Đăng tin cho thuê
            </Link>
            <Link
              href="/tin-dang?loai=ban"
              className="rounded-lg border px-5 py-2 text-sm font-semibold hover:text-brand"
            >
              Xem nhà bán
            </Link>
          </div>
        </div>
      ) : (
      <>
      <Suspense fallback={null}>
        <PostFilter quanOptions={quanOptions} />
      </Suspense>

      <p className="mb-4 text-sm text-gray-500">Tìm thấy {total} tin đăng.</p>

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Không tìm thấy tin đăng phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link
              href={buildPageHref(sp, page - 1)}
              className="rounded-md border bg-white px-4 py-2 text-sm"
            >
              Trang trước
            </Link>
          ) : null}
          <span className="px-2 text-sm text-gray-600">
            Trang {page}/{totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildPageHref(sp, page + 1)}
              className="rounded-md border bg-white px-4 py-2 text-sm"
            >
              Trang sau
            </Link>
          ) : null}
        </div>
      ) : null}
      </>
      )}
    </div>
  );
}
