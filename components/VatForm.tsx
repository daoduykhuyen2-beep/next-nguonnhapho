"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateVat, type AccountState } from "@/app/actions/account";
import type { Profile } from "@/lib/types";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
      {pending ? "Đang lưu..." : "Lưu thông tin VAT"}
    </button>
  );
}

export default function VatForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState<AccountState, FormData>(updateVat, {});
  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Tên công ty / đơn vị</label>
        <input name="vat_company" defaultValue={profile?.vat_company || ""} className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Mã số thuế</label>
        <input name="vat_tax_code" defaultValue={profile?.vat_tax_code || ""} className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Địa chỉ xuất hóa đơn</label>
        <input name="vat_address" defaultValue={profile?.vat_address || ""} className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email nhận hóa đơn</label>
        <input name="vat_email" type="email" defaultValue={profile?.vat_email || ""} className="w-full rounded-lg border px-4 py-3" />
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã lưu thông tin VAT.</p> : null}
      <Save />
    </form>
  );
}
