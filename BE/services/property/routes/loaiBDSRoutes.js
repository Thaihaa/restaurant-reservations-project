const express = require('express');
const router = express.Router();
const loaiBDSController = require('../controllers/loaiBDSController');
const { authenticateToken, isAdmin } = require('../../../middlewares/authMiddleware');

router.get('/', loaiBDSController.getAllLoaiBDS);
router.post('/seed', loaiBDSController.seedLoaiBDS);
router.post('/', authenticateToken, isAdmin, loaiBDSController.createLoaiBDS);
router.put('/:id', authenticateToken, isAdmin, loaiBDSController.updateLoaiBDS);
router.delete('/:id', authenticateToken, isAdmin, loaiBDSController.deleteLoaiBDS);

module.exports = router;
