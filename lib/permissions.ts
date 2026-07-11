import { createClient } from "@/lib/supabase/server";

// Re-export toan bo phan thuan logic tu lib/roles (client-safe).
export * from "./roles";
import { resolveRole, roleCan, isStaffRole } from "./roles";
import type { Role, Capability, CurrentUser } from "./roles";

// Lấy user hiện tại kèm vai trò (null nếu chưa đăng nhập)
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: prof } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    role: resolveRole(prof),
  };
}

export async function getCurrentRole(): Promise<Role> {
  const u = await getCurrentUser();
  return u?.role ?? "member";
}

// Ném lỗi nếu user hiện tại không có capability yêu cầu.
// Dùng trong các server action để chặn thao tác trái quyền.
export async function requireCapability(cap: Capability): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u || !roleCan(u.role, cap)) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return u;
}

// Yêu cầu là nhân sự (admin hoặc phó cộng đồng)
export async function requireStaff(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u || !isStaffRole(u.role)) {
    throw new Error("Chỉ nhân sự quản trị mới được truy cập.");
  }
  return u;
}

// Yêu cầu là admin
export async function requireAdmin(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") {
    throw new Error("Chỉ admin mới được thực hiện thao tác này.");
  }
  return u;
}
