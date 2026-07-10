import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan, formatVND } from "@/lib/plans";
import PaymentStatus from "@/components/PaymentStatus";

export const metadata = { title: "Thanh toán nâng cấp" };

export default async function NangCapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (Number.isNaN(orderId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/goi-thanh-vien");

  const { data: order } = await supabase
    .from("payments")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const plan = getPlan(order.plan_code);

  // Thông tin ngân hàng lấy từ biến môi trường (bạn tự cấu hình trên Vercel).
  const bank = process.env.NEXT_PUBLIC_SEPAY_BANK || "";
  const account = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || "";
  const accountName = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NAME || "";

  // QR động của SePay: https://qr.sepay.vn/img?acc=...&bank=...&amount=...&des=...
  const qrUrl =
    "https://qr.sepay.vn/img?acc=" +
    encodeURIComponent(account) +
    "&bank=" +
    encodeURIComponent(bank) +
    "&amount=" +
    order.amount +
    "&des=" +
    encodeURIComponent(order.transfer_content);

  const configured = bank && account;

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Thanh toán nâng cấp</h1>
      <p className="mb-6 text-gray-500">
        Gói {plan?.name || order.plan_code} - {formatVND(order.amount)}
      </p>

      <div className="mb-4">
        <PaymentStatus orderId={order.id} />
      </div>

      <div className="rounded-2xl border bg-white p-6">
        {configured ? (
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="Mã QR chuyển khoản"
              className="h-64 w-64 rounded-lg border"
            />
            <p className="mt-3 text-center text-sm text-gray-500">
              Quét mã bằng app ngân hàng để tự động điền thông tin.
            </p>
          </div>
        ) : (
          <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
            Chưa cấu hình thông tin ngân hàng SePay. Vui lòng liên hệ quản trị.
          </p>
        )}

        <div className="mt-6 space-y-2 text-sm">
          <Row label="Ngân hàng" value={bank || "-"} />
          <Row label="Số tài khoản" value={account || "-"} />
          <Row label="Chủ tài khoản" value={accountName || "-"} />
          <Row label="Số tiền" value={formatVND(order.amount)} />
          <Row label="Nội dung CK" value={order.transfer_content} highlight />
        </div>

        <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
          Vui lòng ghi ĐÚNG nội dung chuyển khoản ở trên để hệ thống tự động
          nâng cấp gói. Sai nội dung sẽ phải đối soát thủ công.
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? "font-bold text-brand" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
