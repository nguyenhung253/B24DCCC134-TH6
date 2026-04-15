import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Table, Button, Space, Popconfirm, message, Tag, Rate, Image, Tooltip, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DiemDen } from '@/services/DuLich/DiemDen/typing';
import FormDiemDen from './components/FormDiemDen';
import styles from './index.less';

const { Option } = Select;

const QuanTriDiemDen: React.FC = () => {
	const { danhSach, loading, fetchDanhSach, init, deleteDiemDen } = useModel('dulich.diemDen');
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<DiemDen.Record | undefined>();
	const [searchText, setSearchText] = useState<string>('');
	const [filterLoaiHinh, setFilterLoaiHinh] = useState<string>('all');

	useEffect(() => {
		init();
		fetchDanhSach();
	}, []);

	const handleAdd = () => {
		setEditingRecord(undefined);
		setModalVisible(true);
	};

	const handleEdit = (record: DiemDen.Record) => {
		setEditingRecord(record);
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		const success = await deleteDiemDen(id);
		if (success) {
			message.success('Xóa điểm đến thành công');
			fetchDanhSach();
		} else {
			message.error('Xóa điểm đến thất bại');
		}
	};

	const handleModalClose = (refresh?: boolean) => {
		setModalVisible(false);
		setEditingRecord(undefined);
		if (refresh) {
			fetchDanhSach();
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(value);
	};

	const getLoaiHinhTag = (loaiHinh: string) => {
		const colors: Record<string, string> = {
			bien: 'blue',
			nui: 'green',
			'thanh-pho': 'orange',
		};
		const labels: Record<string, string> = {
			bien: 'Biển',
			nui: 'Núi',
			'thanh-pho': 'Thành phố',
		};
		return <Tag color={colors[loaiHinh]}>{labels[loaiHinh]}</Tag>;
	};

	// Filter data
	const filteredData = danhSach.filter((item) => {
		const matchSearch =
			searchText === '' ||
			item.ten.toLowerCase().includes(searchText.toLowerCase()) ||
			item.diaDiem.toLowerCase().includes(searchText.toLowerCase());
		const matchLoaiHinh = filterLoaiHinh === 'all' || item.loaiHinh === filterLoaiHinh;
		return matchSearch && matchLoaiHinh;
	});

	const columns: ColumnsType<DiemDen.Record> = [
		{
			title: 'Hình ảnh',
			dataIndex: 'hinhAnh',
			key: 'hinhAnh',
			width: 100,
			render: (url: string) => (
				<Image src={url} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'ten',
			key: 'ten',
			width: 200,
			sorter: (a, b) => a.ten.localeCompare(b.ten),
		},
		{
			title: 'Địa điểm',
			dataIndex: 'diaDiem',
			key: 'diaDiem',
			width: 150,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			key: 'loaiHinh',
			width: 120,
			render: (loaiHinh: string) => getLoaiHinhTag(loaiHinh),
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			width: 150,
			sorter: (a, b) => a.rating - b.rating,
			render: (rating: number, record) => (
				<Space direction='vertical' size={0}>
					<Rate disabled value={rating} style={{ fontSize: 14 }} />
					<span style={{ fontSize: 12, color: '#999' }}>({record.danhGiaSoLuang} đánh giá)</span>
				</Space>
			),
		},
		{
			title: 'Giá vé',
			dataIndex: 'giaVeChung',
			key: 'giaVeChung',
			width: 120,
			sorter: (a, b) => a.giaVeChung - b.giaVeChung,
			render: (value: number) => (value === 0 ? <Tag>Miễn phí</Tag> : formatCurrency(value)),
		},
		{
			title: 'Thời gian',
			dataIndex: 'thoiGianThamQuan',
			key: 'thoiGianThamQuan',
			width: 100,
			render: (value: number) => `${value}h`,
		},
		{
			title: 'Chi phí ăn uống',
			dataIndex: 'chiPhiAnUong',
			key: 'chiPhiAnUong',
			width: 130,
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Chi phí lưu trú',
			dataIndex: 'chiPhiLuuTru',
			key: 'chiPhiLuuTru',
			width: 130,
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Chi phí di chuyển',
			dataIndex: 'chiPhiDiChuyen',
			key: 'chiPhiDiChuyen',
			width: 140,
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Thao tác',
			key: 'action',
			fixed: 'right',
			width: 120,
			render: (_, record) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa điểm đến này?'
							onConfirm={() => handleDelete(record.id)}
							okText='Xóa'
							cancelText='Hủy'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div className={styles.container}>
			<Card
				title='Quản trị điểm đến'
				extra={
					<Space>
						<Input
							placeholder='Tìm kiếm tên, địa điểm...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 250 }}
							allowClear
						/>
						<Select value={filterLoaiHinh} onChange={setFilterLoaiHinh} style={{ width: 150 }}>
							<Option value='all'>Tất cả loại hình</Option>
							<Option value='bien'>Biển</Option>
							<Option value='nui'>Núi</Option>
							<Option value='thanh-pho'>Thành phố</Option>
						</Select>
						<Button icon={<ReloadOutlined />} onClick={fetchDanhSach}>
							Làm mới
						</Button>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
							Thêm điểm đến
						</Button>
					</Space>
				}
			>
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey='id'
					loading={loading}
					scroll={{ x: 1500 }}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showTotal: (total) => `Tổng ${total} điểm đến`,
					}}
				/>
			</Card>

			<FormDiemDen visible={modalVisible} record={editingRecord} onClose={handleModalClose} />
		</div>
	);
};

export default QuanTriDiemDen;
