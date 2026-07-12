import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";
import { formatGia } from "@/components/PostCard";
import FavoriteButton from "@/components/FavoriteButton";

export const metadata: Metadata = { title: "Tin yeu thich" };

type FavRow = {
  id: string;
  post_id: number;
  web_posts: {
    id: number;
    title: string | null;
    gia: string | null;
    dien_tich: string | null;
    duong: string | null;
    phuong: string | null;
    quan: string | null;
  } | null;
};

export default async function TinYeuThichPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data } = await supabase
    .from("favorites")
    .select(
      "id, post_id, web_posts(id, title, gia, dien_tich, duong, phuong, quan)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const favorites = ((data ?? []) as unknown as FavRow[])
    .filter((f) => f.web_posts)
    .map((f) => {
      const p = f.web_posts!;
      const diaChi = [p.duong, p.phuong, p.quan].filter(Boolean).join(", ");
      return {
        id: p.id,
        title: p.title ?? "(Khong co tieu de)",
        price: formatGia(p.gia),
        area: p.dien_tich ? `Dien tich: ${p.dien_tich}` : diaChi,
        href: `/tin-dang/${p.id}`,
      };
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside>
          <AccountSidebar />
        </aside>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2">
            <h1 className="text-2xl font-bold">Tin yeu thich</h1>
            <p className="text-gray-500">Nhung tin dang ban da luu de xem lai sau.</p>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              <p className="mt-3 text-sm text-gray-500">Ban chua luu tin nao.</p>
              <Link
                href="/tin-dang"
                className="mt-3 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Kham pha tin dang
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {favorites.map((f) => (
                <li key={f.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0">
                  <div>
                    <Link href={f.href} className="font-medium text-gray-800 hover:text-brand">
                      {f.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {f.price} - {f.area}
                    </p>
                  </div>
                  <FavoriteButton postId={f.id} initialSaved />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
