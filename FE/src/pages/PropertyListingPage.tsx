import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Box,
  CircularProgress,
  Alert,
  Chip,
  CardActions
} from '@mui/material';
import { Bed as BedIcon, Bathtub as BathtubIcon, Aspect as SizeIcon, LocationOn as LocationIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import * as propertyService from '../../services/propertyService';

interface FilterState {
  keyword: string;
  loaiHinh: string;
  tinhThanh: string;
  giaMin: string;
  giaMax: string;
  dienTichMin: string;
  dienTichMax: string;
}

const PropertyListingPage: React.FC = () => {
  const [properties, setProperties] = useState<propertyService.TinDang[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loaiBDS, setLoaiBDS] = useState<propertyService.LoaiBDS[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    loaiHinh: '',
    tinhThanh: '',
    giaMin: '',
    giaMax: '',
    dienTichMin: '',
    dienTichMax: ''
  });

  useEffect(() => {
    fetchLoaiBDS();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [page, filters]);

  const fetchLoaiBDS = async () => {
    try {
      const response = await propertyService.getAllLoaiBDS();
      setLoaiBDS(response.data);
    } catch (err) {
      console.error('Lỗi tải loại BĐS:', err);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...filters,
        giaMin: filters.giaMin ? parseInt(filters.giaMin) : undefined,
        giaMax: filters.giaMax ? parseInt(filters.giaMax) : undefined,
        dienTichMin: filters.dienTichMin ? parseInt(filters.dienTichMin) : undefined,
        dienTichMax: filters.dienTichMax ? parseInt(filters.dienTichMax) : undefined
      };

      Object.keys(params).forEach(key => !params[key as keyof typeof params] && delete params[key as keyof typeof params]);

      const response = await propertyService.getAllTinDang(params);
      setProperties(response.data);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Lỗi tải danh sách bất động sản');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      loaiHinh: '',
      tinhThanh: '',
      giaMin: '',
      giaMax: '',
      dienTichMin: '',
      dienTichMax: ''
    });
    setPage(1);
  };

  const formatPrice = (price: number) => {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)} tỷ`;
    }
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)} triệu`;
    }
    return price.toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Tìm bất động sản
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tìm kiếm"
              fullWidth
              value={filters.keyword}
              onChange={e => handleFilterChange('keyword', e.target.value)}
              placeholder="Tiêu đề, địa chỉ..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Loại hình</InputLabel>
              <Select
                value={filters.loaiHinh}
                onChange={e => handleFilterChange('loaiHinh', e.target.value)}
                label="Loại hình"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="ban">Bán</MenuItem>
                <MenuItem value="thue">Cho thuê</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tỉnh/Thành"
              fullWidth
              value={filters.tinhThanh}
              onChange={e => handleFilterChange('tinhThanh', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Giá tối thiểu"
              type="number"
              fullWidth
              value={filters.giaMin}
              onChange={e => handleFilterChange('giaMin', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Giá tối đa"
              type="number"
              fullWidth
              value={filters.giaMax}
              onChange={e => handleFilterChange('giaMax', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Diện tích tối thiểu (m²)"
              type="number"
              fullWidth
              value={filters.dienTichMin}
              onChange={e => handleFilterChange('dienTichMin', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Diện tích tối đa (m²)"
              type="number"
              fullWidth
              value={filters.dienTichMax}
              onChange={e => handleFilterChange('dienTichMax', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained">Tìm kiếm</Button>
              <Button variant="outlined" onClick={handleReset}>
                Xóa bộ lọc
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Properties Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : properties.length === 0 ? (
        <Alert severity="info">Không tìm thấy bất động sản phù hợp</Alert>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Tìm thấy {properties.length} kết quả
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {properties.map(property => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Image */}
                  <Box sx={{ position: 'relative', paddingTop: '66.67%', backgroundColor: '#f0f0f0' }}>
                    {property.hinhAnh && property.hinhAnh.length > 0 ? (
                      <CardMedia
                        component="img"
                        image={property.hinhAnh[0]}
                        alt={property.tieuDe}
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#e0e0e0'
                        }}
                      >
                        <Typography color="textSecondary">Không có ảnh</Typography>
                      </Box>
                    )}

                    {/* Badges */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap'
                      }}
                    >
                      {property.noiBat && (
                        <Chip
                          label="Nổi bật"
                          size="small"
                          sx={{ backgroundColor: '#ff6b6b', color: 'white', fontWeight: 'bold' }}
                        />
                      )}
                      <Chip
                        label={property.loaiHinh === 'ban' ? 'Bán' : 'Cho thuê'}
                        size="small"
                        sx={{ backgroundColor: '#4c6ef5', color: 'white' }}
                      />
                    </Box>

                    {/* View count */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '12px'
                      }}
                    >
                      <ViewIcon sx={{ fontSize: '14px' }} />
                      {property.luotXem || 0}
                    </Box>
                  </Box>

                  <CardContent sx={{ flex: 1 }}>
                    {/* Price */}
                    <Typography
                      variant="h6"
                      sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1 }}
                    >
                      {formatPrice(property.gia)}
                      {property.donViGia === 'm2' && '/m²'}
                      {property.donViGia === 'thang' && '/tháng'}
                    </Typography>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {property.tieuDe}
                    </Typography>

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 2 }}>
                      <LocationIcon sx={{ fontSize: '18px', color: '#666', mt: 0.25 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {property.diaChi}
                        {property.quanHuyen && `, ${property.quanHuyen}`}
                        {property.tinhThanh && `, ${property.tinhThanh}`}
                      </Typography>
                    </Box>

                    {/* Details */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      {property.dienTich && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SizeIcon sx={{ fontSize: '18px', color: '#999' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {property.dienTich}m²
                          </Typography>
                        </Box>
                      )}
                      {property.phongNgu ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon sx={{ fontSize: '18px', color: '#999' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {property.phongNgu}
                          </Typography>
                        </Box>
                      ) : null}
                      {property.phongTam ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BathtubIcon sx={{ fontSize: '18px', color: '#999' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {property.phongTam}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>

                    {/* Description */}
                    {property.moTa && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {property.moTa}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/property/${property._id}`}
                      fullWidth
                      variant="contained"
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default PropertyListingPage;
