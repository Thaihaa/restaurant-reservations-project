import api from './api';

export interface LoaiBDS {
  _id?: string;
  tenLoai: string;
  loaiHinh: 'ban' | 'thue';
  moTa?: string;
  thuTu?: number;
  trangThai?: boolean;
}

export interface TinDang {
  _id?: string;
  tieuDe: string;
  moTa?: string;
  gia: number;
  donViGia?: 'tong' | 'm2' | 'thang';
  dienTich?: number;
  phongNgu?: number;
  phongTam?: number;
  huongNha?: string;
  diaChi?: string;
  tinhThanh?: string;
  quanHuyen?: string;
  phuongXa?: string;
  loaiHinh: 'ban' | 'thue';
  loaiBDS?: string | LoaiBDS;
  hinhAnh?: string[];
  nguoiDang?: string;
  trangThai?: 'nhap' | 'cho_duyet' | 'dang_hien_thi' | 'het_han' | 'da_ban';
  noiBat?: boolean;
  luotXem?: number;
  lienHe?: {
    hoTen?: string;
    soDienThoai?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const getAllTinDang = async (params?: Record<string, unknown>) => {
  const response = await api.get('/tin-dang', { params });
  return response.data;
};

export const getTinDangById = async (id: string) => {
  const response = await api.get(`/tin-dang/${id}`);
  return response.data;
};

export const getTinDangNoiBat = async (limit = 6) => {
  const response = await api.get('/tin-dang/noi-bat', { params: { limit } });
  return response.data;
};

export const createTinDang = async (data: TinDang) => {
  const response = await api.post('/tin-dang', data);
  return response.data;
};

export const updateTinDang = async (id: string, data: Partial<TinDang>) => {
  const response = await api.put(`/tin-dang/${id}`, data);
  return response.data;
};

export const updateTrangThaiTinDang = async (id: string, trangThai: string) => {
  const response = await api.patch(`/tin-dang/${id}/trang-thai`, { trangThai });
  return response.data;
};

export const deleteTinDang = async (id: string) => {
  const response = await api.delete(`/tin-dang/${id}`);
  return response.data;
};

export const getAllLoaiBDS = async (params?: Record<string, unknown>) => {
  const response = await api.get('/loai-bds', { params });
  return response.data;
};

export const seedLoaiBDS = async () => {
  const response = await api.post('/loai-bds/seed');
  return response.data;
};

export const formatGia = (gia: number, donViGia?: string, loaiHinh?: string): string => {
  if (gia >= 1_000_000_000) {
    const ty = gia / 1_000_000_000;
    return `${ty % 1 === 0 ? ty : ty.toFixed(1)} tỷ`;
  }
  if (gia >= 1_000_000) {
    const trieu = gia / 1_000_000;
    const suffix = donViGia === 'm2' ? '/m²' : loaiHinh === 'thue' ? '/tháng' : '';
    return `${trieu % 1 === 0 ? trieu : trieu.toFixed(1)} triệu${suffix}`;
  }
  return gia.toLocaleString('vi-VN') + ' đ';
};

export const TRANG_THAI_LABELS: Record<string, string> = {
  nhap: 'Nháp',
  cho_duyet: 'Chờ duyệt',
  dang_hien_thi: 'Đang hiển thị',
  het_han: 'Hết hạn',
  da_ban: 'Đã bán/cho thuê',
};

// Admin functions
export const getAllTinDangAdmin = async (params?: Record<string, unknown>) => {
  const response = await api.get('/tin-dang/admin/danh-sach', { params });
  return response.data;
};

export const getStatisticsTinDang = async () => {
  const response = await api.get('/tin-dang/admin/thong-ke');
  return response.data;
};

export const approveTinDang = async (id: string) => {
  const response = await api.patch(`/tin-dang/${id}/duyet`);
  return response.data;
};

export const rejectTinDang = async (id: string, lyDoTuChoi: string) => {
  const response = await api.patch(`/tin-dang/${id}/tu-choi`, { lyDoTuChoi });
  return response.data;
};

export const toggleNoiBat = async (id: string) => {
  const response = await api.patch(`/tin-dang/${id}/noi-bat`);
  return response.data;
};

export const searchByPriceAndName = async (params?: Record<string, unknown>) => {
  const response = await api.get('/tin-dang/tim-kiem', { params });
  return response.data;
};
