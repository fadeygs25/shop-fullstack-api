const express = require('express');
const router = express.Router();
const { createRating, getRatings, getRatingByProduct, countRatings, productRating, deleteRating } = require("../controllers/ratingController")
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post('/create', isAuthenticated, createRating);
router.get('/all', getRatings);
router.get('/find/:id', productRating);
router.get('/byProduct/:id', getRatingByProduct);
router.get('/countRatings', countRatings);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteRating);

module.exports = router;