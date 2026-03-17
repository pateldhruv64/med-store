const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', medicineController.getAll);
router.get('/expiry-alerts', medicineController.expiryAlerts);
router.get('/low-stock-alerts', medicineController.lowStockAlerts);
router.post('/', medicineController.create);
router.get('/:id', medicineController.getOne);
router.put('/:id', medicineController.update);
router.delete('/:id', medicineController.remove);
router.post('/:id/add-stock', medicineController.addStock);

module.exports = router; 