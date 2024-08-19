const express = require('express');
const router = express.Router();
const { createProduct, countProducts, findProduct, searchProduct, displayProduct, deleteProduct, productCategory, updateProduct } = require("../controllers/productController")
const { isAuthenticated, isAdmin } = require("../middleware/auth");


router.post('/create', isAuthenticated, isAdmin, createProduct);
router.get('/find/:id', findProduct);
router.get('/search/:id', searchProduct);
router.get('/all', displayProduct);
router.get('/countProducts', countProducts);
router.delete('/delete/:id', deleteProduct);
router.put('/update/:id', isAuthenticated, isAdmin, updateProduct);
router.get('/categories', productCategory);





module.exports = router;