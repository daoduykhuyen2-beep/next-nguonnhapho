// Chuẩn hoá nhãn loại BĐS — xử lý cả "du-an" và "du_an"
const LOAI_LABEL: Record<string, string> = {
    "nha-ban": "Nhà bán",
    "nha_ban": "Nhà bán",
    "ban": "Nhà bán",
    "thue": "Nhà cho thuê",
    "cho-thue": "Nhà cho thuê",
    "cho_thue": "Nhà cho thuê",
    "du-an": "Dự án",
    "du_an": "Dự án",
    "can-ho": "Căn hộ / Chung cư",
    "can_ho": "Căn hộ / Chung cư",
    "dat-nen": "Đất nền",
    "dat_nen": "Đất nền",
};

export function nhanLoai(loai?: string | null): string {
    if (!loai) return "Nhà bán";
    const key = String(loai).trim().toLowerCase();
    return LOAI_LABEL[key] ?? LOAI_LABEL[key.replace(/_/g, "-")] ?? "Nhà bán";
}
