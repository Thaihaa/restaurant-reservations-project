const ThongBao = require('../models/ThongBao');
const logger = require('../../../utils/logger');

exports.getAdminNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { nguoiNhan: 'admin' };
    if (req.query.chuaDoc === 'true') filter.daDoc = false;
    if (req.query.chuaXuLy === 'true') filter.daXuLy = false;

    const notifications = await ThongBao.find(filter)
      .populate('tinDang', 'tieuDe gia diaChi trangThai loaiHinh hinhAnh')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ThongBao.countDocuments(filter);
    const chuaDoc = await ThongBao.countDocuments({ nguoiNhan: 'admin', daDoc: false });
    const choDuyet = await ThongBao.countDocuments({
      nguoiNhan: 'admin',
      loai: 'tin_dang_moi',
      daXuLy: false
    });

    res.status(200).json({
      success: true,
      data: notifications,
      chuaDoc,
      choDuyet,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    logger.error(`Lỗi lấy thông báo admin: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy thông báo', error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const chuaDoc = await ThongBao.countDocuments({ nguoiNhan: 'admin', daDoc: false });
    const choDuyet = await ThongBao.countDocuments({
      nguoiNhan: 'admin',
      loai: 'tin_dang_moi',
      daXuLy: false
    });

    res.status(200).json({
      success: true,
      data: { chuaDoc, choDuyet }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đếm thông báo', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await ThongBao.findOneAndUpdate(
      { _id: req.params.id, nguoiNhan: 'admin' },
      { daDoc: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thông báo', error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await ThongBao.updateMany({ nguoiNhan: 'admin', daDoc: false }, { daDoc: true });
    res.status(200).json({ success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thông báo', error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await ThongBao.find({ nguoiNhan: req.user.id })
      .populate('tinDang', 'tieuDe gia trangThai')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông báo', error: error.message });
  }
};
