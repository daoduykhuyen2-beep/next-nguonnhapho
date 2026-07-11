// Client-safe: định nghĩa vai trò + nhãn hiển thị.
// Tách khỏi lib/permissions.ts (vốn import next/headers qua supabase/server)
// để có thể dùng trong Client Component (vd RoleSelect) mà không kéo theo code server.

export type Role = "admin" | "pho_cong_dong" | "member";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Quản trị viên (Admin)",
  pho_cong_dong: "Phó cộng đồng",
  member: "Thành viên",
};
