const MoiGioi = require('../models/NhaHang'); // Model đã được rename thành MoiGioi
const logger = require('../../../utils/logger');

// Lấy danh sách môi giới với phân trang
exports.getAllMoiGioi = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Tìm kiếm theo từ khóa
    const keyword = req.query.keyword
      ? {
          $or: [
            { tenMoiGioi: { $regex: req.query.keyword, $options: 'i' } },
            { diaChi: { $regex: req.query.keyword, $options: 'i' } },
            { moTa: { $regex: req.query.keyword, $options: 'i' } },
            { licenseNumber: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};
      
    // Lọc theo trạng thái
    if (req.query.trangThai && ['Hoạt động', 'Tạm dừng', 'Hết hạn'].includes(req.query.trangThai)) {
      keyword.trangThai = req.query.trangThai;
    }

    // Lọc theo thành phố
    if (req.query.thanhPho) {
      keyword.thanhPho = { $regex: req.query.thanhPho, $options: 'i' };
    }

    // Thực hiện truy vấn
    const moiGiois = await MoiGioi.find(keyword)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalMoiGioi = await MoiGioi.countDocuments(keyword);

    res.status(200).json({
      success: true,
      data: moiGiois,
      page,
      totalPages: Math.ceil(totalMoiGioi / limit),
      totalItems: totalMoiGioi
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách môi giới',
      error: error.message
    });
  }
};

// Lấy chi tiết một môi giới
exports.getMoiGioiById = async (req, res) => {
  try {
    const moiGioi = await MoiGioi.findById(req.params.id);
    
    if (!moiGioi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy môi giới'
      });
    }

    res.status(200).json({
      success: true,
      data: moiGioi
    });
  } catch (error) {
    logger.error(`Lỗi lấy chi tiết môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết môi giới',
      error: error.message
    });
  }
};

// Tạo môi giới mới
exports.createMoiGioi = async (req, res) => {
  try {
    const {
      tenMoiGioi,
      diaChi,
      dienThoai,
      email,
      website,
      licenseNumber,
      moTa,
      hinhAnh,
      viTri,
      thanhPho,
      quanHuyen
    } = req.body;

    // Kiểm tra trùng số giấy phép
    const existingMoiGioi = await MoiGioi.findOne({ licenseNumber });
    if (existingMoiGioi) {
      return res.status(400).json({
        success: false,
        message: 'Số giấy phép kinh doanh đã tồn tại'
      });
    }

    const moiGioi = await MoiGioi.create({
      tenMoiGioi,
      diaChi,
      dienThoai,
      email,
      website,
      licenseNumber,
      moTa,
      hinhAnh,
      viTri,
      thanhPho,
      quanHuyen
    });

    res.status(201).json({
      success: true,
      message: 'Tạo môi giới thành công',
      data: moiGioi
    });
  } catch (error) {
    logger.error(`Lỗi tạo môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo môi giới',
      error: error.message
    });
  }
};

// Cập nhật thông tin môi giới
exports.updateMoiGioi = async (req, res) => {
  try {
    const {
      tenMoiGioi,
      diaChi,
      dienThoai,
      email,
      website,
      licenseNumber,
      moTa,
      hinhAnh,
      viTri,
      thanhPho,
      quanHuyen,
      trangThai
    } = req.body;

    const moiGioi = await MoiGioi.findById(req.params.id);
    
    if (!moiGioi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy môi giới'
      });
    }

    // Cập nhật các trường
    if (tenMoiGioi) moiGioi.tenMoiGioi = tenMoiGioi;
    if (diaChi) moiGioi.diaChi = diaChi;
    if (dienThoai) moiGioi.dienThoai = dienThoai;
    if (email) moiGioi.email = email;
    if (website) moiGioi.website = website;
    if (licenseNumber) moiGioi.licenseNumber = licenseNumber;
    if (moTa) moiGioi.moTa = moTa;
    if (hinhAnh) moiGioi.hinhAnh = hinhAnh;
    if (viTri) moiGioi.viTri = viTri;
    if (thanhPho) moiGioi.thanhPho = thanhPho;
    if (quanHuyen) moiGioi.quanHuyen = quanHuyen;
    if (trangThai) moiGioi.trangThai = trangThai;

    await moiGioi.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin môi giới thành công',
      data: moiGioi
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật môi giới',
      error: error.message
    });
  }
};

// Xóa môi giới
exports.deleteMoiGioi = async (req, res) => {
  try {
    const moiGioi = await MoiGioi.findById(req.params.id);
    
    if (!moiGioi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy môi giới'
      });
    }

    await MoiGioi.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa môi giới thành công'
    });
  } catch (error) {
    logger.error(`Lỗi xóa môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa môi giới',
      error: error.message
    });
  }
};

// Lấy môi giới gần đây theo vị trí địa lý
exports.getMoiGioiGanDay = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp tọa độ lat, lng'
      });
    }

    const moiGiois = await MoiGioi.find({
      viTri: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: (radius || 10) * 1000 // Mặc định 10km
        }
      },
      trangThai: 'Hoạt động'
    });

    res.status(200).json({
      success: true,
      data: moiGiois,
      total: moiGiois.length
    });
  } catch (error) {
    logger.error(`Lỗi lấy môi giới gần đây: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy môi giới gần đây',
      error: error.message
    });
  }
};

// Đếm số lượng môi giới
exports.countMoiGioi = async (req, res) => {
  try {
    const total = await MoiGioi.countDocuments();
    const active = await MoiGioi.countDocuments({ trangThai: 'Hoạt động' });
    const inactive = await MoiGioi.countDocuments({ trangThai: 'Tạm dừng' });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive
      }
    });
  } catch (error) {
    logger.error(`Lỗi đếm số lượng môi giới: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi đếm số lượng môi giới',
      error: error.message
    });
  }
};

// Cập nhật đánh giá cho môi giới
exports.updateRatingMoiGioi = async (req, res) => {
  try {
    const { danhGiaTrungBinh, soLuongDanhGia } = req.body;
    const moiGioi = await MoiGioi.findByIdAndUpdate(
      req.params.id,
      {
        danhGiaTrungBinh,
        soLuongDanhGia
      },
      { new: true }
    );

    if (!moiGioi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy môi giới'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đánh giá thành công',
      data: moiGioi
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật đánh giá: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật đánh giá',
      error: error.message
    });
  }
};
