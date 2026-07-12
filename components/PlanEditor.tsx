"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSavePlanOverride, type PlanState } from "@/app/actions/plans";
import { formatVND, type Plan } from "@/lib/plans";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Dang luu..." : "Luu goi"}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

function PlanRow({ plan }: { plan: Plan }) {
  const [state, formAction] = useActionState<PlanState, FormData>(
    adminSavePlanOverride,
    {}
  );
  return (
    <form
      action={formAction}
      className="rounded-xl border border-gray-200 bg-white p-4"
    >
      <input type="hidden" name="code" value={plan.code} />
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-semibold">{plan.name}</p>
          <p className="text-xs text-gray-400">Ma: {plan.code} - Gia hien tai: {formatVND(plan.price)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Ten goi" name="name" defaultValue={plan.name} />
        <Field label="Gia ban (VND)" name="price" type="number" defaultValue={plan.price} />
        <Field label="Gia thi truong (VND)" name="market_price" type="number" defaultValue={plan.marketPrice ?? ""} />
        <Field label="Gia khuyen mai (VND)" name="promo_price" type="number" defaultValue={plan.promoPrice ?? ""} placeholder="de trong = khong KM" />
        <Field label="Nhan khuyen mai" name="promo_label" defaultValue={plan.promoLabel ?? ""} placeholder="VD: Uu dai thang 7" />
        <Field label="KM den ngay" name="promo_until" type="date" defaultValue={plan.promoUntil ?? ""} />
        <Field label="Nhan noi bat (badge)" name="badge" defaultValue={plan.badge ?? ""} placeholder="VD: Duoc chon nhieu" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SaveBtn />
        {state?.error ? <span className="text-sm text-red-600">{state.error}</span> : null}
        {state?.success ? <span className="text-sm text-green-600">Da luu.</span> : null}
      </div>
    </form>
  );
}

export default function PlanEditor({ plans }: { plans: Plan[] }) {
  const groups: { key: Plan["group"]; title: string }[] = [
    { key: "LE", title: "Mua le theo tin" },
    { key: "DAY", title: "Day tin" },
    { key: "COMBO", title: "Combo thang" },
  ];
  return (
    <div className="space-y-8">
      {groups.map((g) => {
        const list = plans.filter((p) => p.group === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key}>
            <h3 className="mb-3 text-lg font-bold">{g.title}</h3>
            <div className="space-y-4">
              {list.map((p) => (
                <PlanRow key={p.code} plan={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
