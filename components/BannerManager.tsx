"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import BannerForm, { type BannerRow } from "@/components/BannerForm";
import { adminDeleteBanner, type AdminState } from "@/app/actions/admin";

function DeleteBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Đang xoá..." : "Xoá"}
    </button>
  );
}

function BannerItem({ banner }: { banner: BannerRow }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AdminState, FormData>(adminDeleteBanner, {});

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="flex items-center gap-3">
        {banner.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.image_url}
            alt=""
            className="h-12 w-20 rounded object-cover"
          />
        ) : (
          <div className="flex h-12 w-20 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">
            Gradient
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{banner.title || "(Không tiêu đề)"}</p>
          <p className="truncate text-xs text-gray-500">
            #{banner.sort} · {banner.active ? "Đang hiển thị" : "Đang ẩn"}
            {banner.link ? " · " + banner.link : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
        >
          {open ? "Đóng" : "Sửa"}
        </button>
        <form action={formAction}>
          <input type="hidden" name="id" value={banner.id} />
          <DeleteBtn />
        </form>
      </div>

      {state.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}

      {open ? (
        <div className="mt-4 border-t pt-4">
          <BannerForm banner={banner} />
        </div>
      ) : null}
    </div>
  );
}

export default function BannerManager({ banners }: { banners: BannerRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h2 className="mb-3 text-lg font-bold">Thêm banner mới</h2>
        <BannerForm />
      </div>
      <div>
        <h2 className="mb-3 text-lg font-bold">Banner hiện có ({banners.length})</h2>
        <div className="space-y-2">
          {banners.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có banner nào.</p>
          ) : (
            banners.map((b) => <BannerItem key={b.id} banner={b} />)
          )}
        </div>
      </div>
    </div>
  );
}
