const express = require('express'); 
const router = express.Router();
const categoryController = require('../controllers/categoryController'); 
const authMiddleware  = require('../middleware/authMiddleware'); 

router.post('/', authMiddleware('admin'), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id',authMiddleware('admin'), categoryController.getCategoryById);
router.put('/:id',authMiddleware('admin'), categoryController.updateCategory);
router.delete('/:id',authMiddleware('admin'), categoryController.deleteCategory);

module.exports = router;