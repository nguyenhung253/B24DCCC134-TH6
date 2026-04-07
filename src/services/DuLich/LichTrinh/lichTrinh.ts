import type { LichTrinhType } from './typing';

export const tinhToanThongKe = (lichTrinh: LichTrinhType.Ngay[]): LichTrinhType.ThongKe => {
	let tongChiPhi = 0;
	let tongThoiGian = 0;
	let soDiemDen = 0;

	lichTrinh.forEach((ngayLT) => {
		ngayLT.danhSach.forEach((item) => {
			// Tính tổng chi phí từ tất cả các hạng mục
			tongChiPhi +=
				(item.giaVeChung || 0) + (item.chiPhiAnUong || 0) + (item.chiPhiLuuTru || 0) + (item.chiPhiDiChuyen || 0);

			// Tính tổng thời gian tham quan (đơn giản cộng dồn)
			tongThoiGian += item.thoiGianThamQuan || 0;

			soDiemDen += 1;
		});
	});

	return { tongChiPhi, tongThoiGian, soDiemDen };
};
