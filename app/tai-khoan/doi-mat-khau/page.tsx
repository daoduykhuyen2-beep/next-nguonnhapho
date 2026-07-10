import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";
import PasswordForm from "@/components/PasswordForm";

export const metadata = { title: "Thay đổi mật khẩu" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside><AccountSidebar /></aside>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2"><h2 className="text-2xl font-bold">Thay đổi mật khẩu</h2></div>
          <PasswordForm />
        </section>
      </div>
    </main>
  );
}
