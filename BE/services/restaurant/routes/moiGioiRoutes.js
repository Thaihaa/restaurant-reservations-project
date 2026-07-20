const express = require('express');
const router = express.Router();
const moiGioiController = require('../controllers/moiGioiController');
const { authenticateToken, isAdmin } = require('../../../middlewares/authMiddleware');
const { body } = require('express-validator');

// Validate tạo môi giới
const validateMoiGioi = [
  body('tenMoiGioi')
    .trim()
    .notEmpty()
    .withMessage('Tên môi giới không được để trống'),
  body('diaChi')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ không được để trống'),
  body('dienThoai')
    .trim()
    .notEmpty()
    .withMessage('Số điện thoại không được để trống'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('Số giấy phép kinh doanh không được để trống')
];

// Route đếm số lượng môi giới
router.get('/count', moiGioiController.countMoiGioi);

// Routes công khai
router.get('/', moiGioiController.getAllMoiGioi);
router.get('/gan-day', moiGioiController.getMoiGioiGanDay);
router.get('/:id', moiGioiController.getMoiGioiById);

// Routes yêu cầu xác thực
router.post('/', authenticateToken, isAdmin, validateMoiGioi, moiGioiController.createMoiGioi);
router.put('/:id', authenticateToken, isAdmin, moiGioiController.updateMoiGioi);
router.delete('/:id', authenticateToken, isAdmin, moiGioiController.deleteMoiGioi);

// Route cập nhật đánh giá
router.patch('/:id/rating', authenticateToken, moiGioiController.updateRatingMoiGioi);

module.exports = router;
