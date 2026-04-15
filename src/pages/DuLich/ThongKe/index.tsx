import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import { DollarOutlined, FileTextOutlined, RiseOutlined, EnvironmentOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import type { ColumnsType } from 'antd/es/table';
import type { ThongKe } from '@/services/DuLich/ThongKe/typing';
import styles from './index.less';

const ThongKePage: React.FC = () => {
	const { thongKeThang, diemDenPhoBien, chiPhiHangMuc, tongQuan, loading, fetchThongKe } = useModel('dulich.thongKe');

	useEffect(() => {
		fetchThongKe();
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(value);
	};

	// Biểu đồ cột - Lịch trình theo tháng
	const chartThangOptions: any = {
		chart: {
			type: 'bar',
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		xaxis: {
			categories: thongKeThang.map((item) => item.thang),
		},
		yaxis: [
			{
				title: {
					text: 'Số lượng lịch trình',
				},
			},
			{
				opposite: true,
				title: {
					text: 'Doanh thu (VNĐ)',
				},
			},
		],
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: function (val: number, opts: any) {
					if (opts.seriesIndex === 1) {
						return formatCurrency(val);
					}
					return val + ' lịch trình';
				},
			},
		},
		colors: ['#1890ff', '#52c41a'],
	};

	const chartThangSeries = [
		{
			name: 'Số lượng lịch trình',
			data: thongKeThang.map((item) => item.soLuong),
		},
		{
			name: 'Doanh thu',
			data: thongKeThang.map((item) => item.tongDoanhThu),
		},
	];

	// Biểu đồ tròn - Chi phí theo hạng mục
	const chartHangMucOptions: any = {
		chart: {
			type: 'pie',
		},
		labels: ['Vé vào cổng', 'Ăn uống', 'Lưu trú', 'Di chuyển'],
		colors: ['#fa8c16', '#ff4d4f', '#52c41a', '#1890ff'],
		legend: {
			position: 'bottom',
		},
		dataLabels: {
			enabled: true,
			formatter: function (val: number, opts: any) {
				const value = opts.w.config.series[opts.seriesIndex];
				return formatCurrency(value);
			},
		},
		tooltip: {
			y: {
				formatter: function (value: number) {
					return formatCurrency(value);
				},
			},
		},
	};

	const chartHangMucSeries = [chiPhiHangMuc.giaVe, chiPhiHangMuc.anUong, chiPhiHangMuc.luuTru, chiPhiHangMuc.diChuyen];

	// Bảng điểm đến phổ biến
	const columns: ColumnsType<ThongKe.DiemDenPhoBien> = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Địa điểm',
			dataIndex: 'diaDiem',
			key: 'diaDiem',
			render: (text) => (
				<span>
					<EnvironmentOutlined style={{ marginRight: 4 }} />
					{text}
				</span>
			),
		},
		{
			title: 'Số lượt chọn',
			dataIndex: 'soLuot',
			key: 'soLuot',
			sorter: (a, b) => a.soLuot - b.soLuot,
			render: (value) => <Tag color='blue'>{value} lượt</Tag>,
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Thống kê Du lịch</h1>
				<p>Tổng quan về lịch trình và doanh thu</p>
			</div>

			<Spin spinning={loading}>
				{/* Tổng quan */}
				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title='Tổng số lịch trình'
								value={tongQuan.tongSoLichTrinh}
								prefix={<FileTextOutlined />}
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title='Tổng doanh thu'
								value={tongQuan.tongDoanhThu}
								prefix={<DollarOutlined />}
								valueStyle={{ color: '#52c41a' }}
								formatter={(value) => formatCurrency(Number(value))}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title='Chi phí trung bình'
								value={tongQuan.trungBinhChiPhi}
								prefix={<RiseOutlined />}
								valueStyle={{ color: '#fa8c16' }}
								formatter={(value) => formatCurrency(Number(value))}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title='Lịch trình tháng này'
								value={tongQuan.lichTrinhThangNay}
								prefix={<FileTextOutlined />}
								valueStyle={{ color: '#722ed1' }}
							/>
						</Card>
					</Col>
				</Row>

				{/* Biểu đồ */}
				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					<Col xs={24} lg={14}>
						<Card title='Lịch trình theo tháng' extra={<ReloadOutlined onClick={fetchThongKe} />}>
							{thongKeThang.length > 0 ? (
								<ReactApexChart options={chartThangOptions} series={chartThangSeries} type='bar' height={350} />
							) : (
								<div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Chưa có dữ liệu thống kê</div>
							)}
						</Card>
					</Col>
					<Col xs={24} lg={10}>
						<Card title='Chi phí theo hạng mục'>
							{chiPhiHangMuc.giaVe + chiPhiHangMuc.anUong + chiPhiHangMuc.luuTru + chiPhiHangMuc.diChuyen > 0 ? (
								<ReactApexChart options={chartHangMucOptions} series={chartHangMucSeries} type='pie' height={350} />
							) : (
								<div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Chưa có dữ liệu chi phí</div>
							)}
						</Card>
					</Col>
				</Row>

				{/* Bảng điểm đến phổ biến */}
				<Row>
					<Col span={24}>
						<Card title='Điểm đến phổ biến'>
							<Table
								columns={columns}
								dataSource={diemDenPhoBien}
								rowKey='id'
								pagination={{ pageSize: 10 }}
								locale={{
									emptyText: 'Chưa có dữ liệu điểm đến',
								}}
							/>
						</Card>
					</Col>
				</Row>
			</Spin>
		</div>
	);
};

export default ThongKePage;
