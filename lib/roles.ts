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

export const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
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
