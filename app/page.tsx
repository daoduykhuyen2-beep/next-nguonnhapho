import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const revalidate = 60;

function formatGia(gia: string | null): string {
  if (!gia) return "Thỏa thuận";
  return gia;
}

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
        <h1 className="text-2xl font-bold sm:text-3xl">
          Nguồn Nhà Phố HCM
        </h1>
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
          {posts.map((p) => {
            const cover = p.anh?.imgs?.[0] ?? p.anh?.tin ?? null;
            return (
              <Link
                key={p.id}
                href={`/tin-dang/${p.id}`}
                className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full bg-gray-100">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={p.title ?? "Tin đăng"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 font-semibold">
                    {p.title ?? "(Không có tiêu đề)"}
                  </h3>
                  <p className="mt-1 font-bold text-brand">
                    {formatGia(p.gia)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {[p.duong, p.phuong, p.quan].filter(Boolean).join(", ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
