// Du lieu Du an & Chung cu.
// Toan bo tin BDS TP.HCM (3.609 tin) duoc luu trong lib/duAnHcm.json
// va nap truc tiep trong app/du-an/page.tsx.

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
  dtsd?: number;
  tang: number;
  ngang?: number;
  dai?: number;
  gia: number;
  donGia: number;
  phapLy: string;
  hopDong: string;
  dacDiem: string;
  ngayCN: string;
  anh?: string;
};

// Giu lai mang rong de tuong thich cac import cu. Nguon du lieu chinh
// hien la lib/duAnHcm.json (nap trong page.tsx).
export const DU_AN_ITEMS: DuAnItem[] = [];
