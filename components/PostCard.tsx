import Link from "next/link";
import type { Post } from "@/lib/types";

export function formatGia(gia: string | null): string {
  if (!gia) return "Thỏa thuận";
  return gia;
}

export default function PostCard({ post }: { post: Post }) {
  const cover = post.anh?.imgs?.[0] ?? post.anh?.tin ?? null;
  const diaChi = [post.duong, post.phuong, post.quan]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/tin-dang/${post.id}`}
      className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full bg-gray-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={post.title ?? "Tin đăng"}
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
          {post.title ?? "(Không có tiêu đề)"}
        </h3>
        <p className="mt-1 font-bold text-brand">{formatGia(post.gia)}</p>
        {post.dien_tich ? (
          <p className="mt-0.5 text-sm text-gray-600">
            Diện tích: {post.dien_tich}
          </p>
        ) : null}
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">{diaChi}</p>
      </div>
    </Link>
  );
}
