import { redirect } from "next/navigation";
import { getCurrentUser, isStaffRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

// Bảo mật: khu vực quản trị không được cache tĩnh và luôn kiểm tra quyền theo từng request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lớp 1: kiểm tra phiên đăng nhập trực tiếp từ Supabase (fail-closed).
  let hasSession = false;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    hasSession = !!authUser;
  } catch {
    hasSession = false;
  }
  if (!hasSession) {
    redirect("/dang-nhap");
  }

  // Lớp 2: xác định người dùng và vai trò. Bất kỳ lỗi nào cũng coi như không có quyền.
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }
  if (!user) {
    redirect("/dang-nhap");
  }

  // Lớp 3: chỉ nhân sự (admin + phó cộng đồng) mới được vào /admin.
  if (!isStaffRole(user.role)) {
    redirect("/tai-khoan");
  }

  return <>{children}</>;
}
