"use client";

import { useState, useTransition } from "react";
import { adminSetRole } from "@/app/actions/admin";
import { ROLE_LABELS, type Role } from "@/lib/roles";

const ROLE_OPTIONS: Role[] = ["member", "pho_cong_dong", "admin"];

// Dropdown đổi vai trò cho 1 thành viên. Gọi server action adminSetRole (chỉ admin).
export default function RoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: Role;
  disabled?: boolean;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [msg, setMsg] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function onChange(next: Role) {
    const prev = role;
    setRole(next);
    setMsg("");
    startTransition(async () => {
      const res = await adminSetRole(userId, next);
      if (res?.error) {
        setRole(prev);
        setMsg(res.error);
      } else {
        setMsg("Đã cập nhật ✓");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        disabled={disabled || pending}
        onChange={(e) => onChange(e.target.value as Role)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
      >
        {ROLE_OPTIONS.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {msg && (
        <span
          className={
            "text-xs " + (msg.includes("✓") ? "text-green-600" : "text-red-600")
          }
        >
          {msg}
        </span>
      )}
    </div>
  );
}
