export namespace LichTrinhType {
  export interface Item extends DiemDen.Record {
    idLichTrinh: string; 
  }

  export interface Ngay {
    ngay: number;
    danhSach: Item[];
  }

  export interface ThongKe {
    tongChiPhi: number;
    tongThoiGian: number;
    soDiemDen: number;
  }
}