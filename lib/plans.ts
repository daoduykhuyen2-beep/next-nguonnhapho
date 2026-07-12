// Cấu hình các gói đăng tin / đẩy tin / combo tháng.
// Mỗi gói có mã (code) duy nhất để webhook SePay đối chiếu.
// Nội dung chuyển khoản: NNP <code> <userIdNgan>

export type PlanGroup = "LE" | "DAY" | "COMBO";

export type Plan = {
  code: string;
  name: string;
  group: PlanGroup;
  price: number;        // VND
  marketPrice?: number; // giá thị trường tham chiếu (gạch ngang)
  days: number;         // số ngày hiệu lực (0 nếu tính theo lượt)
  maxPosts: number;
  highlight?: boolean;
  badge?: string;       // nhãn "Được chọn nhiều" / "Tiết kiệm nhất"
  unit?: string;        // ví dụ "/tháng"
  features: string[];
  // --- Điều chỉnh giá / chương trình giảm giá trong tháng ---
  promoPrice?: number;   // giá khuyến mãi (VND) – nếu có sẽ ưu tiên hiển thị
  promoLabel?: string;   // nhãn chương trình, ví dụ "Ưu đãi tháng 7"
  promoUntil?: string;   // ISO date (YYYY-MM-DD) – hết hạn khuyến mãi
};

export const PLANS: Plan[] = [
  // --- Mua lẻ theo tin ---
  {
    code: "TIN_THUONG_15",
    name: "1 tin thường 15 ngày",
    group: "LE",
    price: 28500,
    marketPrice: 40500,
    days: 15,
    maxPosts: 1,
    features: [
      "1.900đ/ngày (thị trường ~2.700đ)",
      "Hiển thị trong danh sách tìm kiếm",
      "3 lần sửa tin miễn phí",
    ],
  },
  {
    code: "VIP_VANG_7",
    name: "1 tin VIP Vàng 7 ngày",
    group: "LE",
    price: 539000,
    marketPrice: 770000,
    days: 7,
    maxPosts: 1,
    highlight: true,
    badge: "Được chọn nhiều",
    features: [
      "77.000đ/ngày (thị trường ~110.000đ)",
      "Nhãn VIP Vàng nổi bật",
      "Ưu tiên trên tin thường",
      "5 lần sửa tin miễn phí",
    ],
  },
  {
    code: "VIP_KC_7",
    name: "1 tin VIP Kim Cương 7 ngày",
    group: "LE",
    price: 1540000,
    marketPrice: 2205000,
    days: 7,
    maxPosts: 1,
    features: [
      "220.000đ/ngày (thị trường ~315.000đ)",
      "Vị trí đầu trang tìm kiếm",
      "Xuất hiện mục VIP trang chủ",
      "Hỗ trợ viết lại tiêu đề hút khách",
    ],
  },
  // --- Đẩy tin ---
  {
    code: "DAY_1",
    name: "Đẩy tin 1 lượt",
    group: "DAY",
    price: 28000,
    marketPrice: 40000,
    days: 0,
    maxPosts: 0,
    features: [
      "Tin nhảy lên đầu danh sách ngay",
    ],
  },
  {
    code: "DAY_3",
    name: "Đẩy tin 3 lượt",
    group: "DAY",
    price: 75000,
    marketPrice: 120000,
    days: 0,
    maxPosts: 0,
    highlight: true,
    badge: "Được chọn nhiều",
    features: [
      "Rẻ hơn mua lẻ từng lượt",
      "Mỗi 24h đẩy 1 lượt",
    ],
  },
  {
    code: "DAY_6",
    name: "Đẩy tin 6 lượt",
    group: "DAY",
    price: 134000,
    marketPrice: 240000,
    days: 0,
    maxPosts: 0,
    features: [
      "Mức tiết kiệm sâu nhất",
      "Phủ sóng liên tục 6 ngày",
    ],
  },
  // --- Combo tháng ---
  {
    code: "COMBO_COBAN",
    name: "Gói Cơ bản",
    group: "COMBO",
    price: 299000,
    marketPrice: 425000,
    days: 30,
    maxPosts: 10,
    unit: "/tháng",
    features: [
      "10 tin Thường (15 ngày/tin)",
      "5 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
    ],
  },
  {
    code: "COMBO_CHUYENNGHIEP",
    name: "Gói Chuyên nghiệp",
    group: "COMBO",
    price: 2490000,
    marketPrice: 3685000,
    days: 30,
    maxPosts: 25,
    unit: "/tháng",
    highlight: true,
    badge: "Tiết kiệm nhất",
    features: [
      "20 tin Thường (15 ngày/tin)",
      "5 tin VIP Vàng (7 ngày/tin)",
      "15 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
      "Huy hiệu tin từ đối tác xác thực",
    ],
  },
  {
    code: "COMBO_VIP",
    name: "Gói VIP Toàn diện",
    group: "COMBO",
    price: 7490000,
    marketPrice: 11705000,
    days: 30,
    maxPosts: 43,
    unit: "/tháng",
    features: [
      "30 tin Thường (15 ngày/tin)",
      "10 tin VIP Vàng (7 ngày/tin)",
      "3 tin VIP Kim Cương (7 ngày/tin)",
      "30 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
      "Huy hiệu tin từ đối tác xác thực",
      "Hỗ trợ viết nội dung tin chuẩn SEO",
    ],
  },
];

export function getPlan(code: string): Plan | undefined {
  return PLANS.find((p) => p.code.toUpperCase() === code.toUpperCase());
}

export function formatVND(n: number): string {
  if (!n) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
}

// Tạo nội dung chuyển khoản duy nhất cho 1 đơn.
// Dùng 8 ký tự đầu của user id (bỏ dấu gạch) để định danh.
export function buildTransferContent(planCode: string, userId: string): string {
  // Mã thanh toán: tiền tố NNP + 8 chữ số tự động (duy nhất mỗi đơn).
  // Khớp với cấu hình mã thanh toán SePay: Tiền tố = NNP, Hậu tố = số.
  void planCode;
  void userId;
  const so = String(Date.now()).slice(-8);
  return "NNP" + so;
}

// --- Giá hiệu lực sau điều chỉnh / khuyến mãi ---
export function isPromoActive(plan: Plan): boolean {
  if (plan.promoPrice == null) return false;
  if (!plan.promoUntil) return true;
  const until = new Date(plan.promoUntil + "T23:59:59");
  return !Number.isNaN(until.getTime()) && until.getTime() >= Date.now();
}

export function getEffectivePrice(plan: Plan): number {
  return isPromoActive(plan) ? (plan.promoPrice as number) : plan.price;
}

export function getDiscountPercent(plan: Plan): number {
  const base = plan.marketPrice && plan.marketPrice > plan.price ? plan.marketPrice : plan.price;
  const eff = getEffectivePrice(plan);
  if (!base || base <= 0 || eff >= base) return 0;
  return Math.round(((base - eff) / base) * 100);
}
