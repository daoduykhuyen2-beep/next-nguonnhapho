import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("getPosts error:", error.message);
    return [];
  }
  return (data as Post[]) ?? [];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <section className="mb-8 rounded-xl bg-brand px-6 py-10 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">Nguồn Nhà Phố HCM</h1>
        <p className="mt-2 max-w-2xl text-white/90">
          Kênh đăng tin mua bán, cho thuê nhà phố, căn hộ, đất nền tại
          TP. Hồ Chí Minh. Nhanh chóng - Uy tín - Miễn phí.
        </p>
        <Link
          href="/tin-dang"
          className="mt-5 inline-block rounded-lg bg-white px-5 py-2 font-semibold text-brand"
        >
          Xem tất cả tin đăng
        </Link>
      </section>

      <h2 className="mb-4 text-xl font-bold">Tin đăng mới nhất</h2>

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Chưa có tin đăng nào. Hãy quay lại sau nhé!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
