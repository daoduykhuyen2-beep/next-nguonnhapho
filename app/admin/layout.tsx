import { redirect } from "next/navigation";
import { getCurrentUser, isStaffRole } from "@/lib/permissions";

// Layout bảo vệ toàn bộ khu vực /admin.
// Cho phép: admin và phó cộng đồng (nhân sự). Các trang chỉ-admin
// (thành viên, nạp tiền, phân quyền) tự kiểm tra thêm requireAdmin bên trong.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/dang-nhap?next=/admin");
  }

  if (!isStaffRole(user.role)) {
    // Đã đăng nhập nhưng không phải nhân sự → về trang tài khoản
    redirect("/tai-khoan");
  }

  return <>{children}</>;
}
