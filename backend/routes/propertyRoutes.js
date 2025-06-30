const express = require('express');
const router = express.Router();
const propertyCtrl = require('../controllers/propertyController');
const upload = require('../middleware/upload');


router.get('/', propertyCtrl.getAllProperties);
router.post('/', upload, propertyCtrl.createProperty);
router.put('/:id', upload, propertyCtrl.updateProperty);
router.delete('/:id', propertyCtrl.deleteProperty);
router.put('/:id/approval', propertyCtrl.updateApprovalStatus);
router.delete('/:propertyId/images', propertyCtrl.deleteImage);
router.delete('/:propertyId/videos', propertyCtrl.deleteVideo);
router.get('/detail/:id', propertyCtrl.getPropertyDetails);

module.exports = router;
