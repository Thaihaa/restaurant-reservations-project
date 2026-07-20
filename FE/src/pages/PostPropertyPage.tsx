import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import * as propertyService from '../../services/propertyService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PostPropertyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loaiBDS, setLoaiBDS] = useState<propertyService.LoaiBDS[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const [formData, setFormData] = useState<propertyService.TinDang>({
    tieuDe: '',
    moTa: '',
    gia: 0,
    donViGia: 'tong',
    dienTich: 0,
    phongNgu: 0,
    phongTam: 0,
    huongNha: '',
    diaChi: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    loaiHinh: 'ban',
    loaiBDS: '',
    hinhAnh: [],
    lienHe: {
      hoTen: '',
      soDienThoai: '',
      email: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    fetchLoaiBDS();
  }, [user, navigate]);

  const fetchLoaiBDS = async () => {
    try {
      const response = await propertyService.getAllLoaiBDS({ loaiHinh: formData.loaiHinh });
      setLoaiBDS(response.data);
    } catch (err) {
      console.error('Lỗi tải loại BĐS:', err);
    }
  };

  useEffect(() => {
    fetchLoaiBDS();
  }, [formData.loaiHinh]);

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages(prev => [...prev, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tieuDe || !formData.gia || !formData.diaChi) {
      setError('Vui lòng nhập tiêu đề, giá và địa chỉ');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        hinhAnh: images,
        gia: parseInt(formData.gia.toString())
      };

      const response = await propertyService.createTinDang(submitData);
      setSuccess('Đăng tin bất động sản thành công! Tin đang chờ duyệt');
      
      // Reset form
      setFormData({
        tieuDe: '',
        moTa: '',
        gia: 0,
        donViGia: 'tong',
        dienTich: 0,
        phongNgu: 0,
        phongTam: 0,
        huongNha: '',
        diaChi: '',
        tinhThanh: '',
        quanHuyen: '',
        phuongXa: '',
        loaiHinh: 'ban',
        loaiBDS: '',
        hinhAnh: [],
        lienHe: {
          hoTen: '',
          soDienThoai: '',
          email: ''
        }
      });
      setImages([]);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng tin bất động sản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Đăng tin bất động sản
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Tiêu đề tin đăng"
                fullWidth
                required
                value={formData.tieuDe}
                onChange={e => handleChange('tieuDe', e.target.value)}
                placeholder="VD: Bán nhà 3 tầng tại Hà Nội"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mô tả chi tiết"
                fullWidth
                multiline
                rows={4}
                value={formData.moTa}
                onChange={e => handleChange('moTa', e.target.value)}
                placeholder="Mô tả thêm về bất động sản..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth required>
                <InputLabel>Loại hình</InputLabel>
                <Select
                  value={formData.loaiHinh}
                  onChange={e => handleChange('loaiHinh', e.target.value)}
                  label="Loại hình"
                >
                  <MenuItem value="ban">Bán</MenuItem>
                  <MenuItem value="thue">Cho thuê</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Loại BĐS</InputLabel>
                <Select
                  value={formData.loaiBDS}
                  onChange={e => handleChange('loaiBDS', e.target.value)}
                  label="Loại BĐS"
                >
                  <MenuItem value="">Chọn loại</MenuItem>
                  {loaiBDS.map(loai => (
                    <MenuItem key={loai._id} value={loai._id}>
                      {loai.tenLoai}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Giá"
                type="number"
                fullWidth
                required
                value={formData.gia}
                onChange={e => handleChange('gia', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Đơn vị giá</InputLabel>
                <Select
                  value={formData.donViGia}
                  onChange={e => handleChange('donViGia', e.target.value)}
                  label="Đơn vị giá"
                >
                  <MenuItem value="tong">Tổng cộng</MenuItem>
                  <MenuItem value="m2">Trên m²</MenuItem>
                  <MenuItem value="thang">Trên tháng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Thông tin chi tiết */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Thông tin chi tiết
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Diện tích (m²)"
                type="number"
                fullWidth
                value={formData.dienTich || ''}
                onChange={e => handleChange('dienTich', parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Phòng ngủ"
                type="number"
                fullWidth
                value={formData.phongNgu || 0}
                onChange={e => handleChange('phongNgu', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Phòng tắm"
                type="number"
                fullWidth
                value={formData.phongTam || 0}
                onChange={e => handleChange('phongTam', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Hướng nhà"
                fullWidth
                value={formData.huongNha || ''}
                onChange={e => handleChange('huongNha', e.target.value)}
                placeholder="VD: Đông, Tây, Nam, Bắc"
              />
            </Grid>

            {/* Địa chỉ */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Địa chỉ
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Địa chỉ chi tiết"
                fullWidth
                required
                value={formData.diaChi}
                onChange={e => handleChange('diaChi', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Tỉnh/Thành phố"
                fullWidth
                value={formData.tinhThanh || ''}
                onChange={e => handleChange('tinhThanh', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Quận/Huyện"
                fullWidth
                value={formData.quanHuyen || ''}
                onChange={e => handleChange('quanHuyen', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phường/Xã"
                fullWidth
                value={formData.phuongXa || ''}
                onChange={e => handleChange('phuongXa', e.target.value)}
              />
            </Grid>

            {/* Hình ảnh */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Hình ảnh
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="URL hình ảnh"
                  fullWidth
                  value={imageInput}
                  onChange={e => setImageInput(e.target.value)}
                  placeholder="Nhập đường dẫn URL hình ảnh"
                />
                <Button
                  variant="contained"
                  onClick={handleAddImage}
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Thêm
                </Button>
              </Box>

              {images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hình ảnh đã thêm ({images.length}):
                  </Typography>
                  {images.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        mb: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ wordBreak: 'break-all', flex: 1 }}>
                        {img}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Xóa
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Liên hệ */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Thông tin liên hệ
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Họ tên"
                fullWidth
                value={formData.lienHe?.hoTen || ''}
                onChange={e => handleChange('lienHe.hoTen', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Số điện thoại"
                fullWidth
                value={formData.lienHe?.soDienThoai || ''}
                onChange={e => handleChange('lienHe.soDienThoai', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.lienHe?.email || ''}
                onChange={e => handleChange('lienHe.email', e.target.value)}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Đăng tin'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PostPropertyPage;
