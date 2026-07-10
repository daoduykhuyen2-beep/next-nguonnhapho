"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Poll trạng thái đơn mỗi 5 giây. Khi webhook SePay xác nhận -> status = "paid".
export default function PaymentStatus({ orderId }: { orderId: number }) {
  const [status, setStatus] = useState<string>("pending");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function check() {
      const { data } = await supabase
        .from("payments")
        .select("status")
        .eq("id", orderId)
        .maybeSingle();
      if (active && data?.status) {
        setStatus(data.status);
        if (data.status === "paid") {
          setTimeout(() => router.push("/tai-khoan"), 1500);
        }
      }
    }

    check();
    const t = setInterval(check, 5000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [orderId, router]);

  if (status === "paid") {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center font-semibold text-green-700">
        ✓ Thanh toán thành công! Đang chuyển về tài khoản...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
      <span className="h-3 w-3 animate-ping rounded-full bg-yellow-500" />
      Đang chờ thanh toán... (tự động cập nhật)
    </div>
  );
}
