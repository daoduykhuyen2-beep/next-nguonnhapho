import { createClient } from "@/lib/supabase/server";

// ------------------------------------------------------------
// Hệ thống phân quyền (RBAC) — dùng ở phía server.
// Vai trò:
//   - admin         : toàn quyền, quản lý mọi thứ + phân quyền nhân sự
//   - pho_cong_dong : chỉnh sửa bài viết, duyệt tin, đăng thông báo, quản lý tin tức
//   - member        : người dùng thường
// ------------------------------------------------------------

export type Role = "admin" | "pho_cong_dong" | "member";

// Khả năng (capability) mà mỗi vai trò được phép thực hiện
export type Capability =
  | "post.edit"        // sửa bài viết của mọi người
  | "post.approve"     // duyệt / ẩn tin
  | "post.delete"      // xoá vĩnh viễn tin
  | "news.manage"      // quản lý tin tức
  | "notify.send"      // đăng thông báo
  | "member.manage"    // quản lý thành viên (số dư, gói…)
  | "payment.manage"   // duyệt nạp tiền
  | "role.assign";     // phân quyền nhân sự

const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  admin: [
    "post.edit",
    "post.approve",
    "post.delete",
    "news.manage",
    "notify.send",
    "member.manage",
    "payment.manage",
    "role.assign",
  ],
  pho_cong_dong: [
    "post.edit",
    "post.approve",
    "news.manage",
    "notify.send",
  ],
  member: [],
};

// Nhãn tiếng Việt để hiển thị
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Quản trị viên (Admin)",
  pho_cong_dong: "Phó cộng đồng",
  member: "Thành viên",
};

export function roleCan(role: Role, cap: Capability): boolean {
  return (ROLE_CAPABILITIES[role] || []).includes(cap);
}

export function isStaffRole(role: Role): boolean {
  return role === "admin" || role === "pho_cong_dong";
}

// Chuẩn hoá dữ liệu profile (tương thích ngược với is_admin cũ)
export function resolveRole(profile: { role?: string | null; is_admin?: boolean | null } | null): Role {
  if (!profile) return "member";
  if (profile.role === "admin" || profile.role === "pho_cong_dong" || profile.role === "member") {
    return profile.role;
  }
  return profile.is_admin ? "admin" : "member";
}

export type CurrentUser = {
  id: string;
  email: string | null;
  role: Role;
};

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
