import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTopupOrder } from "@/app/actions/nap-tien";

export const metadata = { title: "Nạp tiền vào ví" };
export const dynamic = "force-dynamic";

const PRESETS = [50000, 100000, 200000, 500000, 1000000, 2000000];

function vnd(n: number) {
  return Number(n || 0).toLocaleString("vi-VN") + "đ";
}

export default async function NapTienPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/nap-tien");

  const { data: prof } = await supabase
    .from("profiles")
    .select("so_du, tong_nap")
    .eq("id", user.id)
    .maybeSingle();
  const soDu = Number(prof?.so_du || 0);
  const tongNap = Number(prof?.tong_nap || 0);

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-4">
        <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
          ← Về tài khoản
        </Link>
      </div>
      <h1 className="mb-1 text-2xl font-bold">Nạp tiền vào ví</h1>
      <p className="mb-6 text-gray-500">
        Nạp sẵn tiền vào ví để thanh toán các gói dịch vụ nhanh chóng, không cần chuyển khoản từng lần.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
          <div className="text-2xl font-extrabold text-brand">{vnd(soDu)}</div>
          <div className="mt-1 text-xs text-gray-500">Số dư hiện tại</div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
          <div className="text-2xl font-extrabold text-gray-800">{vnd(tongNap)}</div>
          <div className="mt-1 text-xs text-gray-500">Tổng đã nạp</div>
        </div>
      </div>

      {error === "amount" && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Số tiền nạp tối thiểu là 10.000đ. Vui lòng nhập lại.
        </div>
      )}
      {error === "order" && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Không tạo được lệnh nạp. Vui lòng thử lại.
        </div>
      )}

      <form action={createTopupOrder} className="rounded-2xl border bg-white p-6">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Chọn nhanh mệnh giá
        </label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {PRESETS.map((v) => (
            <label
              key={v}
              className="cursor-pointer rounded-lg border border-gray-200 px-2 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
            >
              <input type="radio" name="amount" value={v} className="peer sr-only" />
              <span className="peer-checked:text-brand">{vnd(v)}</span>
            </label>
          ))}
        </div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Hoặc nhập số tiền khác (đ)
        </label>
        <input
          type="number"
          name="amount_custom"
          min={10000}
          step={10000}
          placeholder="Ví dụ: 300000"
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Tiếp tục nạp tiền
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Bạn sẽ được chuyển tới trang chuyển khoản. Số dư được cộng ngay khi hệ thống nhận được tiền.
        </p>
      </form>
    </main>
  );
}
