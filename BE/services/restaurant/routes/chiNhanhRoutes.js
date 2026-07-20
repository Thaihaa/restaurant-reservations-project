const express = require('express');
const router = express.Router();
const chiNhanhController = require('../controllers/chiNhanhController');
const { authenticateToken, isAdmin, isStaffOrAdmin } = require('../../../middlewares/authMiddleware');
const { body } = require('express-validator');

// Validate tạo chi nhánh
const validateChiNhanh = [
  body('maChiNhanh')
    .trim()
    .notEmpty()
    .withMessage('Mã chi nhánh không được để trống'),
  body('moiGioi')
    .notEmpty()
    .withMessage('Môi giới không được để trống'),
  body('tenChiNhanh')
    .trim()
    .notEmpty()
    .withMessage('Tên chi nhánh không được để trống'),
  body('diaChi')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ không được để trống'),
  body('dienThoai')
    .trim()
    .notEmpty()
    .withMessage('Số điện thoại không được để trống')
];

// Middleware kiểm tra quyền
const isStaffOrAdminCheck = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Truy cập bị từ chối. Bạn cần quyền admin hoặc nhân viên!'
    });
  }
};

// Route kiểm tra tính khả dụng
router.get('/check-availability', chiNhanhController.checkChiNhanhAvailability);

// Routes công khai với xác thực
router.get('/', authenticateToken, chiNhanhController.getAllChiNhanh);
router.get('/:id', authenticateToken, chiNhanhController.getChiNhanhById);

// Lấy chi nhánh theo môi giới
router.get('/by-moigioi/:moiGioiId', authenticateToken, chiNhanhController.getChiNhanhByMoiGioi);

// Đếm chi nhánh theo môi giới
router.get('/count/:moiGioiId', authenticateToken, chiNhanhController.countChiNhanhByMoiGioi);

// Routes yêu cầu quyền admin hoặc nhân viên
router.post('/', authenticateToken, isStaffOrAdminCheck, validateChiNhanh, chiNhanhController.createChiNhanh);
router.put('/:id', authenticateToken, isStaffOrAdminCheck, chiNhanhController.updateChiNhanh);
router.patch('/:id/status', authenticateToken, isStaffOrAdminCheck, chiNhanhController.updateStatusChiNhanh);
router.delete('/:id', authenticateToken, isAdmin, chiNhanhController.deleteChiNhanh);

module.exports = router;
