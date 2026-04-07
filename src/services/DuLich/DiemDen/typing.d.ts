export declare namespace DiemDen {
	export interface Record {
		id: string;
		ten: string;
		moTa: string;
		loaiHinh: 'bien' | 'nui' | 'thanh-pho';
		hinhAnh: string;
		diaDiem: string;
		rating: number;
		giaVeChung: number;
		thoiGianThamQuan: number; // số giờ
		chiPhiAnUong: number;
		chiPhiLuuTru: number;
		chiPhiDiChuyen: number;
		danhGiaSoLuong: number;
		moTaChiTiet?: string;
		tienNghi?: string[];
		thoiGianMoCua?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface FilterParams {
		loaiHinh?: 'bien' | 'nui' | 'thanh-pho' | 'all';
		giaMin?: number;
		giaMax?: number;
		ratingMin?: number;
		search?: string;
	}

	export interface SortParams {
		field: 'rating' | 'giaVeChung' | 'ten' | 'createdAt';
		order: 'asc' | 'desc';
	}
}

export type { DiemDen };
