import type { Metadata } from "next";
import DuAnClient from "./DuAnClient";

export const metadata: Metadata = {
  title: "Dự án & Chung cư đang bán | Nguồn Nhà Phố HCM",
  description:
    "Danh sách dự án và căn hộ chung cư đang bán tại TP.HCM và khu vực lân cận — tìm kiếm theo tên dự án, khu vực và mức giá.",
};

export default function DuAnPage() {
  return <DuAnClient />;
}
