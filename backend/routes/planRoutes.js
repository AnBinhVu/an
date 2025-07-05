const express = require('express');
const router = express.Router();
const planCtrl = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', planCtrl.getPlans);
router.post('/', authMiddleware('admin'), planCtrl.createPlan);
router.put('/:id', authMiddleware('admin'), planCtrl.updatePlan);
router.delete('/:id', authMiddleware('admin'), planCtrl.deletePlan);
router.post('/save', authMiddleware('owner'), planCtrl.SavePlan);
router.get('/plans/:id', authMiddleware('owner'), planCtrl.getPlanById);
module.exports = router;
