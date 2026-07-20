import api from './api';
import { ApiResponse } from '../types';

// Interface cho Môi giới (Real Estate Agent)
export interface MoiGioi {
  _id?: string;
  tenMoiGioi: string;
  dienThoai: string;
  email: string;
  website?: string;
  licenseNumber: string;
  moTa?: string;
  hinhAnh?: string[];
  danhGiaTrungBinh?: number;
  soLuongDanhGia?: number;
  soLuongBatDongSan?: number;
  trangThai?: 'Hoạt động' | 'Tạm dừng' | 'Hết hạn';
  viTri?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  diaChi: string;
  thanhPho?: string;
  quanHuyen?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho Chi nhánh (Agent Branch)
export interface ChiNhanh {
  _id?: string;
  maChiNhanh: string;
  moiGioi: string | MoiGioi;
  tenChiNhanh: string;
  diaChi: string;
  dienThoai: string;
  email?: string;
  soNhanVien?: number;
  trangThai?: 'Hoạt động' | 'Tạm dừng' | 'Bảo trì';
  moTa?: string;
  hinhAnh?: string[];
  viTri?: {
    type: string;
    coordinates: [number, number];
  };
  createdAt?: string;
  updatedAt?: string;
}

const MOI_GIOI_ENDPOINT = '/moi-gioi';
const CHI_NHANH_ENDPOINT = '/chi-nhanh';

// ============ Môi giới (Agent) APIs ============

// Lấy danh sách môi giới
export const getAllMoiGioi = async (params?: Record<string, unknown>) => {
  const response = await api.get<ApiResponse<MoiGioi[]>>(MOI_GIOI_ENDPOINT, { params });
  return response.data;
};

// Lấy thông tin môi giới theo ID
export const getMoiGioiById = async (id: string) => {
  const response = await api.get<ApiResponse<MoiGioi>>(`${MOI_GIOI_ENDPOINT}/${id}`);
  return response.data;
};

// Lấy danh sách môi giới gần đây theo vị trí
export const getNearbyMoiGioi = async (lat: number, lng: number, radius: number = 10) => {
  const response = await api.get<ApiResponse<MoiGioi[]>>(`${MOI_GIOI_ENDPOINT}/gan-day`, {
    params: { lat, lng, radius }
  });
  return response.data;
};

// Tạo môi giới mới
export const createMoiGioi = async (data: MoiGioi) => {
  const response = await api.post<ApiResponse<MoiGioi>>(MOI_GIOI_ENDPOINT, data);
  return response.data;
};

// Cập nhật thông tin môi giới
export const updateMoiGioi = async (id: string, data: Partial<MoiGioi>) => {
  const response = await api.put<ApiResponse<MoiGioi>>(`${MOI_GIOI_ENDPOINT}/${id}`, data);
  return response.data;
};

// Xóa môi giới
export const deleteMoiGioi = async (id: string) => {
  const response = await api.delete<ApiResponse<void>>(`${MOI_GIOI_ENDPOINT}/${id}`);
  return response.data;
};

// Cập nhật đánh giá cho môi giới
export const updateMoiGioiRating = async (id: string, danhGiaTrungBinh: number, soLuongDanhGia: number) => {
  const response = await api.patch<ApiResponse<MoiGioi>>(`${MOI_GIOI_ENDPOINT}/${id}/rating`, {
    danhGiaTrungBinh,
    soLuongDanhGia
  });
  return response.data;
};

// ============ Chi nhánh (Branch) APIs ============

// Lấy danh sách chi nhánh
export const getAllChiNhanh = async (params?: Record<string, unknown>) => {
  const response = await api.get<ApiResponse<ChiNhanh[]>>(CHI_NHANH_ENDPOINT, { params });
  return response.data;
};

// Lấy thông tin chi nhánh theo ID
export const getChiNhanhById = async (id: string) => {
  const response = await api.get<ApiResponse<ChiNhanh>>(`${CHI_NHANH_ENDPOINT}/${id}`);
  return response.data;
};

// Lấy chi nhánh theo môi giới
export const getChiNhanhByMoiGioi = async (moiGioiId: string) => {
  const response = await api.get<ApiResponse<ChiNhanh[]>>(`${CHI_NHANH_ENDPOINT}/by-moigioi/${moiGioiId}`);
  return response.data;
};

// Đếm chi nhánh theo môi giới
export const countChiNhanhByMoiGioi = async (moiGioiId: string) => {
  const response = await api.get<ApiResponse<any>>(`${CHI_NHANH_ENDPOINT}/count/${moiGioiId}`);
  return response.data;
};

// Tạo chi nhánh mới
export const createChiNhanh = async (data: ChiNhanh) => {
  const response = await api.post<ApiResponse<ChiNhanh>>(CHI_NHANH_ENDPOINT, data);
  return response.data;
};

// Cập nhật thông tin chi nhánh
export const updateChiNhanh = async (id: string, data: Partial<ChiNhanh>) => {
  const response = await api.put<ApiResponse<ChiNhanh>>(`${CHI_NHANH_ENDPOINT}/${id}`, data);
  return response.data;
};

// Xóa chi nhánh
export const deleteChiNhanh = async (id: string) => {
  const response = await api.delete<ApiResponse<void>>(`${CHI_NHANH_ENDPOINT}/${id}`);
  return response.data;
};

// Kiểm tra tính khả dụng chi nhánh
export const checkChiNhanhAvailability = async (moiGioi: string, maChiNhanh: string) => {
  const response = await api.get<ApiResponse<any>>(`${CHI_NHANH_ENDPOINT}/check-availability`, {
    params: { moiGioi, maChiNhanh }
  });
  return response.data;
};

// Cập nhật trạng thái chi nhánh
export const updateChiNhanhStatus = async (id: string, trangThai: string) => {
  const response = await api.patch<ApiResponse<ChiNhanh>>(`${CHI_NHANH_ENDPOINT}/${id}/status`, {
    trangThai
  });
  return response.data;
};
