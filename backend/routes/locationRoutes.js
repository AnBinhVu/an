const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware  = require('../middleware/authMiddleware'); 

router.get('/',authMiddleware(), locationController.getLocations);
router.post('/',authMiddleware('admin'), locationController.createLocation);
router.put('/:id',authMiddleware('admin'), locationController.updateLocation);
router.delete('/:id',authMiddleware('admin'), locationController.deleteLocation);

module.exports = router;