import { useState, useEffect } from 'react';
import { layLichTrinh, DuLieuBieuDo } from '@/services/DuLich/nganSach';

const STORAGE_KEY_BUDGET = 'ngan_sach_du_kien';

export default () => {
	const [duLieuBieuDo, setDuLieuBieuDo] = useState<DuLieuBieuDo[]>([
		{ loai: 'Ăn uống', giaTri: 0 },
		{ loai: 'Lưu trú', giaTri: 0 },
		{ loai: 'Di chuyển', giaTri: 0 },
		{ loai: 'Vé vào cổng', giaTri: 0 },
	]);
	const [tongChiPhi, setTongChiPhi] = useState<number>(0);

	const loadNganSachDuKien = () => {
		const stored = localStorage.getItem(STORAGE_KEY_BUDGET);
		return stored ? parseInt(stored, 10) : 5000000;
	};

	const [nganSachDuKien, setNganSachDuKienState] = useState<number>(loadNganSachDuKien);

	const setNganSachDuKien = (value: number) => {
		setNganSachDuKienState(value);
		localStorage.setItem(STORAGE_KEY_BUDGET, value.toString());
	};

	const tinhChiPhi = () => {
		const lichTrinh = layLichTrinh();

		let chiPhiAnUong = 0;
		let chiPhiLuuTru = 0;
		let chiPhiDiChuyen = 0;
		let giaVeChung = 0;

		lichTrinh.forEach((ngay) => {
			ngay.danhSach.forEach((diaDiem) => {
				chiPhiAnUong += diaDiem.chiPhiAnUong || 0;
				chiPhiLuuTru += diaDiem.chiPhiLuuTru || 0;
				chiPhiDiChuyen += diaDiem.chiPhiDiChuyen || 0;
				giaVeChung += diaDiem.giaVeChung || 0;
			});
		});

		const tong = chiPhiAnUong + chiPhiLuuTru + chiPhiDiChuyen + giaVeChung;

		setTongChiPhi(tong);

		setDuLieuBieuDo([
			{ loai: 'Ăn uống', giaTri: chiPhiAnUong },
			{ loai: 'Lưu trú', giaTri: chiPhiLuuTru },
			{ loai: 'Di chuyển', giaTri: chiPhiDiChuyen },
			{ loai: 'Vé vào cổng', giaTri: giaVeChung },
		]);
	};

	useEffect(() => {
		tinhChiPhi();
	}, []);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'lichTrinh') {
				tinhChiPhi();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		const interval = setInterval(() => {
			tinhChiPhi();
		}, 1000);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			clearInterval(interval);
		};
	}, []);

	return {
		duLieuBieuDo,
		tongChiPhi,
		nganSachDuKien,
		setNganSachDuKien,
		tinhChiPhi,
	};
};
