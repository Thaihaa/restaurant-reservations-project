// Cấu hình cho ứng dụng
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Các URL quan trọng
export const AUTH_URL = `${API_URL}/auth`;
export const RESTAURANTS_URL = `${API_URL}/nha-hang`; // Deprecated
export const AGENT_URL = `${API_URL}/moi-gioi`; // Real Estate Agent (Replace RESTAURANTS_URL)
export const BRANCH_URL = `${API_URL}/chi-nhanh`; // Agent Branch
export const MENU_URL = `${API_URL}/mon-an`;
export const MENU_CATEGORIES_URL = `${API_URL}/loai-mon-an`;
export const RESERVATION_URL = `${API_URL}/dat-ban`;
export const REVIEW_URL = `${API_URL}/danh-gia`;

// Property Service URLs
export const PROPERTY_URL = `${API_URL}/tin-dang`;
export const PROPERTY_TYPE_URL = `${API_URL}/loai-bds`; 