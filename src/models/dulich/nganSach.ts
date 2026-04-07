import { useState, useEffect } from "react";
import { layLichTrinh, DuLieuBieuDo } from "@/services/DuLich/nganSach";

export default () => {
  const [duLieuBieuDo, setDuLieuBieuDo] = useState<DuLieuBieuDo[]>([]);
  const [tongChiPhi, setTongChiPhi] = useState<number>(0);
  const [nganSachDuKien, setNganSachDuKien] = useState<number>(5000000);

  const tinhChiPhi = () => {
    const lichTrinh = layLichTrinh();

    let chiPhiAnUong = 0;
    let chiPhiLuuTru = 0;
    let chiPhiDiChuyen = 0;
    let giaVeChung = 0;

    lichTrinh.forEach((ngay) => {
      ngay.danhSach.forEach((diaDiem) => {
        chiPhiAnUong += diaDiem.chiPhiAnUong || 0;
        chiPhiLuuTru += diaDiem.chiPhiLuuTru || 0;
        chiPhiDiChuyen += diaDiem.chiPhiDiChuyen || 0;
        giaVeChung += diaDiem.giaVeChung || 0;
      });
    });

    const tong = chiPhiAnUong + chiPhiLuuTru + chiPhiDiChuyen + giaVeChung;

    setTongChiPhi(tong);

    setDuLieuBieuDo([
      { loai: "Ăn uống", giaTri: chiPhiAnUong },
      { loai: "Lưu trú", giaTri: chiPhiLuuTru },
      { loai: "Di chuyển", giaTri: chiPhiDiChuyen },
      { loai: "Vé vào cổng", giaTri: giaVeChung },
    ]);
  };

  useEffect(() => {
    tinhChiPhi();
  }, []);

  return {
    duLieuBieuDo,
    tongChiPhi,
    nganSachDuKien,
    setNganSachDuKien,
  };
};