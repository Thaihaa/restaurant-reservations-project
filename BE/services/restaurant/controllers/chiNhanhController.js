const ChiNhanh = require('../models/Ban'); // Model đã được rename thành ChiNhanh
const logger = require('../../../utils/logger');

// Lấy danh sách chi nhánh
exports.getAllChiNhanh = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Lọc theo môi giới
    if (req.query.moiGioi) {
      filter.moiGioi = req.query.moiGioi;
    }

    // Lọc theo trạng thái
    if (req.query.trangThai && ['Hoạt động', 'Tạm dừng', 'Bảo trì'].includes(req.query.trangThai)) {
      filter.trangThai = req.query.trangThai;
    }

    // Tìm kiếm theo từ khóa
    if (req.query.keyword) {
      filter.$or = [
        { tenChiNhanh: { $regex: req.query.keyword, $options: 'i' } },
        { diaChi: { $regex: req.query.keyword, $options: 'i' } },
        { maChiNhanh: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    const chiNhanhs = await ChiNhanh.find(filter)
      .populate('moiGioi', 'tenMoiGioi')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ChiNhanh.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: chiNhanhs,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách chi nhánh',
      error: error.message
    });
  }
};

// Lấy chi tiết chi nhánh
exports.getChiNhanhById = async (req, res) => {
  try {
    const chiNhanh = await ChiNhanh.findById(req.params.id).populate('moiGioi');
    
    if (!chiNhanh) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi nhánh'
      });
    }

    res.status(200).json({
      success: true,
      data: chiNhanh
    });
  } catch (error) {
    logger.error(`Lỗi lấy chi tiết chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết chi nhánh',
      error: error.message
    });
  }
};

// Tạo chi nhánh mới
exports.createChiNhanh = async (req, res) => {
  try {
    const {
      maChiNhanh,
      moiGioi,
      tenChiNhanh,
      diaChi,
      dienThoai,
      email,
      soNhanVien,
      moTa,
      hinhAnh,
      viTri
    } = req.body;

    // Kiểm tra trùng mã chi nhánh
    const existingChiNhanh = await ChiNhanh.findOne({ moiGioi, maChiNhanh });
    if (existingChiNhanh) {
      return res.status(400).json({
        success: false,
        message: 'Mã chi nhánh đã tồn tại cho môi giới này'
      });
    }

    const chiNhanh = await ChiNhanh.create({
      maChiNhanh,
      moiGioi,
      tenChiNhanh,
      diaChi,
      dienThoai,
      email,
      soNhanVien,
      moTa,
      hinhAnh,
      viTri
    });

    // Populate môi giới
    await chiNhanh.populate('moiGioi');

    res.status(201).json({
      success: true,
      message: 'Tạo chi nhánh thành công',
      data: chiNhanh
    });
  } catch (error) {
    logger.error(`Lỗi tạo chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo chi nhánh',
      error: error.message
    });
  }
};

// Cập nhật chi nhánh
exports.updateChiNhanh = async (req, res) => {
  try {
    const {
      tenChiNhanh,
      diaChi,
      dienThoai,
      email,
      soNhanVien,
      moTa,
      hinhAnh,
      viTri,
      trangThai
    } = req.body;

    const chiNhanh = await ChiNhanh.findById(req.params.id);
    
    if (!chiNhanh) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi nhánh'
      });
    }

    // Cập nhật các trường
    if (tenChiNhanh !== undefined) chiNhanh.tenChiNhanh = tenChiNhanh;
    if (diaChi !== undefined) chiNhanh.diaChi = diaChi;
    if (dienThoai !== undefined) chiNhanh.dienThoai = dienThoai;
    if (email !== undefined) chiNhanh.email = email;
    if (soNhanVien !== undefined) chiNhanh.soNhanVien = soNhanVien;
    if (moTa !== undefined) chiNhanh.moTa = moTa;
    if (hinhAnh !== undefined) chiNhanh.hinhAnh = hinhAnh;
    if (viTri !== undefined) chiNhanh.viTri = viTri;
    if (trangThai !== undefined) chiNhanh.trangThai = trangThai;

    await chiNhanh.save();
    await chiNhanh.populate('moiGioi');

    res.status(200).json({
      success: true,
      message: 'Cập nhật chi nhánh thành công',
      data: chiNhanh
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật chi nhánh',
      error: error.message
    });
  }
};

// Xóa chi nhánh
exports.deleteChiNhanh = async (req, res) => {
  try {
    const chiNhanh = await ChiNhanh.findById(req.params.id);
    
    if (!chiNhanh) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi nhánh'
      });
    }

    await ChiNhanh.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa chi nhánh thành công'
    });
  } catch (error) {
    logger.error(`Lỗi xóa chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa chi nhánh',
      error: error.message
    });
  }
};

// Lấy chi nhánh theo môi giới
exports.getChiNhanhByMoiGioi = async (req, res) => {
  try {
    const chiNhanhs = await ChiNhanh.find({ moiGioi: req.params.moiGioiId })
      .populate('moiGioi')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: chiNhanhs,
      total: chiNhanhs.length
    });
  } catch (error) {
    logger.error(`Lỗi lấy chi nhánh theo môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi nhánh theo môi giới',
      error: error.message
    });
  }
};

// Kiểm tra tính khả dụng chi nhánh
exports.checkChiNhanhAvailability = async (req, res) => {
  try {
    const { moiGioi, maChiNhanh } = req.query;

    const chiNhanh = await ChiNhanh.findOne({
      moiGioi,
      maChiNhanh,
      trangThai: 'Hoạt động'
    });

    if (chiNhanh) {
      res.status(200).json({
        success: true,
        available: true,
        data: chiNhanh
      });
    } else {
      res.status(200).json({
        success: true,
        available: false
      });
    }
  } catch (error) {
    logger.error(`Lỗi kiểm tra chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra chi nhánh',
      error: error.message
    });
  }
};

// Cập nhật trạng thái chi nhánh
exports.updateStatusChiNhanh = async (req, res) => {
  try {
    const { trangThai } = req.body;

    const chiNhanh = await ChiNhanh.findByIdAndUpdate(
      req.params.id,
      { trangThai },
      { new: true }
    ).populate('moiGioi');

    if (!chiNhanh) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi nhánh'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái chi nhánh thành công',
      data: chiNhanh
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật trạng thái: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái',
      error: error.message
    });
  }
};

// Đếm chi nhánh theo môi giới
exports.countChiNhanhByMoiGioi = async (req, res) => {
  try {
    const { moiGioiId } = req.params;
    const total = await ChiNhanh.countDocuments({ moiGioi: moiGioiId });
    const active = await ChiNhanh.countDocuments({ moiGioi: moiGioiId, trangThai: 'Hoạt động' });

    res.status(200).json({
      success: true,
      data: {
        total,
        active
      }
    });
  } catch (error) {
    logger.error(`Lỗi đếm chi nhánh: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi đếm chi nhánh',
      error: error.message
    });
  }
};
