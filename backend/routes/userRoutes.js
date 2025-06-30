const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

// Lấy tất cả user, có hỗ trợ lọc role
router.get('/', userCtrl.getAllUsers);

// Lấy chi tiết user theo ID
router.get('/:id', userCtrl.getUserById);

module.exports = router;
