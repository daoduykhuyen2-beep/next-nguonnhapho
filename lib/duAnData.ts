// Du lieu Du an & Chung cu - trich tu Danh_sach_ChungCu_DuAn.xlsx
// Tong 41 tin. Cap nhat danh sach bang cach sua mang DU_AN_ITEMS ben duoi.

export type DuAnItem = {
  ma: number;
  loai: string;
  htrang: string;
  duAn: string;
  diaChi: string;
  duong: string;
  quan: string;
  tinh: string;
  dt: number;
  tang: number;
  gia: number;
  donGia: number;
  phapLy: string;
  hopDong: string;
  dacDiem: string;
  ngayCN: string;
  anh?: string;
};

export const DU_AN_ITEMS: DuAnItem[] = [
  {
    ma: 50063, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "027 Lô A,Phường 5", duong: "Lạc Long Quân",
    quan: "Quận 11", tinh: "Hồ Chí Minh", dt: 74, tang: 2,
    gia: 5.5, donGia: 74, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "03/08/2024",
  },
  {
    ma: 57520, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "P816 & P916", duong: "Đường 9",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 60, tang: 8,
    gia: 4.99, donGia: 83, phapLy: "Có sổ - Thiếu Seri sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "View Hồ - Công viên, Mặt phố, Văn phòng, Thang máy, Dòng tiền", ngayCN: "16/07/2026",
  },
  {
    ma: 61077, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Asiana Capella", diaChi: "Phòng 03.36 - 184", duong: "Trần Văn Kiểu",
    quan: "Quận 6", tinh: "Hồ Chí Minh", dt: 38.08, tang: 3,
    gia: 2.58, donGia: 68, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "10/06/2026",
  },
  {
    ma: 73089, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "134.601", duong: "Trần Hưng Đạo",
    quan: "Quận 1", tinh: "Hồ Chí Minh", dt: 97.74, tang: 7,
    gia: 7.8, donGia: 80, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "04/04/2026",
  },
  {
    ma: 84534, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "639B", duong: "Nguyễn Trãi",
    quan: "Quận 5", tinh: "Hồ Chí Minh", dt: 61.2, tang: 2,
    gia: 9.8, donGia: 160, phapLy: "Có sổ - Thiếu Seri sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, Kinh doanh", ngayCN: "02/07/2026",
  },
  {
    ma: 91608, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "1Bis", duong: "Nguyễn Thành Ý",
    quan: "Quận 1", tinh: "Hồ Chí Minh", dt: 105, tang: 2,
    gia: 28.8, donGia: 274, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "24/06/2025",
  },
  {
    ma: 100336, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "207 - 001", duong: "Bùi Viện",
    quan: "Quận 1", tinh: "Hồ Chí Minh", dt: 86, tang: 1,
    gia: 15.9, donGia: 185, phapLy: "Có sổ - Thiếu Seri sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "18/07/2025",
  },
  {
    ma: 101746, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "B.01.10 - 454", duong: "Võ Chí Công",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 65, tang: 2,
    gia: 8.3, donGia: 128, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố, Kinh doanh, Văn phòng, Lô góc, Căn hộ cao cấp", ngayCN: "02/11/2025",
  },
  {
    ma: 108530, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Carillon Apartment", diaChi: "F1.10 Số 1", duong: "Trần Văn Danh",
    quan: "Tân Bình", tinh: "Hồ Chí Minh", dt: 162.6, tang: 2,
    gia: 13.9, donGia: 85, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "24/03/2026",
  },
  {
    ma: 117837, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Sunshine Sky City", diaChi: "S2.22.07 (P TÂN PHÚ)", duong: "Phú Thuận",
    quan: "Quận 7", tinh: "Hồ Chí Minh", dt: 78, tang: 22,
    gia: 6, donGia: 77, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "17/04/2026",
  },
  {
    ma: 117838, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Sunshine Sky City", diaChi: "S2.27.06 ( P Tân Phú )", duong: "Phú Thuận",
    quan: "Quận 7", tinh: "Hồ Chí Minh", dt: 78, tang: 27,
    gia: 6, donGia: 77, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "17/04/2026",
  },
  {
    ma: 121895, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "28.31", duong: "Âu Dương Lân",
    quan: "Quận 8", tinh: "Hồ Chí Minh", dt: 128.4, tang: 6,
    gia: 25.8, donGia: 201, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Ngõ ô tô", ngayCN: "05/12/2025",
  },
  {
    ma: 127947, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "150", duong: "Trần Hưng Đạo",
    quan: "Quận 5", tinh: "Hồ Chí Minh", dt: 119.53, tang: 1,
    gia: 14.2, donGia: 119, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "13/06/2026",
  },
  {
    ma: 133950, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "107.33.24F", duong: "Nguyễn Văn Khối",
    quan: "Gò Vấp", tinh: "Hồ Chí Minh", dt: 60, tang: 4,
    gia: 6.94, donGia: 116, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ 3 gác, Thuê ở, Dòng tiền", ngayCN: "04/03/2026",
  },
  {
    ma: 134395, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Chung cư Bông Sao", diaChi: "Chung cư 4.18 khu Bông sao, Lôa1 , Bình Đông, P5", duong: "Đường A1",
    quan: "Quận 8", tinh: "Hồ Chí Minh", dt: 59, tang: 1,
    gia: 3.35, donGia: 57, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "14/03/2026",
  },
  {
    ma: 135474, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "D3 _ 3 Khu phố sky Garden _1_p1-1 phường Tân Phong quận 7", duong: "Đường D3",
    quan: "Quận 7", tinh: "Hồ Chí Minh", dt: 100, tang: 1,
    gia: 7.1, donGia: 71, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "14/03/2026",
  },
  {
    ma: 139299, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Sài Gòn Airport Plaza", diaChi: "B2-03.07B", duong: "Bạch Đằng",
    quan: "Tân Bình", tinh: "Hồ Chí Minh", dt: 147, tang: 3,
    gia: 11.4, donGia: 78, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Lô góc, Thang máy, View Hồ - Công viên, Căn hộ cao cấp", ngayCN: "04/04/2026",
  },
  {
    ma: 139841, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Carillon 5", diaChi: "(Shophouse 006-T06 Chung cư Carillon 5) 262.3", duong: "Lũy Bán Bích",
    quan: "Tân Phú", tinh: "Hồ Chí Minh", dt: 244.2, tang: 2,
    gia: 16.5, donGia: 68, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Ngõ ô tô, Lô góc, Thang máy, Shophouse, Dòng tiền", ngayCN: "07/04/2026",
  },
  {
    ma: 139881, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "126.14", duong: "Trần Phú",
    quan: "Vũng Tàu", tinh: "Bà Rịa - Vũng Tàu", dt: 3361, tang: 4,
    gia: 119, donGia: 35, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô", ngayCN: "22/06/2026",
  },
  {
    ma: 142474, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "(B.01.09) 11B Nguyễn Văn Tiết P.Lái Thiêu", duong: "",
    quan: "Thuận An", tinh: "Bình Dương", dt: 76.3, tang: 1,
    gia: 5.5, donGia: 72, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Shophouse, Mặt phố, Kinh doanh, Cửa hàng, Thời trang", ngayCN: "22/04/2026",
  },
  {
    ma: 142526, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "275", duong: "Lê Văn Sỹ",
    quan: "Tân Bình", tinh: "Hồ Chí Minh", dt: 68, tang: 1,
    gia: 14.5, donGia: 213, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, Kinh doanh", ngayCN: "22/04/2026",
  },
  {
    ma: 144271, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "111A. Căn hộ 18.01 tầng 18 toà nhà sailing tower", duong: "Đường Pasteur",
    quan: "Quận 1", tinh: "Hồ Chí Minh", dt: 97.5, tang: 18,
    gia: 21, donGia: 215, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "View Hồ - Công viên", ngayCN: "06/05/2026",
  },
  {
    ma: 144594, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "786.1 Đoàn Văn Bơ, phường 16, quận 4", duong: "Đoàn Văn Bơ",
    quan: "Quận 4", tinh: "Hồ Chí Minh", dt: 143.5, tang: 2,
    gia: 11.5, donGia: 80, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Cấp 4, Dòng tiền", ngayCN: "07/05/2026",
  },
  {
    ma: 144596, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Cantavil An Phú - Cantavil Premier", diaChi: "2", duong: "Đường Số 25",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 98, tang: 8,
    gia: 9.1, donGia: 93, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, Kinh doanh, Thuê ở, Căn hộ, Dòng tiền", ngayCN: "07/05/2026",
  },
  {
    ma: 144602, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Cantavil An Phú - Cantavil Premier", diaChi: "13.07 1C2", duong: "Đường Số 25",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 98, tang: 14,
    gia: 9.1, donGia: 93, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, View Hồ - Công viên, Căn hộ, Dòng tiền", ngayCN: "07/05/2026",
  },
  {
    ma: 144606, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "361.1", duong: "Ung Văn Khiêm",
    quan: "Bình Thạnh", tinh: "Hồ Chí Minh", dt: 75, tang: 12,
    gia: 5.45, donGia: 73, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, View Hồ - Công viên, Căn hộ, Dòng tiền", ngayCN: "07/05/2026",
  },
  {
    ma: 144608, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "8.06 53", duong: "Song Hành",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 88, tang: 8,
    gia: 5.45, donGia: 62, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố, Lô góc, View Hồ - Công viên, Căn hộ, Dòng tiền", ngayCN: "07/05/2026",
  },
  {
    ma: 145745, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "20a", duong: "Tân Thới Nhất 05",
    quan: "Quận 12", tinh: "Hồ Chí Minh", dt: 70.6, tang: 2,
    gia: 4.5, donGia: 64, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "14/05/2026",
  },
  {
    ma: 145821, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "441.39-43", duong: "Nguyễn Đình Chiểu",
    quan: "Quận 3", tinh: "Hồ Chí Minh", dt: 80, tang: 1,
    gia: 36, donGia: 450, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô, Kinh doanh, Cửa hàng, Thời trang, Văn phòng", ngayCN: "14/05/2026",
  },
  {
    ma: 146209, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Viva Plaza", diaChi: "CĂN HỘ B08 _ 03_A12 ĐƯỜNG D4 ,_ KHU TÁI ĐỊNH CƯ", duong: "Đường 12",
    quan: "Quận 7", tinh: "Hồ Chí Minh", dt: 80, tang: 8,
    gia: 3.55, donGia: 44, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "21/05/2026",
  },
  {
    ma: 148152, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "The Splendor", diaChi: "005 Block A", duong: "Nguyễn Văn Dung",
    quan: "Gò Vấp", tinh: "Hồ Chí Minh", dt: 203, tang: 2,
    gia: 9.8, donGia: 48, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Kinh doanh, Cửa hàng, Lô góc, View Hồ - Công viên", ngayCN: "30/05/2026",
  },
  {
    ma: 148390, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "1002 (Căn Hộ 12A.38 Tầng 13 The Pegasuite Phường Bình Đông TP.HCM)", duong: "Tạ Quang Bửu",
    quan: "Quận 8", tinh: "Hồ Chí Minh", dt: 82.7, tang: 13,
    gia: 6.3, donGia: 76, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố, Lô góc, Thang máy, View Hồ - Công viên", ngayCN: "19/07/2026",
  },
  {
    ma: 149874, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "", diaChi: "Căn Hộ GB - 31.9", duong: "Nguyễn Thị Thập",
    quan: "Quận 7", tinh: "Hồ Chí Minh", dt: 94, tang: 1,
    gia: 3.9, donGia: 41, phapLy: "Chưa sổ/Chờ cấp sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô", ngayCN: "17/06/2026",
  },
  {
    ma: 150402, loai: "Chung cư", htrang: "Bán mạnh",
    duAn: "Celadon City", diaChi: "36 (Căn hộ tầng trệt 1 trệt 1 lầu đúc BTCT A1.21)", duong: "Tân Thắng",
    quan: "Tân Phú", tinh: "Hồ Chí Minh", dt: 103, tang: 2,
    gia: 8.8, donGia: 85, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố, Kinh doanh, Cửa hàng, Thời trang, Văn phòng", ngayCN: "20/06/2026",
  },
  {
    ma: 48505, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "G25 KDC Phố Đông Villa, Phường Cát Lái, Quận 2", duong: "",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 90, tang: 3,
    gia: 23, donGia: 256, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô, Kinh doanh", ngayCN: "24/07/2024",
  },
  {
    ma: 56285, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "17.20", duong: "Đường 328",
    quan: "Xuyên Mộc", tinh: "Bà Rịa - Vũng Tàu", dt: 6753, tang: 0,
    gia: 11.5, donGia: 2, phapLy: "Có sổ - Thiếu Seri sổ",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô", ngayCN: "03/01/2026",
  },
  {
    ma: 56418, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "118.5", duong: "Quốc lộ 56",
    quan: "Long Khánh", tinh: "Đồng Nai", dt: 10266, tang: 0,
    gia: 12, donGia: 1, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Ngõ ô tô", ngayCN: "03/01/2026",
  },
  {
    ma: 85489, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "Thửa 522, Tờ 13", duong: "Đường N10",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 100, tang: 0,
    gia: 5, donGia: 50, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký chính chủ (ĐC1)", dacDiem: "Mặt phố", ngayCN: "07/12/2025",
  },
  {
    ma: 109525, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "606.3", duong: "Quốc Lộ 13",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 7357.1, tang: 2,
    gia: 200, donGia: 27, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Ngõ ô tô, Đất", ngayCN: "21/09/2025",
  },
  {
    ma: 136903, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "", diaChi: "Thửa 602 Xã trung lập hạ huyện củ chi", duong: "Tỉnh Lộ 7",
    quan: "Củ Chi", tinh: "Hồ Chí Minh", dt: 240.1, tang: 0,
    gia: 3.5, donGia: 15, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Đất", ngayCN: "23/03/2026",
  },
  {
    ma: 147386, loai: "Dự án", htrang: "Bán mạnh",
    duAn: "Masteri An Phú", diaChi: "17 Shophouse", duong: "Xa Lộ Hà Nội",
    quan: "Thủ Đức", tinh: "Hồ Chí Minh", dt: 170, tang: 3,
    gia: 35, donGia: 206, phapLy: "Sổ đỏ/sổ hồng",
    hopDong: "HĐ ký không chính chủ (ĐC2)", dacDiem: "Mặt phố", ngayCN: "24/05/2026",
  },
];
