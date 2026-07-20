const mongoose = require('mongoose');

const tinDangSchema = new mongoose.Schema(
  {
    tieuDe: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true
    },
    moTa: {
      type: String,
      trim: true
    },
    gia: {
      type: Number,
      required: [true, 'Giá là bắt buộc'],
      min: 0
    },
    donViGia: {
      type: String,
      enum: ['tong', 'm2', 'thang'],
      default: 'tong'
    },
    dienTich: {
      type: Number,
      min: 0
    },
    phongNgu: {
      type: Number,
      default: 0,
      min: 0
    },
    phongTam: {
      type: Number,
      default: 0,
      min: 0
    },
    huongNha: {
      type: String,
      trim: true
    },
    diaChi: {
      type: String,
      trim: true
    },
    tinhThanh: {
      type: String,
      trim: true
    },
    quanHuyen: {
      type: String,
      trim: true
    },
    phuongXa: {
      type: String,
      trim: true
    },
    loaiHinh: {
      type: String,
      enum: ['ban', 'thue'],
      required: [true, 'Loại hình là bắt buộc']
    },
    loaiBDS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoaiBDS'
    },
    hinhAnh: {
      type: [String],
      default: []
    },
    nguoiDang: {
      type: String
    },
    trangThai: {
      type: String,
      enum: ['nhap', 'cho_duyet', 'dang_hien_thi', 'het_han', 'da_ban'],
      default: 'cho_duyet'
    },
    lyDoTuChoi: {
      type: String
    },
    noiBat: {
      type: Boolean,
      default: false
    },
    luotXem: {
      type: Number,
      default: 0
    },
    lienHe: {
      hoTen: String,
      soDienThoai: String,
      email: String
    },
    moiGioi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MoiGioi'
    }
  },
  { timestamps: true }
);

tinDangSchema.index({ tieuDe: 'text', moTa: 'text', diaChi: 'text' });
tinDangSchema.index({ gia: 1 });
tinDangSchema.index({ trangThai: 1 });
tinDangSchema.index({ tinhThanh: 1 });

const TinDang = mongoose.model('TinDang', tinDangSchema);

module.exports = TinDang;
