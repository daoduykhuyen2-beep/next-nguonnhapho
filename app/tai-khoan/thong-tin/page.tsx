import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountTabs from "@/components/AccountTabs";

export const metadata = { title: "Quản lý tài khoản" };
export const dynamic = "force-dynamic";

export default async function ThongTinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
          ← Về tổng quan tài khoản
        </Link>
      </div>
      <AccountTabs profile={profile as Profile | null} email={user.email ?? ""} />
    </main>
  );
}
