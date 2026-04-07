import { useState } from 'react';
import {
	getAllDiemDen,
	filterAndSortDiemDen,
	getDiemDenById,
	addDiemDen,
	updateDiemDen,
	deleteDiemDen,
	initData,
	validateDiemDen,
} from '@/services/DuLich/DiemDen';
import type { DiemDen } from '@/services/DuLich/DiemDen/typing';
import { message } from 'antd';

export default () => {
	const [danhSach, setDanhSach] = useState<DiemDen.Record[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<DiemDen.FilterParams>({
		loaiHinh: 'all',
	});
	const [sort, setSort] = useState<DiemDen.SortParams>({
		field: 'rating',
		order: 'desc',
	});
	const [selectedItem, setSelectedItem] = useState<DiemDen.Record | undefined>();
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	// Lấy danh sách điểm đến
	const fetchDanhSach = () => {
		setLoading(true);
		try {
			const data = filterAndSortDiemDen(filter, sort);
			setDanhSach(data);
		} catch (error) {
			message.error('Có lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	// Khởi tạo dữ liệu
	const init = () => {
		setLoading(true);
		try {
			const data = initData();
			setDanhSach(data);
		} catch (error) {
			message.error('Có lỗi khi khởi tạo dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	// Thêm điểm đến
	const themDiemDen = (data: Omit<DiemDen.Record, 'id' | 'createdAt'>) => {
		const errors = validateDiemDen(data);
		if (errors.length > 0) {
			message.error(errors[0]);
			return false;
		}

		try {
			addDiemDen(data);
			message.success('Thêm điểm đến thành công');
			fetchDanhSach();
			return true;
		} catch (error) {
			message.error('Có lỗi khi thêm điểm đến');
			return false;
		}
	};

	// Cập nhật điểm đến
	const capNhatDiemDen = (id: string, data: Partial<DiemDen.Record>) => {
		const errors = validateDiemDen(data);
		if (errors.length > 0) {
			message.error(errors[0]);
			return false;
		}

		try {
			const success = updateDiemDen(id, data);
			if (success) {
				message.success('Cập nhật điểm đến thành công');
				fetchDanhSach();
				return true;
			} else {
				message.error('Không tìm thấy điểm đến');
				return false;
			}
		} catch (error) {
			message.error('Có lỗi khi cập nhật điểm đến');
			return false;
		}
	};

	// Xóa điểm đến
	const xoaDiemDen = (id: string) => {
		try {
			const success = deleteDiemDen(id);
			if (success) {
				message.success('Xóa điểm đến thành công');
				fetchDanhSach();
				return true;
			} else {
				message.error('Không tìm thấy điểm đến');
				return false;
			}
		} catch (error) {
			message.error('Có lỗi khi xóa điểm đến');
			return false;
		}
	};

	// Lấy chi tiết điểm đến
	const getChiTiet = (id: string) => {
		const item = getDiemDenById(id);
		setSelectedItem(item);
		return item;
	};

	// Cập nhật filter
	const updateFilter = (newFilter: Partial<DiemDen.FilterParams>) => {
		setFilter((prev) => ({ ...prev, ...newFilter }));
	};

	// Cập nhật sort
	const updateSort = (newSort: DiemDen.SortParams) => {
		setSort(newSort);
	};

	// Reset filter
	const resetFilter = () => {
		setFilter({ loaiHinh: 'all' });
		setSort({ field: 'rating', order: 'desc' });
	};

	return {
		danhSach,
		loading,
		filter,
		sort,
		selectedItem,
		modalVisible,
		setModalVisible,
		setSelectedItem,
		fetchDanhSach,
		init,
		themDiemDen,
		capNhatDiemDen,
		xoaDiemDen,
		getChiTiet,
		updateFilter,
		updateSort,
		resetFilter,
	};
};
