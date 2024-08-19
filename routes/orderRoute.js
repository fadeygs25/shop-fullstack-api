const express = require('express');
const router = express.Router();
const { createOrder, countOrders, updateOrder, displayOrder, findOrder, payOrder, deleteOrder } = require("../controllers/orderController")
const { isAuthenticated, isAdmin } = require("../middleware/auth");


router.post('/create', isAuthenticated, createOrder);
router.get('/find/:id', findOrder);
router.get('/all', displayOrder);
router.get('/countOrders', countOrders);
router.put('/:id/pay', payOrder);
router.delete('/delete/:id', deleteOrder);
router.put('/update/:id', updateOrder);


module.exports = router;