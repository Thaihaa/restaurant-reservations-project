const mongoose = require('mongoose');

const moiGioiSchema = new mongoose.Schema(
  {
    tenMoiGioi: {
      type: String,
      required: [true, 'Tên môi giới là bắt buộc'],
      trim: true
    },
    dienThoai: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'Số giấy phép kinh doanh là bắt buộc'],
      trim: true,
      unique: true
    },
    moTa: {
      type: String
    },
    hinhAnh: {
      type: [String],
      default: []
    },
    danhGiaTrungBinh: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    soLuongDanhGia: {
      type: Number,
      default: 0
    },
    soLuongBatDongSan: {
      type: Number,
      default: 0
    },
    trangThai: {
      type: String,
      enum: ['Hoạt động', 'Tạm dừng', 'Hết hạn'],
      default: 'Hoạt động'
    },
    viTri: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // [longitude, latitude]
      }
    },
    diaChi: {
      type: String,
      required: [true, 'Địa chỉ là bắt buộc']
    },
    thanhPho: {
      type: String
    },
    quanHuyen: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Tạo index cho vị trí để tìm kiếm theo khoảng cách
moiGioiSchema.index({ viTri: '2dsphere' });
moiGioiSchema.index({ licenseNumber: 1 });
moiGioiSchema.index({ tenMoiGioi: 1 });

const MoiGioi = mongoose.model('MoiGioi', moiGioiSchema);

module.exports = MoiGioi; 