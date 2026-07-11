import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import ProfileForm from "@/components/ProfileForm";
import AvatarUpload from "@/components/AvatarUpload";

export const metadata = { title: "Thông tin cá nhân" };

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
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
        <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
          ← Về tài khoản
        </Link>
      </div>
      <p className="mb-6 text-sm text-gray-500">Email: {user.email}</p>
      <div className="mb-6">
        <AvatarUpload userId={user.id} initialUrl={profile?.avatar_url ?? null} name={profile?.full_name ?? null} />
      </div>
      <ProfileForm profile={(profile as Profile) ?? null} />
    </main>
  );
}
