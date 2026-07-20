const express = require('express');
const router = express.Router();
const tinDangController = require('../controllers/tinDangController');
const thongBaoController = require('../controllers/thongBaoController');
const { authenticateToken, isAdmin } = require('../../../middlewares/authMiddleware');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
};

// Public routes
router.get('/noi-bat', tinDangController.getTinDangNoiBat);
router.get('/moi-nhat', tinDangController.getTinDangMoiNhat);
router.get('/tim-kiem', tinDangController.searchByPriceAndName);
router.get('/', optionalAuth, tinDangController.getAllTinDang);

// Admin routes (must be before /:id)
router.get('/admin/danh-sach', authenticateToken, isAdmin, tinDangController.getAllTinDangAdmin);
router.get('/admin/thong-ke', authenticateToken, isAdmin, tinDangController.getStatisticsTinDang);
router.get('/admin/thong-bao', authenticateToken, isAdmin, thongBaoController.getAdminNotifications);
router.get('/admin/thong-bao/dem', authenticateToken, isAdmin, thongBaoController.getUnreadCount);
router.patch('/admin/thong-bao/doc-tat-ca', authenticateToken, isAdmin, thongBaoController.markAllAsRead);
router.patch('/admin/thong-bao/:id/doc', authenticateToken, isAdmin, thongBaoController.markAsRead);

// User routes (authenticated)
router.get('/cua-toi', authenticateToken, tinDangController.getMyTinDang);
router.get('/thong-bao', authenticateToken, thongBaoController.getUserNotifications);
router.post('/', authenticateToken, tinDangController.createTinDang);

// Dynamic id routes
router.get('/:id', optionalAuth, tinDangController.getTinDangById);
router.put('/:id', authenticateToken, tinDangController.updateTinDang);
router.patch('/:id/duyet', authenticateToken, isAdmin, tinDangController.approveTinDang);
router.patch('/:id/tu-choi', authenticateToken, isAdmin, tinDangController.rejectTinDang);
router.patch('/:id/noi-bat', authenticateToken, isAdmin, tinDangController.toggleNoiBat);
router.patch('/:id/trang-thai', authenticateToken, isAdmin, tinDangController.updateTrangThai);
router.delete('/:id', authenticateToken, isAdmin, tinDangController.deleteTinDang);

module.exports = router;
