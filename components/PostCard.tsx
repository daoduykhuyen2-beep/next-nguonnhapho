import Link from "next/link";
import type { Post } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";

export function formatGia(gia: string | null): string {
  if (!gia) return "Thoa thuan";
  return gia;
}

export default function PostCard({ post }: { post: Post }) {
  const cover = post.anh?.imgs?.[0] ?? post.anh?.tin ?? null;
  const diaChi = [post.duong, post.phuong, post.quan]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white transition hover:shadow-md">
      <div className="absolute right-2 top-2 z-10 rounded-full bg-white/90 shadow-sm">
        <FavoriteButton postId={post.id} />
      </div>
      <Link href={`/tin-dang/${post.id}`} className="block">
        <div className="aspect-[4/3] w-full bg-gray-100">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={post.title ?? "Tin dang"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Khong co anh
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 font-semibold">
            {post.title ?? "(Khong co tieu de)"}
          </h3>
          <p className="mt-1 font-bold text-brand">{formatGia(post.gia)}</p>
          {post.dien_tich ? (
            <p className="mt-0.5 text-sm text-gray-600">
              Dien tich: {post.dien_tich}
            </p>
          ) : null}
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{diaChi}</p>
        </div>
      </Link>
    </div>
  );
}
