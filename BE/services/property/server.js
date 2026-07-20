const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('../../middlewares/errorHandler');
const tinDangRoutes = require('./routes/tinDangRoutes');
const loaiBDSRoutes = require('./routes/loaiBDSRoutes');
const config = require('../../config');
const logger = require('../../utils/logger');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(helmet({ contentSecurityPolicy: false }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use('/tin-dang', tinDangRoutes);
app.use('/loai-bds', loaiBDSRoutes);

app.get('/property/health', (req, res) => {
  res.status(200).json({ success: true, service: 'Property Service', time: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

mongoose.connect(config.mongodb.uri)
  .then(() => {
    logger.info('Kết nối MongoDB thành công (Property Service)');
    const PORT = config.servicePorts.property || 5006;
    app.listen(PORT, () => {
      logger.info(`Property Service đang chạy trên cổng ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Lỗi kết nối MongoDB (Property Service): ${error.message}`);
    process.exit(1);
  });
