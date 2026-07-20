const LoaiBDS = require('../models/LoaiBDS');
const logger = require('../../../utils/logger');

exports.getAllLoaiBDS = async (req, res) => {
  try {
    const filter = {};
    if (req.query.loaiHinh) filter.loaiHinh = req.query.loaiHinh;
    if (req.query.trangThai === 'true' || req.query.trangThai === 'false') {
      filter.trangThai = req.query.trangThai === 'true';
    }

    const loaiBDS = await LoaiBDS.find(filter).sort({ thuTu: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: loaiBDS });
  } catch (error) {
    logger.error(`Lỗi lấy loại BĐS: ${error.message}`);
    res.status(500).json({ success: false, message: 'Lỗi lấy loại BĐS', error: error.message });
  }
};

exports.createLoaiBDS = async (req, res) => {
  try {
    const loai = await LoaiBDS.create(req.body);
    res.status(201).json({ success: true, data: loai, message: 'Tạo loại BĐS thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo loại BĐS', error: error.message });
  }
};

exports.updateLoaiBDS = async (req, res) => {
  try {
    const loai = await LoaiBDS.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!loai) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại BĐS' });
    }
    res.status(200).json({ success: true, data: loai });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật loại BĐS', error: error.message });
  }
};

exports.deleteLoaiBDS = async (req, res) => {
  try {
    const loai = await LoaiBDS.findByIdAndDelete(req.params.id);
    if (!loai) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại BĐS' });
    }
    res.status(200).json({ success: true, message: 'Xóa loại BĐS thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa loại BĐS', error: error.message });
  }
};

exports.seedLoaiBDS = async (req, res) => {
  try {
    const count = await LoaiBDS.countDocuments();
    if (count > 0) {
      return res.status(200).json({ success: true, message: 'Dữ liệu đã tồn tại', data: await LoaiBDS.find() });
    }

    const seedData = [
      { tenLoai: 'Bán căn hộ chung cư', loaiHinh: 'ban', thuTu: 1 },
      { tenLoai: 'Bán nhà riêng', loaiHinh: 'ban', thuTu: 2 },
      { tenLoai: 'Bán nhà mặt phố', loaiHinh: 'ban', thuTu: 3 },
      { tenLoai: 'Bán đất nền', loaiHinh: 'ban', thuTu: 4 },
      { tenLoai: 'Bán biệt thự', loaiHinh: 'ban', thuTu: 5 },
      { tenLoai: 'Cho thuê căn hộ chung cư', loaiHinh: 'thue', thuTu: 1 },
      { tenLoai: 'Cho thuê nhà riêng', loaiHinh: 'thue', thuTu: 2 },
      { tenLoai: 'Cho thuê nhà mặt phố', loaiHinh: 'thue', thuTu: 3 },
      { tenLoai: 'Cho thuê văn phòng', loaiHinh: 'thue', thuTu: 4 },
      { tenLoai: 'Cho thuê phòng trọ', loaiHinh: 'thue', thuTu: 5 },
    ];

    const created = await LoaiBDS.insertMany(seedData);
    res.status(201).json({ success: true, data: created, message: 'Seed dữ liệu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi seed dữ liệu', error: error.message });
  }
};
