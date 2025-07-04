const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.registerUser);
router.post('/logout', authController.logout); 


module.exports = router;