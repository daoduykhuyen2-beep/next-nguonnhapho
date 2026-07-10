import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";

export const revalidate = 60;

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("web_posts")
    .select("*")
    .eq("id", id)
    .eq("trang_thai", "duyet")
    .maybeSingle();

  if (error) {
    console.error("getPost error:", error.message);
    return null;
  }
  return (data as Post) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Không tìm thấy tin" };

  const cover = post.anh?.imgs?.[0] ?? post.anh?.tin ?? undefined;
  return {
    title: post.title ?? "Tin đăng",
    description: (post.mota ?? "").slice(0, 160),
    openGraph: {
      title: post.title ?? "Tin đăng",
      description: (post.mota ?? "").slice(0, 160),
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function TinChiTietPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const imgs = post.anh?.imgs ?? (post.anh?.tin ? [post.anh.tin] : []);
  const diaChi = [post.duong, post.phuong, post.quan]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Link
        href="/tin-dang"
        className="mb-4 inline-block text-sm text-brand hover:underline"
      >
        ← Quay lại danh sách
      </Link>

      <h1 className="text-2xl font-bold">
        {post.title ?? "(Không có tiêu đề)"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{diaChi}</p>

      {imgs.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {imgs.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${post.title ?? "Ảnh"} ${i + 1}`}
              className="w-full rounded-lg object-cover"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Mô tả</h2>
          <p className="whitespace-pre-line text-gray-700">
            {post.mota ?? "Chưa có mô tả."}
          </p>
        </div>

        <aside className="h-fit rounded-xl border bg-white p-4">
          <p className="text-2xl font-bold text-brand">
            {formatGia(post.gia)}
          </p>
          {post.dien_tich ? (
            <p className="mt-2 text-sm text-gray-600">
              Diện tích: <b>{post.dien_tich}</b>
            </p>
          ) : null}
          {post.loai ? (
            <p className="mt-1 text-sm text-gray-600">
              Loại: <b>{post.loai}</b>
            </p>
          ) : null}
          <hr className="my-3" />
          <p className="text-sm font-semibold">Liên hệ</p>
          <p className="mt-1 text-sm text-gray-700">
            {post.contact_name ?? "Người đăng"}
          </p>
          {post.contact_phone ? (
            <a
              href={`tel:${post.contact_phone}`}
              className="mt-2 block rounded-lg bg-brand px-4 py-2 text-center font-semibold text-white"
            >
              Gọi {post.contact_phone}
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
