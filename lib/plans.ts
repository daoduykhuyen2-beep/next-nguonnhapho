// Cấu hình các gói thành viên.
// Mỗi gói có mã (code), tên, giá (VND), số ngày hiệu lực và quyền lợi.
// Nội dung chuyển khoản sẽ dùng dạng: NNP <code> <userIdNgan>
// để webhook SePay đối chiếu và nâng cấp đúng người, đúng gói.

export type Plan = {
  code: string;
  name: string;
  price: number; // VND
  days: number; // số ngày hiệu lực
  maxPosts: number; // số tin tối đa (0 = không giới hạn hiển thị đặc biệt)
  highlight?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    code: "FREE",
    name: "Miễn phí",
    price: 0,
    days: 0,
    maxPosts: 5,
    features: ["Đăng tối đa 5 tin", "Hiển thị tin thường", "Hỗ trợ cơ bản"],
  },
  {
    code: "BASIC",
    name: "Cơ bản",
    price: 99000,
    days: 30,
    maxPosts: 30,
    features: [
      "Đăng tối đa 30 tin / tháng",
      "Tin hiển thị ưu tiên hơn",
      "Huy hiệu thành viên",
    ],
  },
  {
    code: "PRO",
    name: "Chuyên nghiệp",
    price: 249000,
    days: 30,
    maxPosts: 100,
    highlight: true,
    features: [
      "Đăng tối đa 100 tin / tháng",
      "Tin đẩy lên đầu danh sách",
      "Gắn nhãn Tin nổi bật",
      "Hỗ trợ ưu tiên",
    ],
  },
  {
    code: "VIP",
    name: "VIP",
    price: 599000,
    days: 30,
    maxPosts: 1000,
    features: [
      "Đăng không giới hạn (tối đa 1000)",
      "Tin VIP nổi bật nhất",
      "Ưu tiên tuyệt đối trên trang chủ",
      "Hỗ trợ riêng 24/7",
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
  const short = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return "NNP " + planCode.toUpperCase() + " " + short;
}
