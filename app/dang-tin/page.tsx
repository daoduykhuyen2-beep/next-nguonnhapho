import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";

export const metadata = { title: "Đăng tin mới" };

export default async function DangTinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/dang-tin");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold">Đăng tin mới</h1>
      <p className="mb-6 text-sm text-gray-500">
        Tin của bạn sẽ hiển thị công khai ngay sau khi đăng.
      </p>
      <PostForm />
    </div>
  );
}
