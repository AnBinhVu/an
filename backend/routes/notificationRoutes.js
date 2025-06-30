const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationController');

router.post('/', notificationCtrl.createNotification);
router.get('/user/:userId', notificationCtrl.getNotifications);
router.put('/:notificationId/read', notificationCtrl.markAsRead);
router.delete('/:notificationId', notificationCtrl.deleteNotification);
router.get('/all', notificationCtrl.getAllNotifications);
router.post('/broadcast', notificationCtrl.createNotificationForAllUsers); // Tạo thông báo cho tất cả người dùng (trừ admin)

module.exports = router;
