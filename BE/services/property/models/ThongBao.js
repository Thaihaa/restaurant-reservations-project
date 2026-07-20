const mongoose = require('mongoose');

const thongBaoSchema = new mongoose.Schema(
  {
    loai: {
      type: String,
      enum: ['tin_dang_moi', 'tin_dang_duyet', 'tin_dang_tu_choi'],
      required: true
    },
    tinDang: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TinDang'
    },
    tieuDe: {
      type: String,
      trim: true
    },
    nguoiDang: {
      type: String
    },
    noiDung: {
      type: String,
      required: true
    },
    nguoiNhan: {
      type: String,
      default: 'admin'
    },
    daDoc: {
      type: Boolean,
      default: false
    },
    daXuLy: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

thongBaoSchema.index({ nguoiNhan: 1, daDoc: 1, createdAt: -1 });
thongBaoSchema.index({ tinDang: 1 });

const ThongBao = mongoose.model('ThongBao', thongBaoSchema);

module.exports = ThongBao;
