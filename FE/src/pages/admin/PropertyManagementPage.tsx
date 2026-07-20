import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon, Star as StarIcon } from '@mui/icons-material';
import * as propertyService from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';

interface TinDang extends propertyService.TinDang {
  _id: string;
  createdAt: string;
}

interface Statistics {
  total: number;
  dangHienThi: number;
  choDuyet: number;
  hetHan: number;
  daBan: number;
  nhap: number;
  noiBat: number;
  ban: number;
  thue: number;
}

const PropertyManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [tinDangs, setTinDangs] = useState<TinDang[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [filters, setFilters] = useState({
    keyword: '',
    trangThai: '',
    loaiHinh: '',
    tinhThanh: '',
    giaMin: '',
    giaMax: '',
    limit: 20
  });

  const [selectedTin, setSelectedTin] = useState<TinDang | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        giaMin: filters.giaMin ? parseInt(filters.giaMin) : undefined,
        giaMax: filters.giaMax ? parseInt(filters.giaMax) : undefined
      };
      Object.keys(params).forEach(key => !params[key as keyof typeof params] && delete params[key as keyof typeof params]);

      const response = await propertyService.getAllTinDangAdmin(params);
      setTinDangs(response.data);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Lỗi tải dữ liệu tin đăng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await propertyService.getStatisticsTinDang();
      setStats(response.data);
    } catch (err) {
      console.error('Lỗi tải thống kê:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = () => {
    setPage(1);
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleApprove = async (id: string) => {
    try {
      await propertyService.approveTinDang(id);
      setSuccess('Duyệt tin đăng thành công');
      fetchData();
      fetchStats();
    } catch (err) {
      setError('Lỗi duyệt tin đăng');
    }
  };

  const handleReject = async () => {
    if (!selectedTin) return;
    try {
      await propertyService.rejectTinDang(selectedTin._id, rejectReason);
      setSuccess('Từ chối tin đăng thành công');
      setOpenRejectDialog(false);
      setRejectReason('');
      fetchData();
      fetchStats();
    } catch (err) {
      setError('Lỗi từ chối tin đăng');
    }
  };

  const handleToggleNoiBat = async (id: string) => {
    try {
      await propertyService.toggleNoiBat(id);
      setSuccess('Cập nhật tin nổi bật thành công');
      fetchData();
    } catch (err) {
      setError('Lỗi cập nhật tin nổi bật');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin đăng này?')) return;
    try {
      await propertyService.deleteTinDang(id);
      setSuccess('Xóa tin đăng thành công');
      fetchData();
      fetchStats();
    } catch (err) {
      setError('Lỗi xóa tin đăng');
    }
  };

  const getTrangThaiColor = (trangThai: string) => {
    switch (trangThai) {
      case 'dang_hien_thi':
        return 'success';
      case 'cho_duyet':
        return 'warning';
      case 'het_han':
        return 'error';
      case 'da_ban':
        return 'info';
      default:
        return 'default';
    }
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

  if (!user || user.role !== 'admin') {
    return <Alert severity="error">Bạn không có quyền truy cập trang này</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Quản lý tin đăng bất động sản
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

      {/* Statistics */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Tổng cộng
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Đang hiển thị
                </Typography>
                <Typography variant="h5" sx={{ color: 'success.main' }}>
                  {stats.dangHienThi}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Chờ duyệt
                </Typography>
                <Typography variant="h5" sx={{ color: 'warning.main' }}>
                  {stats.choDuyet}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Nổi bật
                </Typography>
                <Typography variant="h5" sx={{ color: 'warning.main' }}>
                  {stats.noiBat}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Đã bán
                </Typography>
                <Typography variant="h5" sx={{ color: 'info.main' }}>
                  {stats.daBan}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography color="textSecondary" gutterBottom>
                  Hết hạn
                </Typography>
                <Typography variant="h5" sx={{ color: 'error.main' }}>
                  {stats.hetHan}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tìm kiếm"
              fullWidth
              value={filters.keyword}
              onChange={e => handleFilterChange('keyword', e.target.value)}
              placeholder="Tiêu đề, mô tả, địa chỉ..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filters.trangThai}
                onChange={e => handleFilterChange('trangThai', e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="cho_duyet">Chờ duyệt</MenuItem>
                <MenuItem value="dang_hien_thi">Đang hiển thị</MenuItem>
                <MenuItem value="het_han">Hết hạn</MenuItem>
                <MenuItem value="da_ban">Đã bán</MenuItem>
                <MenuItem value="nhap">Nháp</MenuItem>
              </Select>
            </FormControl>
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
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Giá tối thiểu"
              type="number"
              fullWidth
              value={filters.giaMin}
              onChange={e => handleFilterChange('giaMin', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Giá tối đa"
              type="number"
              fullWidth
              value={filters.giaMax}
              onChange={e => handleFilterChange('giaMax', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Giá
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loại hình</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Lượt xem</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tinDangs.map(tin => (
                <TableRow key={tin._id} hover>
                  <TableCell>{tin.tieuDe}</TableCell>
                  <TableCell align="right">{formatPrice(tin.gia)}</TableCell>
                  <TableCell>{tin.diaChi}</TableCell>
                  <TableCell>
                    <Chip
                      label={tin.loaiHinh === 'ban' ? 'Bán' : 'Cho thuê'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={propertyService.TRANG_THAI_LABELS[tin.trangThai || 'nhap']}
                      size="small"
                      color={getTrangThaiColor(tin.trangThai || 'nhap')}
                    />
                  </TableCell>
                  <TableCell>{tin.luotXem || 0}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {tin.trangThai === 'cho_duyet' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApprove(tin._id)}
                            title="Duyệt"
                          >
                            <ApproveIcon fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedTin(tin);
                              setOpenRejectDialog(true);
                            }}
                            title="Từ chối"
                          >
                            <RejectIcon fontSize="small" />
                          </Button>
                        </>
                      )}
                      {tin.trangThai === 'dang_hien_thi' && (
                        <Button
                          size="small"
                          color={tin.noiBat ? 'warning' : 'default'}
                          onClick={() => handleToggleNoiBat(tin._id)}
                          title={tin.noiBat ? 'Bỏ nổi bật' : 'Làm nổi bật'}
                        >
                          <StarIcon fontSize="small" />
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(tin._id)}
                        title="Xóa"
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Từ chối tin đăng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do từ chối"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Hủy</Button>
          <Button onClick={handleReject} variant="contained" color="error">
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyManagementPage;
