const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, getCategories, getCategoryById, deleteCategory } = require("../controllers/categoryController")
const { isAuthenticated, isAdmin } = require("../middleware/auth");


router.post('/create', isAuthenticated, isAdmin, createCategory);
router.put('/update/:id', isAuthenticated, isAdmin, updateCategory);
router.get('/all', getCategories);
router.get('/find/:id', getCategoryById);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteCategory);



module.exports = router;