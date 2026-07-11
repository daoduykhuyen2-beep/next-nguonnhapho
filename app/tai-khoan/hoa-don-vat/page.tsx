import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountSidebar from "@/components/AccountSidebar";
import VatForm from "@/components/VatForm";

export const metadata = { title: "Thông tin xuất hóa đơn VAT" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside><AccountSidebar /></aside>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2"><h2 className="text-2xl font-bold">Thông tin xuất hóa đơn VAT</h2></div>
          <p className="mb-5 text-gray-600">Điền thông tin để xuất hóa đơn GTGT khi nạp tiền hoặc mua gói dịch vụ.</p>
          <VatForm profile={profile as Profile | null} />
        </section>
      </div>
    </main>
  );
}
