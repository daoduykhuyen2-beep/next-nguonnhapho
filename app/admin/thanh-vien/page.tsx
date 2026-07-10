import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import MemberEditForm from "@/components/MemberEditForm";

export const metadata = { title: "Quản lý thành viên" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;
  const { data } = await supabase.from("profiles").select("id, full_name, email, phone, membership_tier, is_admin, created_at").order("created_at", { ascending: false }).limit(500);
  const members = data || [];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý thành viên</h1>
      <AdminNav />
      <p className="mb-3 text-sm text-gray-500">Tổng: {members.length} thành viên</p>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{m.full_name || "(chưa đặt tên)"} {m.is_admin ? <span className="ml-2 rounded bg-brand px-2 py-0.5 text-xs text-white">Admin</span> : null}</p>
                <p className="text-sm text-gray-500">{m.email} · {m.phone || "chưa có SĐT"} · Gói: {m.membership_tier || "free"}</p>
              </div>
              <MemberEditForm member={m} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
