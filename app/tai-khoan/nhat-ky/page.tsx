import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";

export const metadata = { title: "Nhật ký hoạt động" };

type Ev = { time: string; text: string };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: pays } = await supabase.from("payments").select("plan_code, amount, status, created_at, paid_at").eq("user_id", user.id).order("created_at", { ascending: false });
  const { data: posts } = await supabase.from("web_posts").select("title, created_at").eq("owner", user.id).order("created_at", { ascending: false }).limit(50);

  const events: Ev[] = [];
  (pays || []).forEach((x) => {
    const amt = Number(x.amount || 0).toLocaleString("vi-VN");
    const st = x.status === "paid" ? "thành công" : (x.status || "chờ");
    events.push({ time: x.created_at as string, text: "Giao dịch gói " + (x.plan_code || "") + " - " + amt + "đ (" + st + ")" });
  });
  (posts || []).forEach((x) => {
    events.push({ time: x.created_at as string, text: "Đăng tin: " + (x.title || "(không tiêu đề)") });
  });
  events.sort((a, b) => (b.time || "").localeCompare(a.time || ""));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside><AccountSidebar /></aside>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2"><h2 className="text-2xl font-bold">Nhật ký hoạt động</h2></div>
          {events.length === 0 ? (
            <p className="text-gray-500">Chưa có hoạt động nào.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((e, i) => (
                <li key={i} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <div>
                    <p className="font-medium text-gray-800">{e.text}</p>
                    <p className="text-sm text-gray-500">{e.time ? new Date(e.time).toLocaleString("vi-VN") : ""}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
