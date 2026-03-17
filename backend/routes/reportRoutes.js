const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stock', reportController.stockReport);
router.get('/sales', reportController.salesReport);
router.get('/sales-pdf', reportController.salesPdf);
router.get('/expiry', reportController.expiryReport);
router.get('/low-stock', reportController.lowStockReport);
router.get('/full-pdf', reportController.fullPdf);

module.exports = router; 