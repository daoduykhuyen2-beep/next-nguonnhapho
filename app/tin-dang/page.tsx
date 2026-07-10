import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";

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
  page?: string;
};

async function getPosts(sp: SearchParams) {
  const supabase = await createClient();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("web_posts")
    .select("*", { count: "exact" })
    .eq("trang_thai", "duyet");

  if (sp.loai) query = query.eq("loai", sp.loai);
  if (sp.quan) query = query.ilike("quan", `%${sp.quan}%`);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getPosts error:", error.message);
    return { posts: [] as Post[], total: 0, page };
  }
  return { posts: (data as Post[]) ?? [], total: count ?? 0, page };
}

function buildPageHref(sp: SearchParams, page: number) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.loai) params.set("loai", sp.loai);
  if (sp.quan) params.set("quan", sp.quan);
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
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Tin đăng bất động sản</h1>

      <Suspense fallback={null}>
        <PostFilter />
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
    </div>
  );
}
