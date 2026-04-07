import { useState, useEffect } from 'react';
import {
	getThongKeTheoThang,
	getDiemDenPhoBien,
	getThongKeChiPhiTheoHangMuc,
	getTongQuanThongKe,
} from '@/services/DuLich/ThongKe';
import type { ThongKe } from '@/services/DuLich/ThongKe/typing';

export default () => {
	const [thongKeThang, setThongKeThang] = useState<ThongKe.TheoThang[]>([]);
	const [diemDenPhoBien, setDiemDenPhoBien] = useState<ThongKe.DiemDenPhoBien[]>([]);
	const [chiPhiHangMuc, setChiPhiHangMuc] = useState<ThongKe.ChiPhiHangMuc>({
		giaVe: 0,
		anUong: 0,
		luuTru: 0,
		diChuyen: 0,
	});
	const [tongQuan, setTongQuan] = useState<ThongKe.TongQuan>({
		tongSoLichTrinh: 0,
		tongDoanhThu: 0,
		trungBinhChiPhi: 0,
		lichTrinhThangNay: 0,
	});
	const [loading, setLoading] = useState<boolean>(false);

	const fetchThongKe = () => {
		setLoading(true);
		try {
			setThongKeThang(getThongKeTheoThang());
			setDiemDenPhoBien(getDiemDenPhoBien());
			setChiPhiHangMuc(getThongKeChiPhiTheoHangMuc());
			setTongQuan(getTongQuanThongKe());
		} catch (error) {
			console.error('Error fetching statistics:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchThongKe();
	}, []);

	return {
		thongKeThang,
		diemDenPhoBien,
		chiPhiHangMuc,
		tongQuan,
		loading,
		fetchThongKe,
	};
};
