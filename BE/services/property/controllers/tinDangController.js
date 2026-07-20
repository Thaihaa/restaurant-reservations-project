const TinDang = require('../models/TinDang');
const ThongBao = require('../models/ThongBao');
const logger = require('../../../utils/logger');
const { notifyAdminNewProperty, notifyUserPropertyStatus } = require('../utils/socketNotify');

const buildAdminNotification = (tinDang) =>
  ThongBao.create({
    loai: 'tin_dang_moi',
    tinDang: tinDang._id,
    tieuDe: tinDang.tieuDe,
    nguoiDang: tinDang.nguoiDang,
    noiDung: `Tin "${tinDang.tieuDe}" cần được duyệt`,
    nguoiNhan: 'admin'
  });

exports.getAllTinDang = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.loaiHinh) filter.loaiHinh = req.query.loaiHinh;
    if (req.query.loaiBDS) filter.loaiBDS = req.query.loaiBDS;
    if (req.query.tinhThanh) filter.tinhThanh = { $regex: req.query.tinhThanh, $options: 'i' };
    if (req.query.quanHuyen) filter.quanHuyen = { $regex: req.query.quanHuyen, $options: 'i' };
    if (req.query.trangThai) filter.trangThai = req.query.trangThai;
    if (req.query.noiBat === 'true') filter.noiBat = true;

    if (!req.user || req.user.role !== 'admin') {
      filter.trangThai = 'dang_hien_thi';
    } else if (req.query.adminView === 'true') {
      delete filter.trangThai;
    }

    if (req.query.keyword) {
      filter.$or = [
        { tieuDe: { $regex: req.query.keyword, $options: 'i' } },
        { moTa: { $regex: req.query.keyword, $options: 'i' } },
        { diaChi: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    if (req.query.giaMin || req.query.giaMax) {
      filter.gia = {};
      if (req.query.giaMin) filter.gia.$gte = parseInt(req.query.giaMin);
      if (req.query.giaMax) filter.gia.$lte = parseInt(req.query.giaMax);
    }

    if (req.query.dienTichMin || req.query.dienTichMax) {
      filter.dienTich = {};
      if (req.query.dienTichMin) filter.dienTich.$gte = parseInt(req.query.dienTichMin);
      if (req.query.dienTichMax) filter.dienTich.$lte = parseInt(req.query.dienTichMax);
    }

    const tinDangs = await TinDang.find(filter)
      .populate('loaiBDS', 'tenLoai loaiHinh')
      .skip(skip)
      .limit(limit)
      .sort({ noiBat: -1, createdAt: -1 });

    const total = await TinDang.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tinDangs,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách tin đăng: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tin đăng', error: error.message });
  }
};

exports.getTinDangById = async (req, res) => {
  try {
    const tinDang = await TinDang.findById(req.params.id).populate('loaiBDS', 'tenLoai loaiHinh');

    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }

    if (tinDang.trangThai !== 'dang_hien_thi' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Tin đăng không khả dụng' });
    }

    await TinDang.findByIdAndUpdate(req.params.id, { $inc: { luotXem: 1 } });

    res.status(200).json({ success: true, data: tinDang });
  } catch (error) {
    logger.error(`Lỗi lấy chi tiết tin đăng: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết tin đăng', error: error.message });
  }
};

exports.getTinDangNoiBat = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const tinDangs = await TinDang.find({ trangThai: 'dang_hien_thi' })
      .populate('loaiBDS', 'tenLoai')
      .limit(limit)
      .sort({ noiBat: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: tinDangs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy tin nổi bật', error: error.message });
  }
};

exports.getTinDangMoiNhat = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const loaiHinh = req.query.loaiHinh;

    const filter = { trangThai: 'dang_hien_thi' };
    if (loaiHinh) filter.loaiHinh = loaiHinh;

    const tinDangs = await TinDang.find(filter)
      .populate('loaiBDS', 'tenLoai loaiHinh')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tinDangs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy tin mới nhất', error: error.message });
  }
};

exports.getMyTinDang = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { nguoiDang: req.user.id };
    if (req.query.trangThai) filter.trangThai = req.query.trangThai;

    const tinDangs = await TinDang.find(filter)
      .populate('loaiBDS', 'tenLoai loaiHinh')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await TinDang.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tinDangs,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy tin đăng của bạn', error: error.message });
  }
};

exports.createTinDang = async (req, res) => {
  try {
    const data = { ...req.body, nguoiDang: req.user.id };
    if (req.user.role !== 'admin') {
      data.trangThai = 'cho_duyet';
      data.noiBat = false;
    }
    const tinDang = await TinDang.create(data);

    if (tinDang.trangThai === 'cho_duyet') {
      await buildAdminNotification(tinDang);
      await notifyAdminNewProperty(tinDang);
    }

    const message =
      tinDang.trangThai === 'cho_duyet'
        ? 'Đăng tin thành công! Tin đang chờ admin duyệt'
        : 'Tạo tin đăng thành công';

    res.status(201).json({ success: true, data: tinDang, message });
  } catch (error) {
    logger.error(`Lỗi tạo tin đăng: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi tạo tin đăng', error: error.message });
  }
};

exports.updateTinDang = async (req, res) => {
  try {
    const tinDang = await TinDang.findById(req.params.id);
    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }

    if (req.user.role !== 'admin' && tinDang.nguoiDang !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa tin này' });
    }

    const updateData = { ...req.body };
    delete updateData.nguoiDang;

    if (req.user.role !== 'admin') {
      delete updateData.trangThai;
      delete updateData.noiBat;
      delete updateData.lyDoTuChoi;
      updateData.trangThai = 'cho_duyet';
    }

    const updated = await TinDang.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (req.user.role !== 'admin' && updated.trangThai === 'cho_duyet') {
      await buildAdminNotification(updated);
      await notifyAdminNewProperty(updated);
    }

    res.status(200).json({
      success: true,
      data: updated,
      message:
        req.user.role !== 'admin'
          ? 'Cập nhật thành công! Tin đang chờ admin duyệt lại'
          : 'Cập nhật tin đăng thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật tin đăng', error: error.message });
  }
};

exports.updateTrangThai = async (req, res) => {
  try {
    const { trangThai } = req.body;
    const updated = await TinDang.findByIdAndUpdate(
      req.params.id,
      { trangThai },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }
    res.status(200).json({ success: true, data: updated, message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái', error: error.message });
  }
};

exports.deleteTinDang = async (req, res) => {
  try {
    const tinDang = await TinDang.findByIdAndDelete(req.params.id);
    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }
    res.status(200).json({ success: true, message: 'Xóa tin đăng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa tin đăng', error: error.message });
  }
};

// Admin functions
exports.getAllTinDangAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.trangThai) filter.trangThai = req.query.trangThai;
    if (req.query.loaiHinh) filter.loaiHinh = req.query.loaiHinh;
    if (req.query.loaiBDS) filter.loaiBDS = req.query.loaiBDS;
    if (req.query.tinhThanh) filter.tinhThanh = { $regex: req.query.tinhThanh, $options: 'i' };
    if (req.query.quanHuyen) filter.quanHuyen = { $regex: req.query.quanHuyen, $options: 'i' };
    if (req.query.noiBat === 'true') filter.noiBat = true;
    if (req.query.nguoiDang) filter.nguoiDang = req.query.nguoiDang;

    if (req.query.keyword) {
      filter.$or = [
        { tieuDe: { $regex: req.query.keyword, $options: 'i' } },
        { moTa: { $regex: req.query.keyword, $options: 'i' } },
        { diaChi: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    if (req.query.giaMin || req.query.giaMax) {
      filter.gia = {};
      if (req.query.giaMin) filter.gia.$gte = parseInt(req.query.giaMin);
      if (req.query.giaMax) filter.gia.$lte = parseInt(req.query.giaMax);
    }

    if (req.query.dienTichMin || req.query.dienTichMax) {
      filter.dienTich = {};
      if (req.query.dienTichMin) filter.dienTich.$gte = parseInt(req.query.dienTichMin);
      if (req.query.dienTichMax) filter.dienTich.$lte = parseInt(req.query.dienTichMax);
    }

    const tinDangs = await TinDang.find(filter)
      .populate('loaiBDS', 'tenLoai loaiHinh')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await TinDang.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tinDangs,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách tin đăng (admin): ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tin đăng', error: error.message });
  }
};

exports.getStatisticsTinDang = async (req, res) => {
  try {
    const stats = {
      total: await TinDang.countDocuments(),
      dangHienThi: await TinDang.countDocuments({ trangThai: 'dang_hien_thi' }),
      choDuyet: await TinDang.countDocuments({ trangThai: 'cho_duyet' }),
      hetHan: await TinDang.countDocuments({ trangThai: 'het_han' }),
      daBan: await TinDang.countDocuments({ trangThai: 'da_ban' }),
      nhap: await TinDang.countDocuments({ trangThai: 'nhap' }),
      noiBat: await TinDang.countDocuments({ noiBat: true }),
      ban: await TinDang.countDocuments({ loaiHinh: 'ban' }),
      thue: await TinDang.countDocuments({ loaiHinh: 'thue' })
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    logger.error(`Lỗi lấy thống kê: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê', error: error.message });
  }
};

exports.approveTinDang = async (req, res) => {
  try {
    const tinDang = await TinDang.findByIdAndUpdate(
      req.params.id,
      { $set: { trangThai: 'dang_hien_thi' }, $unset: { lyDoTuChoi: 1 } },
      { new: true }
    ).populate('loaiBDS', 'tenLoai');

    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }

    await ThongBao.updateMany(
      { tinDang: tinDang._id, nguoiNhan: 'admin', loai: 'tin_dang_moi' },
      { daXuLy: true, daDoc: true }
    );

    await ThongBao.create({
      loai: 'tin_dang_duyet',
      tinDang: tinDang._id,
      tieuDe: tinDang.tieuDe,
      nguoiDang: tinDang.nguoiDang,
      noiDung: `Tin "${tinDang.tieuDe}" đã được duyệt và hiển thị công khai`,
      nguoiNhan: tinDang.nguoiDang
    });

    await notifyUserPropertyStatus(tinDang, 'dang_hien_thi', 'Tin đăng của bạn đã được duyệt');

    logger.info(`Tin đăng được duyệt: ${tinDang._id}`);
    res.status(200).json({ success: true, data: tinDang, message: 'Duyệt tin đăng thành công' });
  } catch (error) {
    logger.error(`Lỗi duyệt tin đăng: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi duyệt tin đăng', error: error.message });
  }
};

exports.rejectTinDang = async (req, res) => {
  try {
    const { lyDoTuChoi } = req.body;
    const reason = lyDoTuChoi || 'Bị từ chối bởi admin';

    const tinDang = await TinDang.findByIdAndUpdate(
      req.params.id,
      {
        trangThai: 'nhap',
        lyDoTuChoi: reason
      },
      { new: true }
    );

    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }

    await ThongBao.updateMany(
      { tinDang: tinDang._id, nguoiNhan: 'admin', loai: 'tin_dang_moi' },
      { daXuLy: true, daDoc: true }
    );

    await ThongBao.create({
      loai: 'tin_dang_tu_choi',
      tinDang: tinDang._id,
      tieuDe: tinDang.tieuDe,
      nguoiDang: tinDang.nguoiDang,
      noiDung: `Tin "${tinDang.tieuDe}" bị từ chối: ${reason}`,
      nguoiNhan: tinDang.nguoiDang
    });

    await notifyUserPropertyStatus(tinDang, 'nhap', `Tin đăng bị từ chối: ${reason}`);

    logger.info(`Tin đăng bị từ chối: ${tinDang._id}`);
    res.status(200).json({ success: true, data: tinDang, message: 'Từ chối tin đăng thành công' });
  } catch (error) {
    logger.error(`Lỗi từ chối tin đăng: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi từ chối tin đăng', error: error.message });
  }
};

exports.toggleNoiBat = async (req, res) => {
  try {
    const tinDang = await TinDang.findById(req.params.id);
    if (!tinDang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng' });
    }

    if (tinDang.trangThai !== 'dang_hien_thi') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể đánh dấu nổi bật tin đã được duyệt'
      });
    }

    const updated = await TinDang.findByIdAndUpdate(
      req.params.id,
      { noiBat: !tinDang.noiBat },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated, message: 'Cập nhật tin nổi bật thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật tin nổi bật', error: error.message });
  }
};

exports.searchByPriceAndName = async (req, res) => {
  try {
    const { keyword, giaMin, giaMax, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { trangThai: 'dang_hien_thi' };

    if (keyword) {
      filter.$or = [
        { tieuDe: { $regex: keyword, $options: 'i' } },
        { moTa: { $regex: keyword, $options: 'i' } },
        { diaChi: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (giaMin || giaMax) {
      filter.gia = {};
      if (giaMin) filter.gia.$gte = parseInt(giaMin);
      if (giaMax) filter.gia.$lte = parseInt(giaMax);
    }

    const tinDangs = await TinDang.find(filter)
      .populate('loaiBDS', 'tenLoai')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ noiBat: -1, createdAt: -1 });

    const total = await TinDang.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tinDangs,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    logger.error(`Lỗi tìm kiếm: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi tìm kiếm', error: error.message });
  }
};
