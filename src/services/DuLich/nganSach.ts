// src/services/nganSach.ts

export interface DiaDiem {
	chiPhiAnUong?: number;
	chiPhiLuuTru?: number;
	chiPhiDiChuyen?: number;
	giaVeChung?: number;
}

export interface NgayLichTrinh {
	danhSach: DiaDiem[];
}

export interface DuLieuBieuDo {
	loai: string;
	giaTri: number;
}

export const layLichTrinh = (): NgayLichTrinh[] => {
	const duLieuLuu = localStorage.getItem('lichTrinh');
	if (!duLieuLuu) return [];
	return JSON.parse(duLieuLuu);
};
