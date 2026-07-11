import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import NewsForm from "@/components/NewsForm";

export const metadata = { title: "Quản lý tin tức" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;
  const { data } = await supabase.from("news").select("id, tieu_de, loai, created_at").order("created_at", { ascending: false }).limit(100);
  const news = data || [];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý tin tức</h1>
      <AdminNav />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold">Thêm bài viết mới</h2>
          <NewsForm />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Bài viết gần đây ({news.length})</h2>
          <div className="space-y-2">
            {news.map((n) => (
              <div key={n.id} className="rounded-lg border bg-white p-3">
                <p className="font-medium">{n.tieu_de}</p>
                <p className="text-xs text-gray-500">{n.loai} · {n.created_at ? new Date(n.created_at as string).toLocaleDateString("vi-VN") : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
