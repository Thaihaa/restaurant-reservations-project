import React from 'react';
import { Box, Container, Grid, IconButton, Link, Typography } from '@mui/material';

const SocialIcon = ({ network }: { network: 'facebook' | 'tiktok' | 'zalo' }) => {
  if (network === 'facebook') return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.4v8h3.1Z" /></svg>;
  if (network === 'tiktok') return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M16.6 5.2a4.5 4.5 0 0 1-2.8-2.6h-2.7v12.1a2.2 2.2 0 1 1-1.5-2.1V9.8a5 5 0 1 0 4.3 5V8.7a7.2 7.2 0 0 0 4.2 1.3V7.3a4.5 4.5 0 0 1-1.5-.1Z" /></svg>;
  return <Box component="span" sx={{ fontSize: 10, fontWeight: 900, letterSpacing: -.6, lineHeight: 1 }}>Zalo</Box>;
};

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: '#f7f7f7', borderTop: '1px solid #eee', py: 4 }}>
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Typography fontWeight={800} color="#e53935" fontSize={20}>Bất động sản</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Nền tảng đăng tin, tìm kiếm và quản lý bất động sản hiệu quả.</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography fontWeight={700} mb={1}>Khám phá</Typography>
          <Link href="/mua-ban" display="block" color="inherit" underline="hover">Nhà đất bán</Link>
          <Link href="/cho-thue" display="block" color="inherit" underline="hover">Nhà đất cho thuê</Link>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography fontWeight={700} mb={1}>Hỗ trợ</Typography>
              <Typography variant="body2">Hotline: 1900 0000</Typography>
              <Typography variant="body2">Email: support@batdongsan.local</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton component="a" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" sx={{ width: 34, height: 34, bgcolor: '#1877f2', color: '#fff', '&:hover': { bgcolor: '#0d65d9' } }}><SocialIcon network="facebook" /></IconButton>
              <IconButton component="a" href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" sx={{ width: 34, height: 34, bgcolor: '#161616', color: '#fff', '&:hover': { bgcolor: '#000' } }}><SocialIcon network="tiktok" /></IconButton>
              <IconButton component="a" href="https://zalo.me/" target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo" sx={{ width: 34, height: 34, bgcolor: '#0068ff', color: '#fff', '&:hover': { bgcolor: '#0057d6' } }}><SocialIcon network="zalo" /></IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary" display="block" mt={4}>© 2026 Bất động sản. All rights reserved.</Typography>
    </Container>
  </Box>
);

export default Footer;
