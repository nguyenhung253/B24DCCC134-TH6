import { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { tinhToanThongKe } from '@/services/DuLich/LichTrinh/lichTrinh';
import { saveThongKeLichTrinh } from '@/services/DuLich/ThongKe';
import type { LichTrinhType } from '@/services/DuLich/LichTrinh/typing';

const STORAGE_KEY = 'lichTrinh';

const saveLichTrinh = (data: LichTrinhType.Ngay[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadLichTrinh = (): LichTrinhType.Ngay[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch (error) {
			console.error('Lỗi khi đọc lịch trình:', error);
		}
	}
	return [{ ngay: 1, danhSach: [] }];
};

export default () => {
	const [lichTrinh, setLichTrinh] = useState<LichTrinhType.Ngay[]>(loadLichTrinh);

	useEffect(() => {
		saveLichTrinh(lichTrinh);
	}, [lichTrinh]);

	const themNgay = () => {
		const newLichTrinh = [...lichTrinh, { ngay: lichTrinh.length + 1, danhSach: [] }];
		setLichTrinh(newLichTrinh);
		message.success(`Đã thêm Ngày ${lichTrinh.length + 1}`);
	};

	const xoaNgay = () => {
		if (lichTrinh.length > 1) {
			const newLichTrinh = lichTrinh.slice(0, -1);
			setLichTrinh(newLichTrinh);
			message.success('Đã xóa ngày cuối cùng');
			return true;
		}
		message.warning('Phải có ít nhất 1 ngày trong lịch trình');
		return false;
	};

	const themVaoLichTrinh = (ngay: number, diemDen: DiemDen.Record) => {
		const newItem: LichTrinhType.Item = {
			...diemDen,
			idLichTrinh: `${diemDen.id}-${Date.now()}`,
		};

		const newLichTrinh = lichTrinh.map((ngayLT) => {
			if (ngayLT.ngay === ngay) {
				return { ...ngayLT, danhSach: [...ngayLT.danhSach, newItem] };
			}
			return ngayLT;
		});

		setLichTrinh(newLichTrinh);
		message.success(`Đã thêm ${diemDen.ten} vào Ngày ${ngay}`);
	};

	const xoaKhoiLichTrinh = (ngay: number, idLichTrinh: string) => {
		const newLichTrinh = lichTrinh.map((ngayLT) => {
			if (ngayLT.ngay === ngay) {
				return {
					...ngayLT,
					danhSach: ngayLT.danhSach.filter((item) => item.idLichTrinh !== idLichTrinh),
				};
			}
			return ngayLT;
		});
		setLichTrinh(newLichTrinh);
		message.success('Đã xóa điểm đến khỏi lịch trình');
	};

	const thayDoiThuTu = (ngay: number, index: number, direction: 'up' | 'down') => {
		const newLichTrinh = [...lichTrinh];
		const ngayIndex = newLichTrinh.findIndex((n) => n.ngay === ngay);
		const list = [...newLichTrinh[ngayIndex].danhSach];

		if (direction === 'up' && index > 0) {
			[list[index - 1], list[index]] = [list[index], list[index - 1]];
		} else if (direction === 'down' && index < list.length - 1) {
			[list[index + 1], list[index]] = [list[index], list[index + 1]];
		}

		newLichTrinh[ngayIndex].danhSach = list;
		setLichTrinh(newLichTrinh);
	};

	const resetLichTrinh = () => {
		const defaultLichTrinh = [{ ngay: 1, danhSach: [] }];
		setLichTrinh(defaultLichTrinh);
		message.success('Đã reset lịch trình');
	};

	const luuLichTrinh = () => {
		if (lichTrinh.length === 0 || lichTrinh.every((ngay) => ngay.danhSach.length === 0)) {
			message.warning('Lịch trình trống, không thể lưu');
			return false;
		}
		const success = saveThongKeLichTrinh(lichTrinh);
		if (success) {
			message.success('Đã lưu lịch trình và cập nhật thống kê');
			return true;
		} else {
			message.error('Lưu lịch trình thất bại');
			return false;
		}
	};

	const thongKe = useMemo(() => tinhToanThongKe(lichTrinh), [lichTrinh]);

	return {
		lichTrinh,
		thongKe,
		themNgay,
		xoaNgay,
		themVaoLichTrinh,
		xoaKhoiLichTrinh,
		thayDoiThuTu,
		resetLichTrinh,
		luuLichTrinh,
	};
};
