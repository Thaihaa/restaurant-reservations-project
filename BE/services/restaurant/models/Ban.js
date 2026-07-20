const mongoose = require('mongoose');

const chiNhanhSchema = new mongoose.Schema(
  {
    maChiNhanh: {
      type: String,
      required: [true, 'Mã chi nhánh là bắt buộc'],
      trim: true
    },
    moiGioi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MoiGioi',
      required: [true, 'Môi giới là bắt buộc']
    },
    tenChiNhanh: {
      type: String,
      required: [true, 'Tên chi nhánh là bắt buộc'],
      trim: true
    },
    diaChi: {
      type: String,
      required: [true, 'Địa chỉ chi nhánh là bắt buộc'],
      trim: true
    },
    dienThoai: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    soNhanVien: {
      type: Number,
      default: 0,
      min: 0
    },
    trangThai: {
      type: String,
      enum: ['Hoạt động', 'Tạm dừng', 'Bảo trì'],
      default: 'Hoạt động'
    },
    moTa: {
      type: String,
      trim: true
    },
    hinhAnh: {
      type: [String],
      default: []
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
    }
  },
  {
    timestamps: true
  }
);

// Tạo chỉ mục cho việc tìm kiếm
chiNhanhSchema.index({ moiGioi: 1, maChiNhanh: 1 }, { unique: true });
chiNhanhSchema.index({ viTri: '2dsphere' });

const ChiNhanh = mongoose.model('ChiNhanh', chiNhanhSchema);

module.exports = ChiNhanh; 