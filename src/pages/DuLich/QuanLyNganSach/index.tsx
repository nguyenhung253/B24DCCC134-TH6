import React from "react";
import { Card, Typography, InputNumber, Alert } from "antd";
import { Pie } from "@ant-design/plots";
import { useModel } from "umi";
import styles from "./index.less";

const { Title } = Typography;

const QuanLyNganSach: React.FC = () => {
  const { duLieuBieuDo, tongChiPhi, nganSachDuKien, setNganSachDuKien } =
    useModel("dulich.nganSach");

  const cauHinhBieuDo = {
    data: duLieuBieuDo,
    angleField: "giaTri",
    colorField: "loai",
    color: ["#ff4d4f", "#52c41a", "#1890ff", "#fa8c16"],
    label: {
      type: "inner",
      offset: "-30%",
      style: { fontSize: 14, fill: "#fff", fontWeight: "bold" },
    },
    legend: {
      position: "bottom" as const,
      layout: "horizontal" as const,
      itemName: { style: { fontSize: 14, fontWeight: 600, fill: "#000" } },
      marker: { symbol: "square" as any, style: { r: 8 } },
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý Ngân Sách</h1>
        <p>Quản lý túi tiền, đừng để ví khóc!</p>
      </div>

      <Card className={styles.card}>
        <Title level={4}>Ngân sách dự kiến</Title>
        <InputNumber
          value={nganSachDuKien}
          onChange={(v: any) => setNganSachDuKien(v)}
          style={{ width: 220 }}
        />
      </Card>

      <Card className={styles.card}>
        <Title level={4}>Tổng chi phí</Title>
        <Title level={3}>{tongChiPhi.toLocaleString()} đ</Title>

        {tongChiPhi > nganSachDuKien && (
          <Alert message="Bạn đã vượt ngân sách!" type="error" showIcon />
        )}
      </Card>

      <Card className={styles.card}>
        <Title level={4}>Biểu đồ chi phí</Title>
        <Pie {...cauHinhBieuDo} />
      </Card>
    </div>
  );
};

export default QuanLyNganSach;