const express = require('express');
const router = express.Router();
const { createCart, updateCart, mineCart, deleteCart, displayCart, countCarts, countCart, updateOrder } = require("../controllers/cartController")
const { isAuthenticated, isAdmin } = require("../middleware/auth");


router.post('/create', isAuthenticated, createCart);
router.post('/update/:id', isAuthenticated, updateCart);
// router.get('/order/find/:id', findOrder);
router.get('/all', displayCart);
router.get('/mine', isAuthenticated, mineCart);
router.get('/countCart/:id', countCart);
router.delete('/delete/:id', isAuthenticated, deleteCart);
// router.put('/order/update/:id', updateOrder, isAuthenticated);


module.exports = router;