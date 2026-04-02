import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Button, Select, Row, Col, Typography, List, Space, Popconfirm, Statistic, Divider, Tag, message } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;
const { Option } = Select;

// Kiểu dữ liệu cho một item trong lịch trình
interface LichTrinhItem extends DiemDen.Record {
  idLichTrinh: string; // ID duy nhất cho mỗi lần thêm vào lịch trình
}

interface NgayLichTrinh {
  ngay: number;
  danhSach: LichTrinhItem[];
}

const TaoLichTrinh: React.FC = () => {
  const { danhSach: danhSachDiemDen, fetchDanhSach } = useModel('dulich.diemDen');

  // State quản lý lịch trình
  const [lichTrinh, setLichTrinh] = useState<NgayLichTrinh[]>([{ ngay: 1, danhSach: [] }]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedDiemDen, setSelectedDiemDen] = useState<string | undefined>();

  useEffect(() => {
    fetchDanhSach();
  }, []);

  // Hàm thêm ngày mới
  const themNgay = () => {
    setLichTrinh([...lichTrinh, { ngay: lichTrinh.length + 1, danhSach: [] }]);
    message.success(`Đã thêm Ngày ${lichTrinh.length + 1}`);
  };

  // Hàm xóa ngày cuối cùng
  const xoaNgay = () => {
    if (lichTrinh.length > 1) {
      setLichTrinh(lichTrinh.slice(0, -1));
      if (selectedDay === lichTrinh.length) {
        setSelectedDay(lichTrinh.length - 1);
      }
      message.success('Đã xóa ngày cuối cùng');
    }
  };

  // Thêm điểm đến vào ngày đã chọn
  const themVaoLichTrinh = () => {
    if (!selectedDiemDen) {
      message.warning('Vui lòng chọn một điểm đến!');
      return;
    }

    const diemDen = danhSachDiemDen.find((d) => d.id === selectedDiemDen);
    if (diemDen) {
      const newItem: LichTrinhItem = {
        ...diemDen,
        idLichTrinh: `${diemDen.id}-${Date.now()}`,
      };

      const newLichTrinh = lichTrinh.map((ngayLT) => {
        if (ngayLT.ngay === selectedDay) {
          return { ...ngayLT, danhSach: [...ngayLT.danhSach, newItem] };
        }
        return ngayLT;
      });

      setLichTrinh(newLichTrinh);
      setSelectedDiemDen(undefined);
      message.success(`Đã thêm ${diemDen.ten} vào Ngày ${selectedDay}`);
    }
  };

  // Xóa điểm đến khỏi lịch trình
  const xoaKhoiLichTrinh = (ngay: number, idLichTrinh: string) => {
    const newLichTrinh = lichTrinh.map((ngayLT) => {
      if (ngayLT.ngay === ngay) {
        return { ...ngayLT, danhSach: ngayLT.danhSach.filter((item) => item.idLichTrinh !== idLichTrinh) };
      }
      return ngayLT;
    });
    setLichTrinh(newLichTrinh);
  };

  // Sắp xếp thứ tự điểm đến (Di chuyển lên/xuống)
  const thayDoiThuTu = (ngay: number, index: number, direction: 'up' | 'down') => {
    const newLichTrinh = [...lichTrinh];
    const ngayIndex = newLichTrinh.findIndex((n) => n.ngay === ngay);
    const list = newLichTrinh[ngayIndex].danhSach;

    if (direction === 'up' && index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index + 1], list[index]] = [list[index], list[index + 1]];
    }

    setLichTrinh(newLichTrinh);
  };

  // Tính toán ngân sách và thời gian
  const thongKeLichTrinh = () => {
    let tongChiPhi = 0;
    let tongThoiGian = 0;
    let soDiemDen = 0;

    lichTrinh.forEach((ngay) => {
      ngay.danhSach.forEach((item) => {
        // Cộng dồn các chi phí[cite: 5]
        tongChiPhi += (item.giaVeChung || 0) + (item.chiPhiAnUong || 0) + (item.chiPhiLuuTru || 0) + (item.chiPhiDiChuyen || 0);
        // Cộng dồn thời gian[cite: 5]
        tongThoiGian += item.thoiGianThamQuan || 0;
        // Giả lập thời gian di chuyển giữa các điểm đến (ví dụ: 1 giờ di chuyển giữa mỗi điểm)
        tongThoiGian += 1; 
        soDiemDen += 1;
      });
    });

    // Trừ đi 1 giờ di chuyển thừa ở điểm đến cuối cùng
    if (soDiemDen > 0) tongThoiGian -= 1;

    return { tongChiPhi, tongThoiGian, soDiemDen };
  };

  const thongKe = thongKeLichTrinh();

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
        {/* Cột trái: Cấu hình và Thêm điểm đến */}
        <Col xs={24} lg={8}>
          <Card title="Thêm điểm đến vào lịch trình" className={styles.cardShadow}>
            <div className={styles.formGroup}>
              <Text strong>Chọn ngày:</Text>
              <Select value={selectedDay} onChange={setSelectedDay} style={{ width: '100%', marginTop: 8 }}>
                {lichTrinh.map((ngay) => (
                  <Option key={ngay.ngay} value={ngay.ngay}>Ngày {ngay.ngay}</Option>
                ))}
              </Select>
            </div>

            <div className={styles.formGroup} style={{ marginTop: 16 }}>
              <Text strong>Chọn điểm đến:</Text>
              <Select
                showSearch
                placeholder="Tìm và chọn điểm đến..."
                value={selectedDiemDen}
                onChange={setSelectedDiemDen}
                style={{ width: '100%', marginTop: 8 }}
                optionFilterProp="children"
              >
                {danhSachDiemDen.map((item) => (
                  <Option key={item.id} value={item.id}>{item.ten} - {item.diaDiem}</Option>
                ))}
              </Select>
            </div>

            <Button type="primary" block onClick={themVaoLichTrinh} style={{ marginTop: 24 }}>
              Thêm vào Ngày {selectedDay}
            </Button>

            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button onClick={themNgay} block>+ Thêm ngày mới</Button>
              <Popconfirm title="Bạn có chắc chắn muốn xóa ngày cuối cùng?" onConfirm={xoaNgay}>
                <Button danger block disabled={lichTrinh.length <= 1}>Xóa ngày cuối</Button>
              </Popconfirm>
            </Space>
          </Card>

          <Card title="Tổng quan lịch trình" className={styles.cardShadow} style={{ marginTop: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Tổng ngân sách dự kiến" value={formatCurrency(thongKe.tongChiPhi)} valueStyle={{ color: '#cf1322', fontSize: '18px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Tổng thời gian (Ước tính)" value={`${thongKe.tongThoiGian} giờ`} valueStyle={{ color: '#1890ff', fontSize: '18px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Tổng số điểm đến" value={thongKe.soDiemDen} valueStyle={{ fontSize: '18px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Số ngày" value={lichTrinh.length} valueStyle={{ fontSize: '18px' }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Cột phải: Chi tiết lịch trình theo ngày */}
        <Col xs={24} lg={16}>
          {lichTrinh.map((ngayLT) => (
            <Card key={ngayLT.ngay} title={`Ngày ${ngayLT.ngay}`} className={styles.dayCard}>
              <List
                locale={{ emptyText: 'Chưa có điểm đến nào trong ngày này' }}
                itemLayout="horizontal"
                dataSource={ngayLT.danhSach}
                renderItem={(item, index) => (
                  <List.Item
                    className={styles.listItem}
                    actions={[
                      <Button type="text" icon={<ArrowUpOutlined />} onClick={() => thayDoiThuTu(ngayLT.ngay, index, 'up')} disabled={index === 0} />,
                      <Button type="text" icon={<ArrowDownOutlined />} onClick={() => thayDoiThuTu(ngayLT.ngay, index, 'down')} disabled={index === ngayLT.danhSach.length - 1} />,
                      <Popconfirm title="Xóa điểm đến này?" onConfirm={() => xoaKhoiLichTrinh(ngayLT.ngay, item.idLichTrinh)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<img src={item.hinhAnh} alt={item.ten} className={styles.itemImage} />}
                      title={
                        <Space>
                          <Text strong>{item.ten}</Text>
                          <Tag color="blue">{item.diaDiem}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary" className={styles.itemDesc}><EnvironmentOutlined /> {item.moTa}</Text>
                          <Space split={<Divider type="vertical" />}>
                            <Text><ClockCircleOutlined /> Tham quan: {item.thoiGianThamQuan}h</Text>
                            <Text><DollarOutlined /> Vé: {item.giaVeChung === 0 ? 'Miễn phí' : formatCurrency(item.giaVeChung)}</Text>
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