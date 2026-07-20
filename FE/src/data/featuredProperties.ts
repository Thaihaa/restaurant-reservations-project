export interface FeaturedProperty {
  id: string;
  title: string;
  image: string;
  price: string;
  area: number;
  location: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
}

export const featuredProperties: FeaturedProperty[] = [
  { id: 'can-ho-2-phong-ngu-gan-trung-tam', title: 'Căn hộ 2 phòng ngủ, gần trung tâm', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', price: '18 triệu/m²', area: 65, location: 'TP. Hồ Chí Minh', address: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', type: 'Căn hộ', bedrooms: 2, bathrooms: 2, description: 'Căn hộ thiết kế hiện đại, đón nhiều ánh sáng tự nhiên và chỉ vài phút di chuyển đến trung tâm thành phố. Không gian sống yên tĩnh, phù hợp cho gia đình nhỏ hoặc người làm việc tại Quận 1.', features: ['Nội thất đầy đủ', 'Ban công thoáng', 'Bảo vệ 24/7', 'Gần trường học và siêu thị'] },
  { id: 'nha-pho-khu-do-thi-khep-kin', title: 'Nhà phố khu đô thị khép kín', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', price: '3,2 tỷ', area: 70, location: 'TP. Hồ Chí Minh', address: 'Khu đô thị An Phú, TP. Thủ Đức, TP. Hồ Chí Minh', type: 'Nhà phố', bedrooms: 3, bathrooms: 3, description: 'Nhà phố mới xây trong khu đô thị khép kín, an ninh và hạ tầng đồng bộ. Căn nhà có sân trước, phòng khách rộng và các phòng ngủ được bố trí riêng tư.', features: ['Sổ hồng riêng', 'Đường nội khu 12 m', 'Có chỗ đậu ô tô', 'Khu dân cư văn minh'] },
  { id: 'can-ho-view-song-noi-that-day-du', title: 'Căn hộ view sông, nội thất đầy đủ', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85', price: '18 triệu/m²', area: 75, location: 'TP. Hồ Chí Minh', address: 'Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh', type: 'Căn hộ', bedrooms: 2, bathrooms: 2, description: 'Căn hộ có tầm nhìn thoáng ra sông, được trang bị nội thất chỉn chu. Cư dân sử dụng hệ tiện ích nội khu như hồ bơi, phòng gym và khu vui chơi trẻ em.', features: ['View sông', 'Hồ bơi', 'Phòng gym', 'Nội thất cao cấp'] },
  { id: 'chinh-chu-ban-nha-moi-xay', title: 'Chính chủ bán nhà mới xây', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85', price: '3,2 tỷ', area: 80, location: 'TP. Hồ Chí Minh', address: 'Phường Hiệp Bình Chánh, TP. Thủ Đức, TP. Hồ Chí Minh', type: 'Nhà riêng', bedrooms: 3, bathrooms: 3, description: 'Nhà mới xây hoàn thiện, pháp lý rõ ràng và có thể nhận nhà ngay. Thiết kế tối ưu công năng với phòng khách, bếp, ba phòng ngủ và sân thượng.', features: ['Nhà mới hoàn thiện', 'Pháp lý đầy đủ', 'Sân thượng', 'Gần chợ và trường học'] },
];
