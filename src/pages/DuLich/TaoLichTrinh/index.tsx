import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import {
	Card,
	Button,
	Select,
	Row,
	Col,
	Typography,
	List,
	Space,
	Popconfirm,
	Statistic,
	Divider,
	Tag,
	message,
} from 'antd';
import {
	DeleteOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	EnvironmentOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;
const { Option } = Select;

const TaoLichTrinh: React.FC = () => {
	// Lấy dữ liệu danh sách điểm đến từ Model gốc
	const { danhSach: danhSachDiemDen, fetchDanhSach } = useModel('dulich.diemDen');

	// Lấy State và Actions từ Model Lịch Trình
	const { lichTrinh, thongKe, themNgay, xoaNgay, themVaoLichTrinh, xoaKhoiLichTrinh, thayDoiThuTu, luuLichTrinh } =
		useModel('dulich.lichTrinh');

	// State local (cục bộ) chỉ dùng để quản lý trạng thái của Form thêm mới
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [selectedDiemDen, setSelectedDiemDen] = useState<string | undefined>();

	useEffect(() => {
		fetchDanhSach();
	}, []);

	// Xử lý sự kiện UI
	const handleXoaNgay = () => {
		const isSuccess = xoaNgay();
		if (isSuccess && selectedDay === lichTrinh.length) {
			setSelectedDay(lichTrinh.length - 1);
		}
	};

	const handleThemVaoLichTrinh = () => {
		if (!selectedDiemDen) {
			message.warning('Vui lòng chọn một điểm đến!');
			return;
		}
		const diemDen = danhSachDiemDen.find((d) => d.id === selectedDiemDen);
		if (diemDen) {
			themVaoLichTrinh(selectedDay, diemDen);
			setSelectedDiemDen(undefined); // Xóa trắng ô select sau khi thêm thành công
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Tạo Lịch Trình Du Lịch</h1>
				<p>Lên kế hoạch chi tiết cho chuyến đi của bạn</p>
			</div>

			<Row gutter={[24, 24]}>
				{/* CỘT TRÁI: FORM CHỨC NĂNG */}
				<Col xs={24} lg={8}>
					<Card title='Thêm điểm đến vào lịch trình' className={styles.cardShadow}>
						<div className={styles.formGroup}>
							<Text strong>Chọn ngày:</Text>
							<Select value={selectedDay} onChange={setSelectedDay} style={{ width: '100%', marginTop: 8 }}>
								{lichTrinh.map((ngay) => (
									<Option key={ngay.ngay} value={ngay.ngay}>
										Ngày {ngay.ngay}
									</Option>
								))}
							</Select>
						</div>

						<div className={styles.formGroup} style={{ marginTop: 16 }}>
							<Text strong>Chọn điểm đến:</Text>
							<Select
								showSearch
								placeholder='Tìm và chọn điểm đến...'
								value={selectedDiemDen}
								onChange={setSelectedDiemDen}
								style={{ width: '100%', marginTop: 8 }}
								optionFilterProp='children'
							>
								{danhSachDiemDen.map((item) => (
									<Option key={item.id} value={item.id}>
										{item.ten} - {item.diaDiem}
									</Option>
								))}
							</Select>
						</div>

						<Button type='primary' block onClick={handleThemVaoLichTrinh} style={{ marginTop: 24 }}>
							Thêm vào Ngày {selectedDay}
						</Button>

						<Divider />

						<Space direction='vertical' style={{ width: '100%' }}>
							<Button onClick={themNgay} block>
								+ Thêm ngày mới
							</Button>
							<Popconfirm title='Bạn có chắc chắn muốn xóa ngày cuối cùng?' onConfirm={handleXoaNgay}>
								<Button danger block disabled={lichTrinh.length <= 1}>
									Xóa ngày cuối
								</Button>
							</Popconfirm>
						</Space>
					</Card>

					<Card title='Tổng quan lịch trình' className={styles.cardShadow} style={{ marginTop: 24 }}>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<Statistic
									title='Tổng ngân sách'
									value={formatCurrency(thongKe.tongChiPhi)}
									valueStyle={{ color: '#cf1322', fontSize: '18px' }}
								/>
							</Col>
							<Col span={12}>
								<Statistic
									title='Tổng thời gian'
									value={`${thongKe.tongThoiGian} giờ`}
									valueStyle={{ color: '#1890ff', fontSize: '18px' }}
								/>
							</Col>
							<Col span={12}>
								<Statistic title='Điểm đến' value={thongKe.soDiemDen} valueStyle={{ fontSize: '18px' }} />
							</Col>
							<Col span={12}>
								<Statistic title='Số ngày' value={lichTrinh.length} valueStyle={{ fontSize: '18px' }} />
							</Col>
						</Row>
						<Divider />
						<Button type='primary' icon={<SaveOutlined />} block onClick={luuLichTrinh}>
							Lưu lịch trình
						</Button>
					</Card>
				</Col>

				{/* CỘT PHẢI: HIỂN THỊ LỊCH TRÌNH */}
				<Col xs={24} lg={16}>
					{lichTrinh.map((ngayLT) => (
						<Card key={ngayLT.ngay} title={`Ngày ${ngayLT.ngay}`} className={styles.dayCard}>
							<List
								locale={{ emptyText: 'Chưa có điểm đến nào trong ngày này' }}
								itemLayout='horizontal'
								dataSource={ngayLT.danhSach}
								renderItem={(item, index) => (
									<List.Item
										className={styles.listItem}
										actions={[
											<Button
												type='text'
												icon={<ArrowUpOutlined />}
												onClick={() => thayDoiThuTu(ngayLT.ngay, index, 'up')}
												disabled={index === 0}
											/>,
											<Button
												type='text'
												icon={<ArrowDownOutlined />}
												onClick={() => thayDoiThuTu(ngayLT.ngay, index, 'down')}
												disabled={index === ngayLT.danhSach.length - 1}
											/>,
											<Popconfirm
												title='Xóa điểm đến này?'
												onConfirm={() => xoaKhoiLichTrinh(ngayLT.ngay, item.idLichTrinh)}
											>
												<Button type='text' danger icon={<DeleteOutlined />} />
											</Popconfirm>,
										]}
									>
										<List.Item.Meta
											avatar={<img src={item.hinhAnh} alt={item.ten} className={styles.itemImage} />}
											title={
												<Space>
													<Text strong>{item.ten}</Text>
													<Tag color='blue'>{item.diaDiem}</Tag>
												</Space>
											}
											description={
												<Space direction='vertical' size={0}>
													<Text type='secondary' className={styles.itemDesc}>
														<EnvironmentOutlined /> {item.moTa}
													</Text>
													<Space split={<Divider type='vertical' />}>
														<Text>
															<ClockCircleOutlined /> Tham quan: {item.thoiGianThamQuan}h
														</Text>
														<Text>
															<DollarOutlined />{' '}
															{item.giaVeChung === 0 ? 'Miễn phí vé' : formatCurrency(item.giaVeChung)}
														</Text>
													</Space>
												</Space>
											}
										/>
									</List.Item>
								)}
							/>
						</Card>
					))}
				</Col>
			</Row>
		</div>
	);
};

export default TaoLichTrinh;
