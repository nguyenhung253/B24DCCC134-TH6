import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Rate, Tag, Select, Input, Slider, Button, Space, Empty, Spin } from 'antd';
import {
	EnvironmentOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	SearchOutlined,
	FilterOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import type { DiemDen } from '@/services/DuLich/DiemDen/typing';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Meta } = Card;

const KhamPhaDiemDen: React.FC = () => {
	const model = useModel('dulich.diemDen');

	if (!model) {
		return <div>Loading model...</div>;
	}

	const { danhSach, loading, filter, sort, fetchDanhSach, init, updateFilter, updateSort, resetFilter } = model;

	const [giaRange, setGiaRange] = useState<[number, number]>([0, 2000000]);
	const [showFilter, setShowFilter] = useState<boolean>(false);

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		fetchDanhSach();
	}, [filter, sort]);

	const handleLoaiHinhChange = (value: string) => {
		updateFilter({ loaiHinh: value as any });
	};

	const handleSearch = (value: string) => {
		updateFilter({ search: value });
	};

	const handleGiaRangeChange = (value: [number, number]) => {
		setGiaRange(value);
	};

	const handleGiaRangeAfterChange = (value: [number, number]) => {
		updateFilter({ giaMin: value[0], giaMax: value[1] });
	};

	const handleRatingChange = (value: number) => {
		updateFilter({ ratingMin: value });
	};

	const handleSortChange = (value: string) => {
		const [field, order] = value.split('-');
		updateSort({ field: field as any, order: order as any });
	};

	const handleReset = () => {
		resetFilter();
		setGiaRange([0, 2000000]);
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(value);
	};

	const getLoaiHinhTag = (loaiHinh: string) => {
		const config = {
			bien: { color: 'blue', text: 'Biển' },
			nui: { color: 'green', text: 'Núi' },
			'thanh-pho': { color: 'orange', text: 'Thành phố' },
		};
		const item = config[loaiHinh as keyof typeof config];
		return <Tag color={item.color}>{item.text}</Tag>;
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Khám Phá Điểm Đến</h1>
				<p>Tìm kiếm và lên kế hoạch cho chuyến du lịch của bạn</p>
			</div>

			<Card className={styles.filterCard}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} sm={24} md={8} lg={8}>
						<Search
							placeholder='Tìm kiếm điểm đến...'
							allowClear
							enterButton={<SearchOutlined />}
							size='large'
							onSearch={handleSearch}
						/>
					</Col>

					<Col xs={12} sm={12} md={4} lg={4}>
						<Select
							style={{ width: '100%' }}
							placeholder='Loại hình'
							size='large'
							value={filter.loaiHinh}
							onChange={handleLoaiHinhChange}
						>
							<Option value='all'>Tất cả</Option>
							<Option value='bien'>Biển</Option>
							<Option value='nui'>Núi</Option>
							<Option value='thanh-pho'>Thành phố</Option>
						</Select>
					</Col>

					<Col xs={12} sm={12} md={4} lg={4}>
						<Select
							style={{ width: '100%' }}
							placeholder='Sắp xếp'
							size='large'
							value={`${sort.field}-${sort.order}`}
							onChange={handleSortChange}
						>
							<Option value='rating-desc'>Đánh giá cao nhất</Option>
							<Option value='rating-asc'>Đánh giá thấp nhất</Option>
							<Option value='giaVeChung-asc'>Giá thấp đến cao</Option>
							<Option value='giaVeChung-desc'>Giá cao đến thấp</Option>
							<Option value='ten-asc'>Tên A-Z</Option>
							<Option value='ten-desc'>Tên Z-A</Option>
						</Select>
					</Col>

					<Col xs={24} sm={24} md={8} lg={8}>
						<Space>
							<Button icon={<FilterOutlined />} onClick={() => setShowFilter(!showFilter)}>
								{showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
							</Button>
							<Button icon={<ReloadOutlined />} onClick={handleReset}>
								Đặt lại
							</Button>
						</Space>
					</Col>
				</Row>

				{showFilter && (
					<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
						<Col xs={24} sm={24} md={12} lg={12}>
							<div>
								<label>
									Khoảng giá: {formatCurrency(giaRange[0])} - {formatCurrency(giaRange[1])}
								</label>
								<Slider
									range
									min={0}
									max={2000000}
									step={100000}
									value={giaRange}
									onChange={handleGiaRangeChange}
									onAfterChange={handleGiaRangeAfterChange}
									tooltip={{ formatter: (value) => formatCurrency(value || 0) }}
								/>
							</div>
						</Col>

						<Col xs={24} sm={24} md={12} lg={12}>
							<div>
								<label>Đánh giá tối thiểu:</label>
								<Select
									style={{ width: '100%', marginTop: 8 }}
									placeholder='Chọn đánh giá'
									allowClear
									onChange={handleRatingChange}
									value={filter.ratingMin}
								>
									<Option value={4.5}>4.5 sao trở lên</Option>
									<Option value={4.0}>4.0 sao trở lên</Option>
									<Option value={3.5}>3.5 sao trở lên</Option>
									<Option value={3.0}>3.0 sao trở lên</Option>
								</Select>
							</div>
						</Col>
					</Row>
				)}
			</Card>

			<div className={styles.resultInfo}>
				<span>Tìm thấy {danhSach.length} điểm đến</span>
			</div>

			<Spin spinning={loading}>
				{danhSach.length === 0 ? (
					<Empty description='Không tìm thấy điểm đến phù hợp' />
				) : (
					<Row gutter={[16, 16]}>
						{danhSach.map((item) => (
							<Col xs={24} sm={12} md={8} lg={6} key={item.id}>
								<Card
									hoverable
									className={styles.destinationCard}
									cover={
										<div className={styles.cardCover}>
											<img alt={item.ten} src={item.hinhAnh} />
											<div className={styles.cardOverlay}>{getLoaiHinhTag(item.loaiHinh)}</div>
										</div>
									}
								>
									<Meta
										title={
											<div className={styles.cardTitle}>
												<span>{item.ten}</span>
												<Rate disabled defaultValue={item.rating} style={{ fontSize: 14 }} />
											</div>
										}
										description={
											<div className={styles.cardContent}>
												<p className={styles.description}>{item.moTa}</p>

												<div className={styles.infoItem}>
													<EnvironmentOutlined />
													<span>{item.diaDiem}</span>
												</div>

												<div className={styles.infoItem}>
													<ClockCircleOutlined />
													<span>{item.thoiGianThamQuan} giờ</span>
												</div>

												<div className={styles.infoItem}>
													<DollarOutlined />
													<span className={styles.price}>
														{item.giaVeChung === 0 ? 'Miễn phí' : formatCurrency(item.giaVeChung)}
													</span>
												</div>

												<div className={styles.rating}>
													<Rate disabled defaultValue={item.rating} />
													<span className={styles.ratingText}>
														{item.rating} ({item.danhGiaSoLuong} đánh giá)
													</span>
												</div>

												<Button type='primary' block style={{ marginTop: 12 }}>
													Thêm vào lịch trình
												</Button>
											</div>
										}
									/>
								</Card>
							</Col>
						))}
					</Row>
				)}
			</Spin>
		</div>
	);
};

export default KhamPhaDiemDen;
