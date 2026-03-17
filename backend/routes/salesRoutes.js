const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', salesController.getAll);
router.get('/report', salesController.report);
router.post('/', salesController.create);
router.get('/mystats', salesController.myStats);
router.get('/:id', salesController.getOne);

module.exports = router; 