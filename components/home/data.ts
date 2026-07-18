export const TIEU_DIEM = [
  { icon: "home", tieuDe: "100% nhà thật – chính chủ", moTa: "Mỗi tin đăng đều được xác minh nguồn gốc và pháp lý cơ bản, hạn chế tối đa tin ảo, tin trùng." },
  { icon: "pin", tieuDe: "Chuyên nhà phố trung tâm", moTa: "Tập trung Quận 1, 3, 5, 10, Bình Thạnh, Phú Nhuận – nơi khó tìm được nguồn hàng chuẩn ở nơi khác." },
  { icon: "handshake", tieuDe: "Kết nối trực tiếp chủ nhà", moTa: "Ưu tiên tin chính chủ, giảm khâu trung gian để bạn thương lượng nhanh và minh bạch hơn." },
  { icon: "shield", tieuDe: "Đồng hành pháp lý", moTa: "Cảnh báo rủi ro, hướng dẫn kiểm tra sổ, quy hoạch trước khi xuống tiền giữ chỗ." },
] as const;

export const KHACH_HANG = [
  { ten: "Anh Tuấn", vaiTro: "Mua nhà Quận 3", noiDung: "Nhà đúng như ảnh, chủ thật nên đi xem là chốt được luôn, không mất thời gian lọc tin ảo như mấy chỗ khác." },
  { ten: "Chị Hương", vaiTro: "Cho thuê mặt bằng Q.1", noiDung: "Đăng buổi sáng, chiều đã có người liên hệ. Đội hỗ trợ nhiệt tình, hướng dẫn từng bước rất dễ hiểu." },
  { ten: "Anh Phát", vaiTro: "Nhà đầu tư", noiDung: "Mình thích nhất phần cảnh báo pháp lý, giúp tránh được vài căn dính quy hoạch trước khi đặt cọc." },
] as const;

export const MOI_GIOI = [
  { ten: "Minh Đức", vaiTro: "Môi giới khu trung tâm", noiDung: "Nguồn hàng chính chủ nhiều nên mình tư vấn tự tin hơn hẳn. Khách tin tưởng vì tin nào cũng có thật, dẫn đi xem là có nhà." },
  { ten: "Thùy Linh", vaiTro: "Môi giới cho thuê", noiDung: "Công cụ đăng và đẩy tin dễ dùng, tin lên nhanh. Làm ở đây mình chủ động thời gian mà lượng khách gọi về đều đặn." },
] as const;

export const DICH_VU = [
  { icon: "sell", tieuDe: "Nhà phố cần bán", href: "/tin-dang?loai=ban",
    moTa: "Kho nhà phố, căn hộ, đất nền tại các quận trung tâm cập nhật mỗi ngày. Ưu tiên tin chính chủ, giá thật, thông tin rõ ràng để bạn dễ so sánh." },
  { icon: "key", tieuDe: "Nhà & mặt bằng cho thuê", href: "/tin-dang?loai=thue",
    moTa: "Từ nhà nguyên căn, căn hộ đến mặt bằng kinh doanh, văn phòng. Bộ lọc theo khu vực, ngân sách giúp bạn tìm chỗ ưng ý trong vài phút." },
  { icon: "video", tieuDe: "Review khu vực & dự án", href: "/tin-tuc",
    moTa: "Video và bài phân tích thực tế từng con đường, từng khu để bạn hình dung rõ nơi định an cư hay đầu tư trước khi đi xem tận nơi." },
  { icon: "book", tieuDe: "Cẩm nang nhà đất", href: "/tin-tuc",
    moTa: "Kinh nghiệm mua bán, thuê, vay vốn, kiểm tra pháp lý và mẹo xem nhà. Kiến thức gọn, dễ áp dụng cho cả người mua lần đầu." },
] as const;
