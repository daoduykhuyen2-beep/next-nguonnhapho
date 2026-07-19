import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import BannerCarousel from "@/components/BannerCarousel";
import { getDanhSachQuan, normalizeQuan, type QuanStat } from "@/lib/stats";

export const revalidate = 60;

export const metadata = {
  title: "Tin đăng bất động sản",
  description: "Danh sách tin mua bán, cho thuê nhà đất tại TP. Hồ Chí Minh.",
};

const PAGE_SIZE = 12;

// Cac quan trung tam (goi y nhanh cho khach)
const QUAN_TRUNG_TAM = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 10",
  "Phú Nhuận",
  "Bình Thạnh",
];

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

async function getBanners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("id, title, image_url, link_url, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

async function getPosts(sp: SearchParams, quanOptions: QuanStat[]) {
  const supabase = await createClient();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const hasJsFilter = Boolean(
    sp.giaMin || sp.giaMax || sp.dtMin || sp.dtMax || sp.tang
  );

  const buildQuery = () => {
    let q = supabase
      .from("web_posts")
      .select("*", hasJsFilter ? {} : { count: "exact" })
      .eq("trang_thai", "duyet");
    if (sp.loai) q = q.eq("loai", sp.loai);
    if (sp.quan) {
      // Loc theo TAT CA cach ghi cua quan da chon (vi du "Binh Thanh" + "Quan Binh Thanh")
      const canon = normalizeQuan(sp.quan);
      const match = quanOptions.find((o) => o.quan === canon);
      const variants = match && match.variants.length ? match.variants : [sp.quan];
      q = q.in("quan", variants);
    }
    if (sp.duong) q = q.ilike("duong", `%${sp.duong}%`);
    if (sp.q) q = q.ilike("title", `%${sp.q}%`);
    return q;
  };

  // Khong co bo loc JS (gia/dien tich/tang) -> phan trang & dem o cap DB (chinh xac, khong gioi han 1000)
  if (!hasJsFilter) {
    const { data, error, count } = await buildQuery()
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      console.error("getPosts error", error.message);
      return { posts: [] as Post[], total: 0, page };
    }
    return { posts: (data as Post[]) ?? [], total: count ?? 0, page };
  }

  // Co bo loc JS -> tai toan bo tin (theo lo) roi loc trong JS (vuot qua gioi han 1000 dong cua PostgREST)
  const BATCH = 1000;
  let allRows: Post[] = [];
  for (let offset = 0; ; offset += BATCH) {
    const { data, error } = await buildQuery()
      .order("created_at", { ascending: false })
      .range(offset, offset + BATCH - 1);
    if (error) {
      console.error("getPosts error", error.message);
      break;
    }
    const chunk = (data as Post[]) ?? [];
    allRows = allRows.concat(chunk);
    if (chunk.length < BATCH) break;
  }
  const data = allRows;

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
  const quanOptions = await getDanhSachQuan();
  const { posts, total, page } = await getPosts(sp, quanOptions);
  const banners = await getBanners();
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-8 w-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
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

      {/* Banner quảng cáo tự động chạy vòng (tối đa 5 ảnh) — quản lý tại /admin/banner */}
      <BannerCarousel banners={banners} />

      {/* Goi y cac quan trung tam */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Khu vực trung tâm
        </p>
        <div className="flex flex-wrap gap-2">
          {QUAN_TRUNG_TAM.map((qt) => {
            const params = new URLSearchParams();
            if (sp.loai) params.set("loai", sp.loai);
            params.set("quan", qt);
            const active = sp.quan === qt;
            return (
              <Link
                key={qt}
                href={`/tin-dang?${params.toString()}`}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-brand hover:text-brand"
                }`}
              >
                {qt}
              </Link>
            );
          })}
          {sp.quan ? (
            <Link
              href={`/tin-dang${sp.loai ? `?loai=${sp.loai}` : ""}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-brand"
            >
              ✕ Bỏ lọc quận
            </Link>
          ) : null}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Tìm thấy <b className="text-brand">{total.toLocaleString("vi-VN")}</b> tin đăng
        {sp.loai === "thue" ? " cho thuê" : sp.loai === "ban" ? " nhà bán" : ""}
        {sp.quan ? ` tại ${sp.quan}` : " trên toàn TP.HCM"}.
      </p>

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Không tìm thấy tin đăng phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, idx) => (
            <PostCard key={p.id} post={p} idx={idx} />
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
