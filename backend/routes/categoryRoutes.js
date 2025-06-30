const express = require('express'); 
const router = express.Router();
const categoryController = require('../controllers/categoryController'); 

router.post('/', categoryController.createCategory);// tạo danh mục mới
router.get('/', categoryController.getCategories);//xem tất cả danh mục
router.get('/:id', categoryController.getCategoryById);//xem danh mục theo id
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;