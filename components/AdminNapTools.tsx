"use client";

import { useActionState, useEffect } from "react";
import { showToast } from "./Toast";
import { useFormStatus } from "react-dom";
import {
  adminCongSoDu,
  adminKichHoatGoi,
  adminResetDoanhThu,
  type NapState,
} from "@/app/actions/admin-nap";

type PlanOpt = { code: string; name: string };

function SubmitBtn({ label, color = "brand" }: { label: string; color?: string }) {
  const { pending } = useFormStatus();
  const cls =
    color === "red"
      ? "bg-red-600"
      : color === "green"
      ? "bg-green-600"
      : "bg-brand";
  return (
    <button
      type="submit"
      disabled={pending}
      className={"rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 " + cls}
    >
      {pending ? "Dang xu ly..." : label}
    </button>
  );
}

function Msg({ state }: { state: NapState }) {
  if (state?.error) return <p className="mt-2 text-sm text-red-600">{state.error}</p>;
  if (state?.success) return <p className="mt-2 text-sm text-green-600">{state.message || "Thanh cong."}</p>;
  return null;
}

export default function AdminNapTools({ plans }: { plans: PlanOpt[] }) {
  const [sdState, sdAction] = useActionState<NapState, FormData>(adminCongSoDu, {});
  const [goiState, goiAction] = useActionState<NapState, FormData>(adminKichHoatGoi, {});
  const [resetState, resetAction] = useActionState<NapState, FormData>(adminResetDoanhThu, {});

  useEffect(() => {
    for (const st of [sdState, goiState, resetState]) {
      if (st?.success) { showToast(st.message || "Thao tác thành công"); }
      else if (st?.error) { showToast(st.error, "error"); }
    }
  }, [sdState, goiState, resetState]);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* (a) Cong so du khong gioi han */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="mb-1 text-lg font-bold">Nap so du (khong gioi han)</h3>
        <p className="mb-4 text-sm text-gray-500">Cong thang so du vi cho mot tai khoan theo email, khong can chuyen khoan.</p>
        <form action={sdAction} className="flex flex-col gap-3">
          <input name="email" type="email" required placeholder="Email tai khoan" className="rounded-lg border px-3 py-2 text-sm" />
          <input name="amount" required placeholder="So tien (VND), vi du 500000" className="rounded-lg border px-3 py-2 text-sm" />
          <SubmitBtn label="Cong so du" />
        </form>
        <Msg state={sdState} />
      </div>

      {/* (b) Kich hoat goi truc tiep */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="mb-1 text-lg font-bold">Kich hoat goi (khong gioi han)</h3>
        <p className="mb-4 text-sm text-gray-500">Kich hoat goi truc tiep cho mot tai khoan theo email, khong can thanh toan.</p>
        <form action={goiAction} className="flex flex-col gap-3">
          <input name="email" type="email" required placeholder="Email tai khoan" className="rounded-lg border px-3 py-2 text-sm" />
          <select name="plan_code" required className="rounded-lg border px-3 py-2 text-sm">
            <option value="">-- Chon goi --</option>
            {plans.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
          <SubmitBtn label="Kich hoat goi" color="green" />
        </form>
        <Msg state={goiState} />
      </div>

      {/* Reset doanh thu */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 lg:col-span-2">
        <h3 className="mb-1 text-lg font-bold text-red-700">Reset doanh thu</h3>
        <p className="mb-4 text-sm text-gray-600">Danh dau moc tinh doanh thu tu bay gio. Cac giao dich cu van luu, chi khong tinh vao doanh thu ky moi. Dung khi ket thuc thang de xem doanh thu ky tiep theo.</p>
        <form action={resetAction}>
          <SubmitBtn label="Reset doanh thu ve 0 (bat dau ky moi)" color="red" />
        </form>
        <Msg state={resetState} />
      </div>
    </div>
  );
}
