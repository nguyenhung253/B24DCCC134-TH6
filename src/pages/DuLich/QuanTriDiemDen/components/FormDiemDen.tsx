import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, message, Row, Col } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useModel } from 'umi';
import type { DiemDen } from '@/services/DuLich/DiemDen/typing';

const { Option } = Select;
const { TextArea } = Input;

interface FormDiemDenProps {
	visible: boolean;
	record?: DiemDen.Record;
	onClose: (refresh?: boolean) => void;
}

const FormDiemDen: React.FC<FormDiemDenProps> = ({ visible, record, onClose }) => {
	const [form] = Form.useForm();
	const { addDiemDen, updateDiemDen } = useModel('dulich.diemDen');
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState<string>();
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (visible) {
			if (record) {
				form.setFieldsValue(record);
				setImageUrl(record.hinhAnh);
			} else {
				form.resetFields();
				setImageUrl(undefined);
			}
		}
	}, [visible, record, form]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			const data: DiemDen.Record = {
				...values,
				hinhAnh: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
				id: record?.id || Date.now().toString(),
				danhGiaSoLuong: record?.danhGiaSoLuong || 0,
				createdAt: record?.createdAt || new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			let success = false;
			if (record) {
				success = await updateDiemDen(data);
				if (success) {
					message.success('Cập nhật điểm đến thành công');
				}
			} else {
				success = await addDiemDen(data);
				if (success) {
					message.success('Thêm điểm đến thành công');
				}
			}

			if (success) {
				onClose(true);
			} else {
				message.error('Có lỗi xảy ra, vui lòng thử lại');
			}
		} catch (error) {
			console.error('Validation failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		onClose(false);
	};

	// Convert image to base64
	const getBase64 = (img: RcFile, callback: (url: string) => void) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result as string));
		reader.readAsDataURL(img);
	};

	const beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('Chỉ hỗ trợ file JPG/PNG!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
		}
		return isJpgOrPng && isLt2M;
	};

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			setUploading(true);
			return;
		}
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj as RcFile, (url) => {
				setUploading(false);
				setImageUrl(url);
			});
		}
	};

	const uploadButton = (
		<div>
			{uploading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	// Custom upload (không gửi lên server, chỉ convert base64)
	const customRequest = ({ file, onSuccess }: any) => {
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};

	return (
		<Modal
			title={record ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
			visible={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			confirmLoading={loading}
			width={800}
			okText={record ? 'Cập nhật' : 'Thêm mới'}
			cancelText='Hủy'
		>
			<Form form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label='Hình ảnh điểm đến'>
							<Upload
								name='avatar'
								listType='picture-card'
								className='avatar-uploader'
								showUploadList={false}
								beforeUpload={beforeUpload}
								onChange={handleChange}
								customRequest={customRequest}
							>
								{imageUrl ? <img src={imageUrl} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
							</Upload>
							<div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>Hoặc nhập URL hình ảnh:</div>
							<Input
								placeholder='https://example.com/image.jpg'
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								style={{ marginTop: 4 }}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='ten'
							label='Tên điểm đến'
							rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}
						>
							<Input placeholder='VD: Vịnh Hạ Long' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='diaDiem' label='Địa điểm' rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
							<Input placeholder='VD: Quảng Ninh' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='loaiHinh'
							label='Loại hình'
							rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
						>
							<Select placeholder='Chọn loại hình'>
								<Option value='bien'>Biển</Option>
								<Option value='nui'>Núi</Option>
								<Option value='thanh-pho'>Thành phố</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='rating' label='Rating' rules={[{ required: true, message: 'Vui lòng nhập rating' }]}>
							<InputNumber min={0} max={5} step={0.1} placeholder='0.0 - 5.0' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='moTa' label='Mô tả ngắn'>
					<TextArea rows={3} placeholder='Mô tả ngắn gọn về điểm đến' />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='giaVeChung'
							label='Giá vé (VNĐ)'
							rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
						>
							<InputNumber
								min={0}
								placeholder='0 = Miễn phí'
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='thoiGianThamQuan'
							label='Thời gian tham quan (giờ)'
							rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
						>
							<InputNumber min={1} placeholder='Số giờ' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							name='chiPhiAnUong'
							label='Chi phí ăn uống (VNĐ)'
							rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
						>
							<InputNumber
								min={0}
								placeholder='0'
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name='chiPhiLuuTru'
							label='Chi phí lưu trú (VNĐ)'
							rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
						>
							<InputNumber
								min={0}
								placeholder='0'
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name='chiPhiDiChuyen'
							label='Chi phí di chuyển (VNĐ)'
							rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
						>
							<InputNumber
								min={0}
								placeholder='0'
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='tienNghi' label='Tiện nghi'>
					<Select mode='tags' placeholder='Nhập và nhấn Enter để thêm tiện nghi'>
						<Option value='Nhà hàng'>Nhà hàng</Option>
						<Option value='Khách sạn'>Khách sạn</Option>
						<Option value='Bãi đỗ xe'>Bãi đỗ xe</Option>
						<Option value='WiFi miễn phí'>WiFi miễn phí</Option>
						<Option value='Cho thuê xe'>Cho thuê xe</Option>
					</Select>
				</Form.Item>

				<Form.Item name='thoiGianMoCua' label='Thời gian mở cửa'>
					<Input placeholder='VD: 8:00 - 18:00' />
				</Form.Item>

				<Form.Item name='moTaChiTiet' label='Mô tả chi tiết'>
					<TextArea rows={4} placeholder='Mô tả chi tiết về điểm đến, lịch sử, đặc điểm...' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormDiemDen;
