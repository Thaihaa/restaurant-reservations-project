import React from 'react';
import { Box, Button, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BathroomOutlinedIcon from '@mui/icons-material/BathroomOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { featuredProperties } from '../data/featuredProperties';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams();
  const property = featuredProperties.find((item) => item.id === id);
  if (!property) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography variant="h5" fontWeight={700}>Không tìm thấy bất động sản</Typography><Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>Về trang chủ</Button></Container>;
  const facts = [[<SquareFootOutlinedIcon />, `${property.area} m²`], [<BedOutlinedIcon />, `${property.bedrooms} phòng ngủ`], [<BathroomOutlinedIcon />, `${property.bathrooms} phòng tắm`]];
  return <Box sx={{ bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}><Container maxWidth="lg">
    <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2, color: '#455a64' }}>Quay lại danh sách</Button>
    <Grid container spacing={3}><Grid item xs={12} md={8}><Paper sx={{ overflow: 'hidden' }}>
      <Box component="img" src={property.image} alt={property.title} sx={{ display: 'block', width: '100%', height: { xs: 260, md: 440 }, objectFit: 'cover' }} />
      <Box sx={{ p: { xs: 2, md: 3 } }}><Chip label="TIN VIP" size="small" sx={{ bgcolor: '#f4a624', color: '#fff', fontWeight: 700, mb: 1.5 }} />
        <Typography component="h1" variant="h4" fontWeight={700}>{property.title}</Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: .5, color: 'text.secondary', mt: 1 }}><LocationOnOutlinedIcon fontSize="small" />{property.address}</Typography>
        <Typography color="#e53935" fontSize={26} fontWeight={700} mt={2}>{property.price} · {property.area} m²</Typography>
        <Grid container spacing={1.5} sx={{ my: 2.5 }}>{facts.map(([icon, label]) => <Grid item xs={12} sm={4} key={label as string}><Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1.2, border: '1px solid #e0e0e0', borderRadius: 1.5, color: '#455a64' }}>{icon}<Typography fontSize={14}>{label}</Typography></Box></Grid>)}</Grid>
        <Typography variant="h6" fontWeight={700} mb={1}>Thông tin chi tiết</Typography><Typography color="text.secondary" lineHeight={1.75}>{property.description}</Typography>
        <Typography variant="h6" fontWeight={700} mt={3} mb={1.25}>Tiện ích nổi bật</Typography><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{property.features.map((feature) => <Chip key={feature} label={feature} variant="outlined" />)}</Box>
      </Box></Paper></Grid>
      <Grid item xs={12} md={4}><Paper sx={{ p: 2.5, position: { md: 'sticky' }, top: 20 }}><Typography fontWeight={700} fontSize={18}>Liên hệ tư vấn</Typography><Typography color="text.secondary" fontSize={14} mt={.75}>Để lại thông tin để nhận tư vấn và đặt lịch xem nhà.</Typography><Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#e53935', '&:hover': { bgcolor: '#c62828' } }}>Liên hệ ngay</Button><Button fullWidth variant="outlined" sx={{ mt: 1.25, borderColor: '#e53935', color: '#e53935' }}>Đặt lịch xem nhà</Button></Paper></Grid>
    </Grid></Container></Box>;
};

export default PropertyDetailPage;
