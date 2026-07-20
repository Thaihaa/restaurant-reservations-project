const mongoose = require('mongoose');

const loaiBDSSchema = new mongoose.Schema(
  {
    tenLoai: {
      type: String,
      required: [true, 'Tên loại BĐS là bắt buộc'],
      trim: true
    },
    loaiHinh: {
      type: String,
      enum: ['ban', 'thue'],
      required: [true, 'Loại hình là bắt buộc']
    },
    moTa: {
      type: String,
      trim: true
    },
    thuTu: {
      type: Number,
      default: 0
    },
    trangThai: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const LoaiBDS = mongoose.model('LoaiBDS', loaiBDSSchema);

module.exports = LoaiBDS;
