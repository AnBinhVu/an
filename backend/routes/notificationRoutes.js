const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('admin'), notificationCtrl.createNotification);
router.get('/user/:userId',authMiddleware(), notificationCtrl.getNotifications);
router.put('/:notificationId/read',authMiddleware(), notificationCtrl.markAsRead);
router.delete('/:notificationId',authMiddleware(), notificationCtrl.deleteNotification);
router.get('/all',authMiddleware(), notificationCtrl.getAllNotifications);
router.post('/broadcast',authMiddleware('admin'), notificationCtrl.createNotificationForAllUsers); // Tạo thông báo cho tất cả người dùng (trừ admin)

module.exports = router;
