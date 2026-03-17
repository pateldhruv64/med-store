const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', branchController.getAll);
router.post('/', branchController.create);
router.get('/:id', branchController.getOne);
router.put('/:id', branchController.update);
router.delete('/:id', branchController.remove);

module.exports = router; 