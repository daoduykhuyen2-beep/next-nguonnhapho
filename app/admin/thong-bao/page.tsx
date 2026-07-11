import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import NotifyForm from "@/components/NotifyForm";

export const metadata = { title: "Thông báo / Khuyến mãi" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;
  const { data } = await supabase.from("notifications").select("id, tieu_de, loai, created_at").order("created_at", { ascending: false }).limit(50);
  const list = data || [];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Thông báo / Khuyến mãi</h1>
      <AdminNav />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold">Gửi thông báo mới</h2>
          <NotifyForm />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Đã gửi ({list.length})</h2>
          <div className="space-y-2">
            {list.map((n) => (
              <div key={n.id} className="rounded-lg border bg-white p-3">
                <p className="font-medium">{n.tieu_de} {n.loai === "khuyen_mai" ? <span className="ml-1 rounded bg-orange-400 px-2 py-0.5 text-xs text-white">KM</span> : null}</p>
                <p className="text-xs text-gray-500">{n.created_at ? new Date(n.created_at as string).toLocaleString("vi-VN") : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
