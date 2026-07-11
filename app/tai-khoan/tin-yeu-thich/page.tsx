import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";

export const metadata: Metadata = { title: "Tin yêu thích" };

export default async function TinYeuThichPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  // Danh sách tin đã lưu — sau này lấy từ bảng "favorites" trong Supabase.
  // Ví dụ: const { data: favorites } = await supabase
  //   .from("favorites").select("post:posts(*)").eq("user_id", user.id);
  const favorites: { id: string; title: string; price: string; area: string; href: string }[] = [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside>
          <AccountSidebar />
        </aside>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2">
            <h1 className="text-2xl font-bold">Tin yêu thích</h1>
            <p className="text-gray-500">Những tin đăng bạn đã lưu để xem lại sau.</p>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              <p className="mt-3 text-sm text-gray-500">Bạn chưa lưu tin nào.</p>
              <Link
                href="/tin-dang"
                className="mt-3 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Khám phá tin đăng
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
                      {f.price} · {f.area}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
