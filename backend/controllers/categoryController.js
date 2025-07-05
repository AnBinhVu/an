const Category = require('../models/Category');

//tạo danh mục mới
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        //kiểm tra sự tồn tại
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Danh mục đã tồn tại" });
        }
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({ message: "Tạo danh mục thành công", category: newCategory });
    }catch (error) {
        console.error("Lỗi tạo danh mục:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
};
//lấy danh sách danh mục
const getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        categories = categories.sort((a, b) =>
            a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' })
        );
        res.status(200).json(categories);
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
}

//lấy danh mục theo id
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
}
//cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật danh mục thành công", category: updatedCategory });
    } catch (error) {
        console.error("Lỗi cập nhật danh mục:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
}
//xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }
        res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error) {
        console.error("Lỗi xóa danh mục:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
