"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { uploadPostImages } from "@/lib/upload";
import type { Profile } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Lưu thông tin"}
    </button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState<ProfileState, FormData>(
    updateProfile,
    {}
  );
  const [avatar, setAvatar] = useState<string>(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string>("");

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const [url] = await uploadPostImages([file]);
      if (url) setAvatar(url);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Ảnh đại diện */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-gray-200 bg-gray-100">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Ảnh đại diện" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
              👤
            </div>
          )}
        </div>
        <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          {uploading ? "Đang tải ảnh..." : "Tải ảnh đại diện"}
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploading} />
        </label>
        {uploadErr && <p className="text-sm text-red-600">{uploadErr}</p>}
        <input type="hidden" name="avatar_url" value={avatar} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Họ và tên</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mã số thuế cá nhân</label>
          <input
            name="vat_tax_code"
            defaultValue={profile?.vat_tax_code ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
          <input
            name="phone"
            defaultValue={profile?.phone ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tuổi</label>
          <input
            name="age"
            type="number"
            defaultValue={profile?.age ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Giới tính</label>
          <select
            name="gender"
            defaultValue={profile?.gender ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">-- Chọn --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
          <input
            name="address"
            defaultValue={profile?.address ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Giới thiệu</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={profile?.bio ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Đã lưu thông tin thành công.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
