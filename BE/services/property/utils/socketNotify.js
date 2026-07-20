const axios = require('axios');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const emitSocketEvent = async ({ room, event, data }) => {
  try {
    const orderServiceUrl = config.serviceUrls.order || `http://localhost:${config.servicePorts.order || 5004}`;
    await axios.post(`${orderServiceUrl}/internal/socket/emit`, { room, event, data }, { timeout: 5000 });
    logger.info(`Socket event "${event}" sent to room "${room}"`);
  } catch (error) {
    logger.warn(`Không gửi được socket event "${event}": ${error.message}`);
  }
};

const notifyAdminNewProperty = async (tinDang) => {
  const notificationData = {
    id: tinDang._id,
    tieuDe: tinDang.tieuDe,
    gia: tinDang.gia,
    diaChi: tinDang.diaChi,
    loaiHinh: tinDang.loaiHinh,
    trangThai: tinDang.trangThai,
    nguoiDang: tinDang.nguoiDang,
    message: 'Có tin đăng bất động sản mới cần duyệt',
    createdAt: tinDang.createdAt || new Date()
  };

  await emitSocketEvent({
    room: 'admin_room',
    event: 'new_property_post',
    data: notificationData
  });
};

const notifyUserPropertyStatus = async (tinDang, status, message) => {
  if (!tinDang.nguoiDang) return;

  const notificationData = {
    id: tinDang._id,
    tieuDe: tinDang.tieuDe,
    trangThai: status,
    lyDoTuChoi: tinDang.lyDoTuChoi,
    message,
    updatedAt: new Date()
  };

  await emitSocketEvent({
    room: `user_${tinDang.nguoiDang}`,
    event: 'property_status_changed',
    data: notificationData
  });
};

module.exports = {
  emitSocketEvent,
  notifyAdminNewProperty,
  notifyUserPropertyStatus
};
