export declare namespace ThongKe {
	export interface LichTrinhRecord {
		id: string;
		ngayTao: string;
		soNgay: number;
		soDiemDen: number;
		tongChiPhi: number;
		diemDenIds: string[];
	}

	export interface TheoThang {
		thang: string; // Format: YYYY-MM
		soLuong: number;
		tongDoanhThu: number;
	}

	export interface DiemDenPhoBien {
		id: string;
		ten: string;
		diaDiem: string;
		soLuot: number;
	}

	export interface ChiPhiHangMuc {
		giaVe: number;
		anUong: number;
		luuTru: number;
		diChuyen: number;
	}

	export interface TongQuan {
		tongSoLichTrinh: number;
		tongDoanhThu: number;
		trungBinhChiPhi: number;
		lichTrinhThangNay: number;
	}
}

export type { ThongKe };
