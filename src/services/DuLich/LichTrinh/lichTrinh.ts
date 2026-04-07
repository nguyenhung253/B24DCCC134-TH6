import type { LichTrinhType } from './typing';
export const tinhToanThongKe = (lichTrinh: LichTrinhType.Ngay[]): LichTrinhType.ThongKe => {
  let tongChiPhi = 0;
  let tongThoiGian = 0;
  let soDiemDen = 0;

  lichTrinh.forEach((ngayLT) => {
    ngayLT.danhSach.forEach((item) => {
      tongChiPhi +=
        (item.giaVeChung || 0) +
        (item.chiPhiAnUong || 0) +
        (item.chiPhiLuuTru || 0) +
        (item.chiPhiDiChuyen || 0);

      tongThoiGian += (item.thoiGianThamQuan || 0) + 1;
      soDiemDen += 1;
    });
  });

  if (soDiemDen > 0) tongThoiGian -= 1;

  return { tongChiPhi, tongThoiGian, soDiemDen };
};