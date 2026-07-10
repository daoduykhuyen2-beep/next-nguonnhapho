import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import EditPostForm from "@/components/EditPostForm";

export const metadata = { title: "Sửa tin" };
const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export default async function SuaTinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/dang-nhap?next=/sua-tin/${id}`);

  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const post = (data as Post) ?? null;
  if (!post) notFound();

  const isOwner = post.owner === user.id;
  const isAdmin = user.email === ADMIN_EMAIL;
  if (!isOwner && !isAdmin) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Không có quyền</h1>
        <p className="text-gray-600">Bạn không thể sửa tin này.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Sửa tin</h1>
      <EditPostForm post={post} />
    </div>
  );
}
