import type { ThongKe } from './typing';

const STORAGE_KEY_LICH_TRINH = 'lich_trinh_du_lich';
const STORAGE_KEY_THONG_KE = 'thong_ke_lich_trinh';

export const getLichTrinhData = (): any[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY_LICH_TRINH);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

export const saveThongKeLichTrinh = (lichTrinh: any) => {
	try {
		const existing = getThongKeLichTrinh();
		const newRecord: ThongKe.LichTrinhRecord = {
			id: Date.now().toString(),
			ngayTao: new Date().toISOString(),
			soNgay: lichTrinh.length,
			soDiemDen: lichTrinh.reduce((sum: number, ngay: any) => sum + ngay.danhSach.length, 0),
			tongChiPhi: lichTrinh.reduce((sum: number, ngay: any) => {
				return (
					sum +
					ngay.danhSach.reduce((daySum: number, item: any) => {
						return (
							daySum +
							(item.giaVeChung || 0) +
							(item.chiPhiAnUong || 0) +
							(item.chiPhiLuuTru || 0) +
							(item.chiPhiDiChuyen || 0)
						);
					}, 0)
				);
			}, 0),
			diemDenIds: lichTrinh.flatMap((ngay: any) => ngay.danhSach.map((item: any) => item.id)),
		};
		existing.push(newRecord);
		localStorage.setItem(STORAGE_KEY_THONG_KE, JSON.stringify(existing));
		return true;
	} catch {
		return false;
	}
};

export const getThongKeLichTrinh = (): ThongKe.LichTrinhRecord[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY_THONG_KE);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

// Thống kê theo tháng
export const getThongKeTheoThang = (): ThongKe.TheoThang[] => {
	const records = getThongKeLichTrinh();
	const thangMap: Record<string, ThongKe.TheoThang> = {};

	records.forEach((record) => {
		const date = new Date(record.ngayTao);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

		if (!thangMap[key]) {
			thangMap[key] = {
				thang: key,
				soLuong: 0,
				tongDoanhThu: 0,
			};
		}

		thangMap[key].soLuong += 1;
		thangMap[key].tongDoanhThu += record.tongChiPhi;
	});

	return Object.values(thangMap).sort((a, b) => a.thang.localeCompare(b.thang));
};

// Thống kê điểm đến phổ biến
export const getDiemDenPhoBien = (): ThongKe.DiemDenPhoBien[] => {
	const records = getThongKeLichTrinh();
	const countMap: Record<string, number> = {};

	records.forEach((record) => {
		record.diemDenIds.forEach((id) => {
			countMap[id] = (countMap[id] || 0) + 1;
		});
	});

	const diemDenData = localStorage.getItem('diem_den_du_lich');
	const danhSachDiemDen = diemDenData ? JSON.parse(diemDenData) : [];

	const result: ThongKe.DiemDenPhoBien[] = Object.entries(countMap).map(([id, soLuot]) => {
		const diemDen = danhSachDiemDen.find((d: any) => d.id === id);
		return {
			id,
			ten: diemDen?.ten || 'Không xác định',
			diaDiem: diemDen?.diaDiem || '',
			soLuot,
		};
	});

	return result.sort((a, b) => b.soLuot - a.soLuot);
};

// Thống kê chi phí theo hạng mục
export const getThongKeChiPhiTheoHangMuc = (): ThongKe.ChiPhiHangMuc => {
	const records = getThongKeLichTrinh();
	const result: ThongKe.ChiPhiHangMuc = {
		giaVe: 0,
		anUong: 0,
		luuTru: 0,
		diChuyen: 0,
	};

	const diemDenData = localStorage.getItem('diem_den_du_lich');
	const danhSachDiemDen = diemDenData ? JSON.parse(diemDenData) : [];

	records.forEach((record) => {
		record.diemDenIds.forEach((id) => {
			const diemDen = danhSachDiemDen.find((d: any) => d.id === id);
			if (diemDen) {
				result.giaVe += diemDen.giaVeChung || 0;
				result.anUong += diemDen.chiPhiAnUong || 0;
				result.luuTru += diemDen.chiPhiLuuTru || 0;
				result.diChuyen += diemDen.chiPhiDiChuyen || 0;
			}
		});
	});

	return result;
};

export const getTongQuanThongKe = (): ThongKe.TongQuan => {
	const records = getThongKeLichTrinh();
	const tongSoLichTrinh = records.length;
	const tongDoanhThu = records.reduce((sum, r) => sum + r.tongChiPhi, 0);
	const trungBinhChiPhi = tongSoLichTrinh > 0 ? tongDoanhThu / tongSoLichTrinh : 0;

	const now = new Date();
	const thangHienTai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	const lichTrinhThangNay = records.filter((r) => {
		const date = new Date(r.ngayTao);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		return key === thangHienTai;
	});

	return {
		tongSoLichTrinh,
		tongDoanhThu,
		trungBinhChiPhi,
		lichTrinhThangNay: lichTrinhThangNay.length,
	};
};
