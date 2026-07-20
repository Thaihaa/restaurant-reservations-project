import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Divider, Grid, InputBase, Paper, Tab, Tabs, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { useNavigate } from 'react-router-dom';
import { featuredProperties } from '../data/featuredProperties';

const propertyImages = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=600&q=80'
];

const propertyTitles = ['Căn hộ 2 phòng ngủ, gần trung tâm', 'Nhà phố khu đô thị khép kín', 'Căn hộ view sông, nội thất đầy đủ', 'Chính chủ bán nhà mới xây', 'Biệt thự sân vườn yên tĩnh', 'Căn hộ 3 phòng ngủ, giá tốt', 'Nhà phố góc hai mặt tiền', 'Căn hộ cao tầng, đón gió'];
const news = ['Lãi suất cố định sắp kết thúc, có nên chuyển đổi khoản vay mua nhà?', 'Thị trường bất động sản đón sóng đầu tư mới', 'Quy hoạch và hạ tầng định hình giá trị bất động sản', 'Xu hướng căn hộ hạng sang tại TP.HCM', 'Môi giới thích ứng với dòng tiền thận trọng'];
const projectCards = [
  ['Khu đô thị ven sông An Phú', 'Bình Dương', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80'],
  ['The Royal Garden', 'Quận 7, Hồ Chí Minh', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80'],
  ['Central Park Residence', 'TP. Thủ Đức, Hồ Chí Minh', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=700&q=80'],
  ['Ecolife Riverside', 'Long An', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80']
];
const places = [
  ['TP. Hồ Chí Minh', '48.000+ tin đăng', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'],
  ['Hà Nội', '25.000+ tin đăng', 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=700&q=80'],
  ['Đà Nẵng', '8.500+ tin đăng', 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=700&q=80'],
  ['Bình Dương', '7.200+ tin đăng', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=80'],
  ['Đồng Nai', '5.900+ tin đăng', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=700&q=80']
];

const SectionHeader = ({ title, more = true }: { title: string; more?: boolean }) => <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.25 }}><Typography component="h2" sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 700 }}>{title}</Typography>{more && <Button endIcon={<ArrowForwardIcon />} sx={{ color: '#e53935', textTransform: 'none', fontSize: 13 }}>Xem thêm</Button>}</Box>;

const HomePage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const cleanups = featuredProperties.map((property) => {
      const image = document.querySelector(`img[src*="${property.image.split('?')[0].split('/').pop()}"]`);
      const card = image?.closest('.MuiPaper-root') as HTMLElement | null;
      if (!card) return undefined;
      const openDetail = () => navigate(`/bat-dong-san/${property.id}`);
      const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDetail(); } };
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', openDetail);
      card.addEventListener('keydown', onKeyDown);
      return () => { card.removeEventListener('click', openDetail); card.removeEventListener('keydown', onKeyDown); };
    });
    return () => cleanups.forEach((cleanup) => cleanup?.());
  }, [navigate]);
  const onSearch = () => alert(keyword ? `Đang tìm kiếm: ${keyword}` : 'Hãy nhập khu vực hoặc loại bất động sản');
  return <Box sx={{ bgcolor: '#fff', color: '#2c2c2c' }}>
    <Box sx={{ height: { xs: 300, md: 520 }, bgcolor: '#fafafa', pt: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ width: { xs: 'calc(100% - 32px)', sm: 620 }, mx: 'auto', p: 2.25, bgcolor: '#5b5b5b', borderRadius: 2.5 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="fullWidth" sx={{ minHeight: 34, mb: 1.75, borderBottom: '1px solid #8b8b8b', '& .MuiTab-root': { minHeight: 34, py: 0, color: '#ddd', textTransform: 'none', fontSize: 13, fontWeight: 700 }, '& .Mui-selected': { color: '#fff !important' }, '& .MuiTabs-indicator': { backgroundColor: '#ef3d36', height: 2 } }}><Tab label="Mua bán" /><Tab label="Cho thuê" /><Tab label="Dự án" /></Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center', p: .5, bgcolor: '#fff', borderRadius: 1 }}><SearchIcon sx={{ ml: 1, color: '#415266' }} /><InputBase value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch()} placeholder={tab === 0 ? 'Nhà chung cư 2 tỷ' : tab === 1 ? 'Tìm nhà đất cho thuê' : 'Tìm dự án phù hợp'} sx={{ flex: 1, ml: 1, fontSize: 13 }} /><Button onClick={onSearch} variant="contained" sx={{ bgcolor: '#ef3d36', fontWeight: 700, fontSize: 12, py: .65, '&:hover': { bgcolor: '#c62828' } }}>Tìm kiếm</Button></Box>
      </Paper>
    </Box>

    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Box sx={{ maxWidth: 850, mx: 'auto', mb: 9 }}><SectionHeader title="Tin tức bất động sản" /><Grid container spacing={3}><Grid item xs={12} sm={6}><Box component="img" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80" alt="Tin tức bất động sản" sx={{ display: 'block', width: '100%', height: 215, objectFit: 'cover', borderRadius: 1 }} /><Typography fontWeight={700} fontSize={18} lineHeight={1.35} mt={1.3}>Thị trường bất động sản: Những tín hiệu đáng chú ý trong quý mới</Typography><Typography variant="caption" color="text.secondary">◷ 2 ngày trước</Typography></Grid><Grid item xs={12} sm={6}>{news.map((item, index) => <Box key={item}><Typography sx={{ py: index ? 1.15 : 0, pb: 1.15, fontSize: 14, lineHeight: 1.45 }}>{item}</Typography>{index < news.length - 1 && <Divider />}</Box>)}</Grid></Grid></Box>

      <Box sx={{ mb: 9 }}><SectionHeader title="Bất động sản dành cho bạn" /><Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}><Typography fontSize={14} fontWeight={700}>Tin nhà đất bán mới nhất</Typography><Typography fontSize={14} color="text.secondary">|</Typography><Typography fontSize={14} color="text.secondary">Tin nhà đất cho thuê mới nhất</Typography></Box><Grid container spacing={2}>{propertyTitles.map((title, index) => <Grid item xs={12} sm={6} md={3} key={title}><Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden', borderRadius: 1.5, transition: '.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}><Box sx={{ position: 'relative' }}><Box component="img" src={propertyImages[index]} alt={title} sx={{ display: 'block', width: '100%', height: 145, objectFit: 'cover' }} /><Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: '#f4a624', color: '#fff', fontWeight: 700, fontSize: 10, px: .7, py: .2, borderRadius: .5 }}>VIP</Box></Box><Box sx={{ p: 1.4 }}><Typography noWrap fontWeight={700} fontSize={14}>{title}</Typography><Typography color="#e53935" fontWeight={700} fontSize={14} mt={.6}>{index % 2 ? '3,2 tỷ' : '18 triệu/m²'} · {65 + index * 5} m²</Typography><Typography noWrap color="text.secondary" fontSize={12} mt={.6}><LocationOnOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'text-bottom' }} /> TP. Hồ Chí Minh</Typography><Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.1, color: 'text.secondary' }}><Typography fontSize={10}>Đăng hôm nay</Typography><FavoriteBorderIcon sx={{ fontSize: 16 }} /></Box></Box></Paper></Grid>)}</Grid><Box textAlign="center" mt={3}><Button variant="outlined" sx={{ borderColor: '#ddd', color: '#444', textTransform: 'none' }}>Mở rộng⌄</Button></Box></Box>

      <Box sx={{ mb: 9 }}><SectionHeader title="Dự án bất động sản nổi bật" /><Grid container spacing={2}>{projectCards.map(([name, location, image]) => <Grid item xs={12} sm={6} md={3} key={name}><Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1.5 }}><Box component="img" src={image} alt={name} sx={{ width: '100%', height: 145, objectFit: 'cover', display: 'block' }} /><Box p={1.4}><Typography color="#1c9b55" fontSize={11} fontWeight={700}>Đang mở bán</Typography><Typography fontSize={14} fontWeight={700} noWrap>{name}</Typography><Typography fontSize={12} color="text.secondary" mt={.5}>{location}</Typography></Box></Paper></Grid>)}</Grid></Box>

      <Box sx={{ mb: 9 }}><SectionHeader title="Bất động sản theo địa điểm" more={false} /><Grid container spacing={1.5}>{places.map(([name, count, image], index) => <Grid item xs={12} sm={index === 0 ? 7 : 5} md={index === 0 ? 6 : 3} key={name}><Box sx={{ height: index === 0 ? { xs: 200, md: 250 } : { xs: 150, md: 118 }, position: 'relative', overflow: 'hidden', borderRadius: 1.5, color: '#fff' }}><Box component="img" src={image} alt={name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(.72)' }} /><Box sx={{ position: 'absolute', inset: 0, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(transparent, rgba(0,0,0,.5))' }}><Typography fontWeight={700}>{name}</Typography><Typography fontSize={12}>{count}</Typography></Box></Box></Grid>)}</Grid></Box>

      <Box sx={{ mb: 8 }}><SectionHeader title="Tiêu điểm" more={false} /><Grid container spacing={2}>{news.slice(0, 3).map((item, index) => <Grid item xs={12} md={4} key={item}><Box sx={{ display: 'flex', gap: 1.5 }}><Typography color="#e53935" fontWeight={800} fontSize={28}>0{index + 1}</Typography><Box><Typography fontWeight={700} fontSize={14}>{item}</Typography><Typography fontSize={12} color="text.secondary" mt={.5}>Thông tin, phân tích và góc nhìn thị trường mới nhất.</Typography></Box></Box></Grid>)}</Grid></Box>

      <Box sx={{ mb: 5 }}><SectionHeader title="Hỗ trợ tiện ích" more={false} /><Grid container spacing={2}>{[[HomeWorkOutlinedIcon, 'Xem xu hướng giá nhà'], [CalculateOutlinedIcon, 'Chi phí làm nhà'], [AccountBalanceWalletOutlinedIcon, 'Tính lãi suất'], [WbSunnyOutlinedIcon, 'Tư vấn phong thủy']].map(([Icon, label]) => { const UtilityIcon = Icon as typeof HomeWorkOutlinedIcon; return <Grid item xs={6} md={3} key={label as string}><Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, height: '100%' }}><UtilityIcon sx={{ color: '#ef3d36' }} /><Typography fontSize={13} fontWeight={600}>{label as string}</Typography></Paper></Grid>; })}</Grid></Box>
    </Container>
    <Button aria-label="Nhắn tin" sx={{ position: 'fixed', zIndex: 4, right: 26, bottom: 26, minWidth: 46, width: 46, height: 46, borderRadius: '50%', color: '#fff', bgcolor: '#ef3d36', boxShadow: 3, '&:hover': { bgcolor: '#c62828' } }}><ChatBubbleIcon /></Button>
  </Box>;
};
export default HomePage;
