import { useState, useMemo } from 'react';
import { message } from 'antd';
import { tinhToanThongKe } from '@/services/DuLich/LichTrinh/lichTrinh';
import type { LichTrinhType } from '@/services/DuLich/LichTrinh/typing';

export default () => {
  // Mảng lưu trữ toàn bộ dữ liệu lịch trình theo ngày
  const [lichTrinh, setLichTrinh] = useState<LichTrinhType.Ngay[]>([{ ngay: 1, danhSach: [] }]);

  // Thêm một ngày mới vào lịch trình
  const themNgay = () => {
    setLichTrinh([...lichTrinh, { ngay: lichTrinh.length + 1, danhSach: [] }]);
    message.success(`Đã thêm Ngày ${lichTrinh.length + 1}`);
  };

  // Xóa ngày cuối cùng
  const xoaNgay = () => {
    if (lichTrinh.length > 1) {
      setLichTrinh(lichTrinh.slice(0, -1));
      message.success('Đã xóa ngày cuối cùng');
      return true; 
    }
    return false;
  };

  // Thêm một điểm đến vào một ngày cụ thể
  const themVaoLichTrinh = (ngay: number, diemDen: DiemDen.Record) => {
    const newItem: LichTrinhType.Item = {
      ...diemDen,
      idLichTrinh: `${diemDen.id}-${Date.now()}`, // Tạo ID độc nhất
    };

    const newLichTrinh = lichTrinh.map((ngayLT) => {
      if (ngayLT.ngay === ngay) {
        return { ...ngayLT, danhSach: [...ngayLT.danhSach, newItem] };
      }
      return ngayLT;
    });

    setLichTrinh(newLichTrinh);
    message.success(`Đã thêm ${diemDen.ten} vào Ngày ${ngay}`);
  };

  // Xóa điểm đến khỏi lịch trình
  const xoaKhoiLichTrinh = (ngay: number, idLichTrinh: string) => {
    const newLichTrinh = lichTrinh.map((ngayLT) => {
      if (ngayLT.ngay === ngay) {
        return {
          ...ngayLT,
          danhSach: ngayLT.danhSach.filter((item) => item.idLichTrinh !== idLichTrinh),
        };
      }
      return ngayLT;
    });
    setLichTrinh(newLichTrinh);
  };

  // Thay đổi thứ tự tham quan (lên/xuống)
  const thayDoiThuTu = (ngay: number, index: number, direction: 'up' | 'down') => {
    const newLichTrinh = [...lichTrinh];
    const ngayIndex = newLichTrinh.findIndex((n) => n.ngay === ngay);
    const list = [...newLichTrinh[ngayIndex].danhSach];

    if (direction === 'up' && index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index + 1], list[index]] = [list[index], list[index + 1]];
    }

    newLichTrinh[ngayIndex].danhSach = list;
    setLichTrinh(newLichTrinh);
  };

  // Dùng useMemo để chỉ tính toán lại khi mảng lichTrinh thay đổi
  const thongKe = useMemo(() => tinhToanThongKe(lichTrinh), [lichTrinh]);

  // Trả ra các biến và hàm để View sử dụng
  return {
    lichTrinh,
    thongKe,
    themNgay,
    xoaNgay,
    themVaoLichTrinh,
    xoaKhoiLichTrinh,
    thayDoiThuTu,
  };
};