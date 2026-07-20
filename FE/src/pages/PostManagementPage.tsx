import React, { useState } from 'react';
import { Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const initialPosts = [
  { title: 'Căn hộ cao cấp tại Thủ Đức', type: 'Bán', date: '16/07/2026', status: 'Đang hiển thị', views: 126 },
  { title: 'Nhà phố hiện đại Quận 7', type: 'Bán', date: '14/07/2026', status: 'Chờ duyệt', views: 48 },
  { title: 'Cho thuê căn hộ 2 phòng ngủ', type: 'Cho thuê', date: '10/07/2026', status: 'Đã hết hạn', views: 83 }
];

const PostManagementPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Bán');
  const addPost = () => { if (!title.trim()) return; setPosts([{ title, type, date: new Date().toLocaleDateString('vi-VN'), status: 'Chờ duyệt', views: 0 }, ...posts]); setTitle(''); setOpen(false); };
  return <Box sx={{ bgcolor: '#f7f7f7', minHeight: 'calc(100vh - 72px)', py: 4 }}><Container maxWidth="lg"><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={3}><Box><Typography variant="h4" fontWeight={700}>Quản lý tin đăng</Typography><Typography color="text.secondary" mt={.5}>Theo dõi và cập nhật các bất động sản bạn đang đăng bán.</Typography></Box><Button onClick={() => setOpen(true)} variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#e53935', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#c62828' } }}>Đăng tin mới</Button></Stack><Paper sx={{ overflow: 'hidden' }}><Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '3fr 1fr 1.1fr 1.1fr .7fr', p: 2, bgcolor: '#fafafa', color: 'text.secondary', fontSize: 13, fontWeight: 700 }}><Box>Thông tin tin đăng</Box><Box>Loại tin</Box><Box>Ngày đăng</Box><Box>Trạng thái</Box><Box>Lượt xem</Box></Box>{posts.map((post) => <Box key={`${post.title}-${post.date}`} sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '3fr 1fr 1.1fr 1.1fr .7fr', alignItems: 'center', p: 2, borderTop: '1px solid #eee', gap: 1.5 }}><Box><Typography fontWeight={700}>{post.title}</Typography><Button size="small" startIcon={<EditOutlinedIcon />} sx={{ p: 0, mt: .5, color: '#e53935', textTransform: 'none' }}>Chỉnh sửa</Button></Box><Typography variant="body2">{post.type}</Typography><Typography variant="body2">{post.date}</Typography><Chip label={post.status} size="small" color={post.status === 'Đang hiển thị' ? 'success' : post.status === 'Chờ duyệt' ? 'warning' : 'default'} sx={{ width: 'fit-content' }} /><Typography variant="body2">{post.views}</Typography></Box>)}</Paper></Container><Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Đăng tin bất động sản</DialogTitle><DialogContent><Stack spacing={2} mt={1}><TextField autoFocus label="Tiêu đề tin đăng" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Căn hộ 2 phòng ngủ tại Thủ Đức" fullWidth /><TextField select label="Nhu cầu" value={type} onChange={(e) => setType(e.target.value)}><MenuItem value="Bán">Bán</MenuItem><MenuItem value="Cho thuê">Cho thuê</MenuItem></TextField><TextField label="Giá bất động sản" placeholder="Ví dụ: 3,5 tỷ" fullWidth /></Stack></DialogContent><DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setOpen(false)} color="inherit">Hủy</Button><Button onClick={addPost} variant="contained" sx={{ bgcolor: '#e53935' }}>Lưu tin đăng</Button></DialogActions></Dialog></Box>;
};
export default PostManagementPage;
