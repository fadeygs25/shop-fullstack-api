const express = require('express');
const router = express.Router();
const { createSeed } = require("../controllers/seedController")

router.get('/seed', createSeed);


module.exports = router;