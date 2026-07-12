import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan, formatVND } from "@/lib/plans";
import PaymentStatus from "@/components/PaymentStatus";
import { payPackageWithBalance } from "@/app/actions/nap-tien";
import { danhDauDaChuyenKhoan } from "@/app/actions/danh-dau-ck";

export const metadata = { title: "Thanh toán nâng cấp" };

export default async function NangCapPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: payError } = await searchParams;
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

  const { data: profBal } = await supabase
    .from("profiles")
    .select("so_du")
    .eq("id", user.id)
    .maybeSingle();
  const soDu = Number(profBal?.so_du || 0);
  const duSoDu = soDu >= Number(order.amount) && order.status !== "paid" && order.plan_code !== "NAPTIEN";

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

      {payError === "nsf" && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Số dư ví không đủ để thanh toán gói này. Vui lòng nạp thêm tiền.
        </div>
      )}

      {order.status !== "paid" && order.plan_code !== "NAPTIEN" && (
        <div className="mb-4 rounded-2xl border border-brand/30 bg-brand/5 p-4">
          <p className="text-sm text-gray-700">
            Số dư ví của bạn:{" "}
            <span className="font-bold text-brand">
              {soDu.toLocaleString("vi-VN")}đ
            </span>
          </p>
          {duSoDu ? (
            <form action={payPackageWithBalance} className="mt-3">
              <input type="hidden" name="order_id" value={order.id} />
              <button
                type="submit"
                className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Thanh toán bằng số dư ({formatVND(order.amount)})
              </button>
            </form>
          ) : (
            <p className="mt-2 text-xs text-gray-500">
              Số dư chưa đủ. Bạn có thể chuyển khoản bên dưới hoặc{" "}
              <a href="/tai-khoan/nap-tien" className="font-semibold text-brand hover:underline">
                nạp thêm tiền vào ví
              </a>
              .
            </p>
          )}
        </div>
      )}

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

      {order.status !== "paid" && (
        <form action={danhDauDaChuyenKhoan} className="mt-4">
          <input type="hidden" name="order_id" value={order.id} />
          {order.cho_duyet ? (
            <div className="rounded-lg bg-amber-50 p-3 text-center text-sm font-semibold text-amber-700">
              Đã ghi nhận. Đơn của bạn đang chờ quản trị viên duyệt.
            </div>
          ) : (
            <button
              type="submit"
              className="w-full rounded-lg border border-brand bg-white px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5"
            >
              Tôi đã chuyển khoản
            </button>
          )}
          <p className="mt-2 text-center text-xs text-gray-400">
            Nếu đã chuyển khoản mà gói chưa tự nâng, bấm nút trên để báo quản trị duyệt thủ công.
          </p>
        </form>
      )}
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
