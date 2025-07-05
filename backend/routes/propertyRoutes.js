const express = require('express');
const router = express.Router();
const propertyCtrl = require('../controllers/propertyController');
const upload = require('../middleware/uploadCloudinary');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', propertyCtrl.getAllProperties);
router.get('/user/:userId', authMiddleware('owner'), propertyCtrl.getListProperties);
router.post(
  '/',
  authMiddleware('owner'),
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 2 }
  ]),
  propertyCtrl.createProperty
);
router.put('/:id', authMiddleware('owner'),upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 2 }
  ]),
  propertyCtrl.updateProperty
);
router.delete('/:id', authMiddleware('owner'), propertyCtrl.deleteProperty);
router.delete('/:propertyId/images', authMiddleware('owner'), propertyCtrl.deleteImage);
router.delete('/:propertyId/videos', authMiddleware('owner'), propertyCtrl.deleteVideo);
router.get('/detail/:id', propertyCtrl.getPropertyDetails);
router.put('/:id/approval', authMiddleware('admin'), propertyCtrl.updateApprovalStatus);
router.get('/admin/allproperty', propertyCtrl.getAllPropertiesAdmin);

module.exports = router;
