import type { DiemDen } from './typing';

const STORAGE_KEY = 'diem_den_du_lich';

// Dữ liệu mẫu ban đầu
const danhSachMau: DiemDen.Record[] = [
	{
		id: '1',
		ten: 'Vịnh Hạ Long',
		moTa: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi',
		loaiHinh: 'bien',
		hinhAnh: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
		diaDiem: 'Quảng Ninh',
		rating: 4.8,
		giaVeChung: 500000,
		thoiGianThamQuan: 8,
		chiPhiAnUong: 300000,
		chiPhiLuuTru: 800000,
		chiPhiDiChuyen: 200000,
		danhGiaSoLuong: 1250,
		tienNghi: ['Nhà hàng', 'Khách sạn', 'Tour du thuyền'],
		createdAt: new Date().toISOString(),
	},
	{
		id: '2',
		ten: 'Phố Cổ Hội An',
		moTa: 'Thành phố cổ với kiến trúc độc đáo, đèn lồng rực rỡ',
		loaiHinh: 'thanh-pho',
		hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
		diaDiem: 'Quảng Nam',
		rating: 4.7,
		giaVeChung: 120000,
		thoiGianThamQuan: 6,
		chiPhiAnUong: 200000,
		chiPhiLuuTru: 500000,
		chiPhiDiChuyen: 150000,
		danhGiaSoLuong: 980,
		tienNghi: ['Nhà hàng', 'Homestay', 'Cho thuê xe đạp'],
		createdAt: new Date().toISOString(),
	},
	{
		id: '3',
		ten: 'Sapa',
		moTa: 'Thị trấn miền núi với ruộng bậc thang tuyệt đẹp',
		loaiHinh: 'nui',
		hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
		diaDiem: 'Lào Cai',
		rating: 4.6,
		giaVeChung: 0,
		thoiGianThamQuan: 12,
		chiPhiAnUong: 250000,
		chiPhiLuuTru: 400000,
		chiPhiDiChuyen: 300000,
		danhGiaSoLuong: 756,
		tienNghi: ['Homestay', 'Nhà hàng', 'Trekking tour'],
		createdAt: new Date().toISOString(),
	},
	{
		id: '4',
		ten: 'Nha Trang',
		moTa: 'Thành phố biển với bãi cát trắng và nước biển trong xanh',
		loaiHinh: 'bien',
		hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
		diaDiem: 'Khánh Hòa',
		rating: 4.5,
		giaVeChung: 0,
		thoiGianThamQuan: 10,
		chiPhiAnUong: 350000,
		chiPhiLuuTru: 600000,
		chiPhiDiChuyen: 100000,
		danhGiaSoLuong: 1420,
		tienNghi: ['Resort', 'Nhà hàng hải sản', 'Thể thao nước'],
		createdAt: new Date().toISOString(),
	},
	{
		id: '5',
		ten: 'Đà Lạt',
		moTa: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
		loaiHinh: 'nui',
		hinhAnh: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
		diaDiem: 'Lâm Đồng',
		rating: 4.7,
		giaVeChung: 0,
		thoiGianThamQuan: 8,
		chiPhiAnUong: 200000,
		chiPhiLuuTru: 500000,
		chiPhiDiChuyen: 150000,
		danhGiaSoLuong: 1680,
		tienNghi: ['Khách sạn', 'Nhà hàng', 'Cafe view đẹp'],
		createdAt: new Date().toISOString(),
	},
	{
		id: '6',
		ten: 'Phú Quốc',
		moTa: 'Đảo ngọc với bãi biển đẹp và hải sản tươi ngon',
		loaiHinh: 'bien',
		hinhAnh: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
		diaDiem: 'Kiên Giang',
		rating: 4.6,
		giaVeChung: 0,
		thoiGianThamQuan: 12,
		chiPhiAnUong: 400000,
		chiPhiLuuTru: 1000000,
		chiPhiDiChuyen: 250000,
		danhGiaSoLuong: 890,
		tienNghi: ['Resort 5 sao', 'Nhà hàng', 'Spa', 'Casino'],
		createdAt: new Date().toISOString(),
	},
];

// Khởi tạo dữ liệu nếu chưa có
export const initData = (): DiemDen.Record[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachMau));
		return danhSachMau;
	}
	return JSON.parse(stored);
};

// Lấy tất cả điểm đến
export const getAllDiemDen = (): DiemDen.Record[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : initData();
};

// Lọc và sắp xếp điểm đến
export const filterAndSortDiemDen = (filter?: DiemDen.FilterParams, sort?: DiemDen.SortParams): DiemDen.Record[] => {
	let danhSachKetQua = getAllDiemDen();

	/// Lọc theo loại hình
	if (filter?.loaiHinh && filter.loaiHinh !== 'all') {
		danhSachKetQua = danhSachKetQua.filter((diemDen) => {
			return diemDen.loaiHinh === filter.loaiHinh;
		});
	}

	// Lọc theo khoảng giá tối thiểu
	if (filter?.giaMin !== undefined) {
		danhSachKetQua = danhSachKetQua.filter((diemDen) => {
			return diemDen.giaVeChung >= filter.giaMin!;
		});
	}

	// Lọc theo khoảng giá tối đa
	if (filter?.giaMax !== undefined) {
		danhSachKetQua = danhSachKetQua.filter((diemDen) => {
			return diemDen.giaVeChung <= filter.giaMax!;
		});
	}

	// Lọc theo rating tối thiểu
	if (filter?.ratingMin !== undefined) {
		danhSachKetQua = danhSachKetQua.filter((diemDen) => {
			return diemDen.rating >= filter.ratingMin!;
		});
	}

	// Tìm kiếm theo tên, địa điểm hoặc mô tả
	if (filter?.search) {
		const tuKhoaTimKiem = filter.search.toLowerCase();

		danhSachKetQua = danhSachKetQua.filter((diemDen) => {
			const tenKhopVoi = diemDen.ten.toLowerCase().includes(tuKhoaTimKiem);
			const diaDiemKhopVoi = diemDen.diaDiem.toLowerCase().includes(tuKhoaTimKiem);
			const moTaKhopVoi = diemDen.moTa.toLowerCase().includes(tuKhoaTimKiem);

			return tenKhopVoi || diaDiemKhopVoi || moTaKhopVoi;
		});
	}

	//  Sắp xếp kết quả
	if (sort) {
		danhSachKetQua.sort((diemDenA, diemDenB) => {
			const giaTriA = diemDenA[sort.field];
			const giaTriB = diemDenB[sort.field];

			// Xử lý sắp xếp cho kiểu string (tên)
			if (typeof giaTriA === 'string' && typeof giaTriB === 'string') {
				if (sort.order === 'asc') {
					return giaTriA.localeCompare(giaTriB);
				} else {
					return giaTriB.localeCompare(giaTriA);
				}
			}

			// Xử lý sắp xếp cho kiểu number (rating, giá)
			if (sort.order === 'asc') {
				return (giaTriA as number) - (giaTriB as number);
			} else {
				return (giaTriB as number) - (giaTriA as number);
			}
		});
	}

	return danhSachKetQua;
};

// Lấy điểm đến theo ID
export const getDiemDenById = (id: string): DiemDen.Record | undefined => {
	const data = getAllDiemDen();
	return data.find((item) => item.id === id);
};

// Thêm điểm đến mới
export const addDiemDen = (diemDen: Omit<DiemDen.Record, 'id' | 'createdAt'>): DiemDen.Record => {
	const data = getAllDiemDen();
	const newDiemDen: DiemDen.Record = {
		...diemDen,
		id: Date.now().toString(),
		createdAt: new Date().toISOString(),
	};
	data.push(newDiemDen);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	return newDiemDen;
};

// Cập nhật điểm đến
export const updateDiemDen = (id: string, updates: Partial<DiemDen.Record>): boolean => {
	const data = getAllDiemDen();
	const index = data.findIndex((item) => item.id === id);

	if (index === -1) return false;

	data[index] = {
		...data[index],
		...updates,
		id: data[index].id,
		updatedAt: new Date().toISOString(),
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	return true;
};

// Xóa điểm đến
export const deleteDiemDen = (id: string): boolean => {
	const data = getAllDiemDen();
	const filtered = data.filter((item) => item.id !== id);

	if (filtered.length === data.length) return false;

	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	return true;
};

// Validate dữ liệu điểm đến
export const validateDiemDen = (data: Partial<DiemDen.Record>): string[] => {
	const errors: string[] = [];

	if (!data.ten || data.ten.trim().length === 0) {
		errors.push('Tên điểm đến không được để trống');
	}

	if (!data.loaiHinh) {
		errors.push('Vui lòng chọn loại hình du lịch');
	}

	if (!data.diaDiem || data.diaDiem.trim().length === 0) {
		errors.push('Địa điểm không được để trống');
	}

	if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
		errors.push('Đánh giá phải từ 0 đến 5 sao');
	}

	if (data.giaVeChung !== undefined && data.giaVeChung < 0) {
		errors.push('Giá vé không được âm');
	}

	if (data.thoiGianThamQuan !== undefined && data.thoiGianThamQuan <= 0) {
		errors.push('Thời gian tham quan phải lớn hơn 0');
	}

	return errors;
};
