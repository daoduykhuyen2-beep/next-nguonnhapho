// lib/help.ts
// Dữ liệu Trung tâm trợ giúp (Help Center) cho Nguồn Nhà Phố HCM.
// Nội dung tĩnh, không cần database — chỉnh sửa trực tiếp tại đây.

export type HelpBlock =
  | { type: "callout"; title: string; body: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] };

export type FaqItem = { q: string; a: string };

export type HelpArticle = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  blocks: HelpBlock[];
  faqs?: FaqItem[];
};

export type HelpCategory = {
  slug: string;
  name: string;
  icon: string;
  description: string;
};

export const HELP_CATEGORIES: HelpCategory[] = [
  { slug: "bat-dau", name: "Bắt đầu", icon: "🚀", description: "Tạo tài khoản và những bước đầu tiên." },
  { slug: "dang-tin", name: "Đăng tin", icon: "📝", description: "Hướng dẫn & quy định đăng tin nhà phố." },
  { slug: "thanh-toan", name: "Thanh toán & Gói", icon: "💳", description: "Các gói thành viên và hình thức thanh toán." },
  { slug: "tai-khoan", name: "Tài khoản", icon: "👤", description: "Quản lý thông tin và bảo mật tài khoản." },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "gioi-thieu-trung-tam-tro-giup",
    title: "Giới thiệu Trung tâm trợ giúp",
    category: "bat-dau",
    summary: "Trung tâm trợ giúp là gì và bạn tìm được gì ở đây.",
    blocks: [
      { type: "callout", title: "TRUNG TÂM TRỢ GIÚP LÀ GÌ?", body: "Nơi tập hợp hướng dẫn, quy định và câu hỏi thường gặp giúp bạn sử dụng Nguồn Nhà Phố HCM dễ dàng, minh bạch và an toàn." },
      { type: "paragraph", text: "Tại đây bạn có thể tìm hiểu cách đăng tin nhà phố, các gói thành viên, hình thức thanh toán và cách quản lý tài khoản. Nội dung được sắp xếp theo chủ đề để bạn tra cứu nhanh." },
      { type: "heading", text: "Bạn nên bắt đầu từ đâu?" },
      { type: "list", items: [
        "Chưa có tài khoản: xem mục Bắt đầu để đăng ký.",
        "Muốn rao bán / cho thuê: xem mục Đăng tin.",
        "Cần nâng hiệu quả tin: xem mục Thanh toán & Gói.",
      ] },
    ],
  },
  {
    slug: "tao-tai-khoan",
    title: "Cách tạo tài khoản",
    category: "bat-dau",
    summary: "Đăng ký tài khoản Nguồn Nhà Phố HCM chỉ trong vài bước.",
    blocks: [
      { type: "callout", title: "ĐĂNG KÝ NHANH", body: "Bạn chỉ cần họ tên, email và số điện thoại để tạo tài khoản miễn phí." },
      { type: "heading", text: "Các bước đăng ký" },
      { type: "steps", items: [
        "Truy cập trang Đăng ký từ menu góc trên bên phải.",
        "Nhập họ tên, email, số điện thoại và mật khẩu.",
        "Xác nhận mật khẩu rồi bấm \"Đăng ký\".",
        "Kiểm tra email/điện thoại để xác minh và hoàn tất.",
      ] },
      { type: "paragraph", text: "Sau khi đăng ký, bạn có thể đăng tin, lưu tin yêu thích và quản lý tin của mình trong mục Tài khoản." },
    ],
    faqs: [
      { q: "Đăng ký có mất phí không?", a: "Không. Việc tạo tài khoản hoàn toàn miễn phí. Bạn chỉ trả phí khi mua gói đăng tin nâng cao." },
      { q: "Tôi quên mật khẩu thì sao?", a: "Bấm \"Quên mật khẩu?\" tại trang đăng nhập và làm theo hướng dẫn để đặt lại." },
    ],
  },
  {
    slug: "huong-dan-dang-tin",
    title: "Hướng dẫn đăng tin",
    category: "dang-tin",
    summary: "Cách đăng một tin bán / cho thuê nhà phố chuẩn, thu hút khách.",
    blocks: [
      { type: "callout", title: "ĐĂNG TIN HIỆU QUẢ", body: "Tin có ảnh thật, thông tin đầy đủ và pháp lý rõ ràng sẽ được khách quan tâm nhiều hơn." },
      { type: "heading", text: "Các bước đăng tin" },
      { type: "steps", items: [
        "Đăng nhập rồi bấm \"Đăng tin\" trên thanh menu.",
        "Chọn loại: Bán hoặc Cho thuê, và khu vực (quận).",
        "Nhập tiêu đề, giá, diện tích, số tầng và mô tả chi tiết.",
        "Tải lên ảnh thật của căn nhà (nên có mặt tiền, trong nhà, sổ).",
        "Kiểm tra lại thông tin và bấm \"Đăng tin\".",
      ] },
      { type: "heading", text: "Quy định nội dung" },
      { type: "list", items: [
        "Thông tin và hình ảnh phải đúng hiện trạng căn nhà.",
        "Giá công bố là giá thật, không thổi giá / giá ảo.",
        "Không đăng tin trùng lặp cho cùng một căn.",
        "Không đăng nội dung vi phạm pháp luật hoặc thuần phong mỹ tục.",
      ] },
    ],
    faqs: [
      { q: "Vì sao tin của tôi chưa hiển thị?", a: "Tin có thể đang chờ duyệt để đảm bảo đúng quy định. Thời gian duyệt thường trong vài giờ làm việc." },
      { q: "Tôi sửa tin đã đăng được không?", a: "Được. Vào mục Tài khoản → Tin của tôi, chọn tin cần sửa và cập nhật thông tin." },
    ],
  },
  {
    slug: "goi-thanh-vien",
    title: "Các gói thành viên",
    category: "thanh-toan",
    summary: "Tổng quan các gói giúp tin đăng của bạn hiển thị tốt hơn.",
    blocks: [
      { type: "callout", title: "GÓI THÀNH VIÊN LÀ GÌ?", body: "Là các gói dịch vụ giúp tin đăng của bạn hiển thị nổi bật, tiếp cận nhiều khách hàng hơn." },
      { type: "paragraph", text: "Bạn có thể chọn gói phù hợp với nhu cầu, từ đăng tin cơ bản đến tin VIP nổi bật. Chi tiết quyền lợi và giá xem tại trang Bảng giá." },
      { type: "heading", text: "Quyền lợi thường có" },
      { type: "list", items: [
        "Tin hiển thị ưu tiên ở đầu danh sách.",
        "Gắn nhãn nổi bật / VIP để thu hút khách.",
        "Thời gian hiển thị dài hơn so với tin thường.",
      ] },
    ],
    faqs: [
      { q: "Tôi xem bảng giá ở đâu?", a: "Vào mục Bảng giá trên thanh menu để xem chi tiết từng gói và mức giá." },
      { q: "Gói có tự động gia hạn không?", a: "Tùy gói. Bạn có thể bật/tắt tự động gia hạn trong mục Tài khoản." },
    ],
  },
  {
    slug: "hinh-thuc-thanh-toan",
    title: "Các hình thức thanh toán",
    category: "thanh-toan",
    summary: "Những cách thanh toán khi mua gói đăng tin.",
    blocks: [
      { type: "callout", title: "THANH TOÁN AN TOÀN", body: "Chọn hình thức thanh toán thuận tiện và làm theo hướng dẫn trên màn hình để hoàn tất." },
      { type: "heading", text: "Các bước thanh toán" },
      { type: "steps", items: [
        "Chọn gói bạn muốn mua tại trang Bảng giá.",
        "Bấm \"Thanh toán\" và chọn hình thức phù hợp.",
        "Làm theo hướng dẫn (chuyển khoản / cổng thanh toán).",
        "Chờ hệ thống xác nhận — quyền lợi gói sẽ được kích hoạt.",
      ] },
      { type: "paragraph", text: "Nếu sau khi thanh toán mà gói chưa được kích hoạt, vui lòng liên hệ bộ phận hỗ trợ để được kiểm tra." },
    ],
    faqs: [
      { q: "Bao lâu thì gói được kích hoạt?", a: "Thông thường ngay sau khi hệ thống xác nhận thanh toán thành công." },
      { q: "Tôi có được xuất hóa đơn không?", a: "Vui lòng liên hệ bộ phận hỗ trợ và cung cấp thông tin để được hỗ trợ xuất hóa đơn." },
    ],
  },
  {
    slug: "bao-mat-tai-khoan",
    title: "Bảo mật tài khoản",
    category: "tai-khoan",
    summary: "Giữ tài khoản an toàn và xử lý khi gặp sự cố.",
    blocks: [
      { type: "callout", title: "AN TOÀN LÀ TRÊN HẾT", body: "Không chia sẻ mật khẩu cho bất kỳ ai. Nguồn Nhà Phố HCM không bao giờ hỏi mật khẩu của bạn." },
      { type: "list", items: [
        "Dùng mật khẩu mạnh, không trùng với các trang khác.",
        "Đổi mật khẩu định kỳ trong mục Tài khoản.",
        "Đăng xuất khi dùng máy tính công cộng.",
      ] },
    ],
    faqs: [
      { q: "Tôi nghi ngờ tài khoản bị truy cập trái phép?", a: "Đổi mật khẩu ngay và liên hệ hỗ trợ để được kiểm tra và bảo vệ tài khoản." },
    ],
  },
];

export function getArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.category === categorySlug);
}

export const HELP_CONTACT = {
  hotline: "1900 0000",
  email: "hotro@nguonnhaphohcm.vn",
};
