const Category = require("../models/categoryModel");
const colors = require('colors');


exports.createCategory = async (req, res, next) => {
    try {
        const { nameCategory } = req.body;
        const newCategory = await Category({
            nameCategory,
        });
        await newCategory.save();

        if (!newCategory) return res.status(400).json([{ message: 'Category not created', type: 'error' }]);

        res.json(newCategory)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.updateCategory = async (req, res) => {
    try {
        const { nameCategory } = req.body;
        const category = await Category.findOneAndUpdate({ _id: req.params.id }, { nameCategory }, { new: true });
        res.json(category);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}


//get all caregories
exports.getCategories = async (req, res, next) => {

    try {
        const categories = await Category.find();
        res.json(categories)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json(category);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

// delete Category and Category image in cloudinary
exports.deleteCategory = async (req, res, next) => {

    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.json({
            categoryId: req.params.id,
            toasts: [{ message: 'Blog deleted', type: 'success' }]
        })

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');

    }

}

