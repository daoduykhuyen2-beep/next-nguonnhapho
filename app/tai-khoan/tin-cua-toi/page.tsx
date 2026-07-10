import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";

export const metadata = { title: "Tin của tôi" };

export default async function TinCuaToiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/tai-khoan/tin-cua-toi");

  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const posts = (data as Post[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tin của tôi</h1>
        <Link
          href="/dang-tin"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
        >
          + Đăng tin
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Bạn chưa đăng tin nào.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/tin-dang/${p.id}`}
                  className="line-clamp-1 font-semibold hover:text-brand"
                >
                  {p.title ?? "(Không có tiêu đề)"}
                </Link>
                <p className="text-sm text-brand">{formatGia(p.gia)}</p>
              </div>
              <DeletePostButton id={p.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
