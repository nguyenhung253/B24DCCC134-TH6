import React from 'react';
import { Card, Typography, InputNumber, Alert, Row, Col, Statistic } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { useModel } from 'umi';
import { DollarOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Title, Text } = Typography;

const QuanLyNganSach: React.FC = () => {
	const { duLieuBieuDo, tongChiPhi, nganSachDuKien, setNganSachDuKien } = useModel('dulich.nganSach');

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(value);
	};

	const conLai = nganSachDuKien - tongChiPhi;
	const phanTramSuDung = nganSachDuKien > 0 ? (tongChiPhi / nganSachDuKien) * 100 : 0;
	const vuotNganSach = tongChiPhi > nganSachDuKien;

	const chartOptions: any = {
		chart: {
			type: 'pie',
		},
		labels: duLieuBieuDo.map((item: any) => item.loai),
		colors: ['#ff4d4f', '#52c41a', '#1890ff', '#fa8c16'],
		legend: {
			position: 'bottom',
			fontSize: '14px',
			fontWeight: 600,
		},
		dataLabels: {
			enabled: true,
			formatter: function (val: number, opts: any) {
				const value = opts.w.config.series[opts.seriesIndex];
				return value > 0 ? formatCurrency(value) : '';
			},
			style: {
				fontSize: '12px',
				fontWeight: 'bold',
			},
		},
		tooltip: {
			y: {
				formatter: function (value: number) {
					return formatCurrency(value);
				},
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 300,
					},
					legend: {
						position: 'bottom',
					},
				},
			},
		],
	};

	const chartSeries = duLieuBieuDo.map((item: any) => item.giaTri);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Quản lý Ngân Sách</h1>
				<p>Quản lý túi tiền, đừng để ví khóc!</p>
			</div>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={12}>
					<Card className={styles.card}>
						<Title level={4}>Ngân sách dự kiến</Title>
						<InputNumber
							value={nganSachDuKien}
							onChange={(v: any) => setNganSachDuKien(v || 0)}
							style={{ width: '100%' }}
							size='large'
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
							prefix={<DollarOutlined />}
							min={0}
							step={100000}
						/>
						<Text type='secondary' style={{ display: 'block', marginTop: 8 }}>
							{formatCurrency(nganSachDuKien)}
						</Text>
					</Card>

					<Card className={styles.card} style={{ marginTop: 24 }}>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<Statistic
									title='Tổng chi phí'
									value={tongChiPhi}
									precision={0}
									valueStyle={{ color: vuotNganSach ? '#cf1322' : '#3f8600' }}
									prefix={<DollarOutlined />}
									suffix='đ'
								/>
							</Col>
							<Col span={12}>
								<Statistic
									title={vuotNganSach ? 'Vượt ngân sách' : 'Còn lại'}
									value={Math.abs(conLai)}
									precision={0}
									valueStyle={{ color: vuotNganSach ? '#cf1322' : '#3f8600' }}
									prefix={vuotNganSach ? <WarningOutlined /> : <CheckCircleOutlined />}
									suffix='đ'
								/>
							</Col>
							<Col span={24}>
								<Statistic
									title='Tỷ lệ sử dụng'
									value={phanTramSuDung}
									precision={1}
									valueStyle={{ color: phanTramSuDung > 100 ? '#cf1322' : phanTramSuDung > 80 ? '#fa8c16' : '#3f8600' }}
									suffix='%'
								/>
							</Col>
						</Row>

						{vuotNganSach && (
							<Alert
								message='Cảnh báo vượt ngân sách!'
								description={`Bạn đã chi vượt ${formatCurrency(
									Math.abs(conLai),
								)} so với dự kiến. Hãy cân nhắc điều chỉnh lịch trình hoặc tăng ngân sách.`}
								type='error'
								showIcon
								style={{ marginTop: 16 }}
							/>
						)}

						{!vuotNganSach && phanTramSuDung > 80 && (
							<Alert
								message='Sắp đạt ngân sách'
								description={`Bạn đã sử dụng ${phanTramSuDung.toFixed(1)}% ngân sách. Còn ${formatCurrency(
									conLai,
								)} để chi tiêu.`}
								type='warning'
								showIcon
								style={{ marginTop: 16 }}
							/>
						)}
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card className={styles.card}>
						<Title level={4}>Biểu đồ phân bổ chi phí</Title>
						{tongChiPhi > 0 ? (
							<ReactApexChart options={chartOptions} series={chartSeries} type='pie' height={350} />
						) : (
							<div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
								<Text type='secondary'>Chưa có dữ liệu chi phí. Hãy thêm điểm đến vào lịch trình!</Text>
							</div>
						)}
					</Card>

					<Card className={styles.card} style={{ marginTop: 24 }}>
						<Title level={4}>Chi tiết chi phí</Title>
						{duLieuBieuDo.map((item, index) => (
							<div key={index} style={{ marginBottom: 12 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
									<Text strong>{item.loai}</Text>
									<Text>{formatCurrency(item.giaTri)}</Text>
								</div>
								<div
									style={{
										height: 8,
										background: '#f0f0f0',
										borderRadius: 4,
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											height: '100%',
											width: `${tongChiPhi > 0 ? (item.giaTri / tongChiPhi) * 100 : 0}%`,
											background: ['#ff4d4f', '#52c41a', '#1890ff', '#fa8c16'][index],
											transition: 'width 0.3s',
										}}
									/>
								</div>
							</div>
						))}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default QuanLyNganSach;
