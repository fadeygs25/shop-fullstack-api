const express = require('express');
const router = express.Router();
const { signup, google, signin, countUsers, forgotPass, logout, allUsers, updateUser, findUser, userProfile, deleteUser, userReqToken } = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");



router.post('/signup', signup);
router.post('/google', google);
router.put('/update/:id', updateUser);
router.post('/forgot', forgotPass);
router.post('/signin', signin);
router.get('/logout', logout);
router.get('/getme', isAuthenticated, userProfile);
router.get('/userReqToken/:id', isAuthenticated, userProfile);
router.get('/all', isAuthenticated, allUsers);
router.get('/countUsers', countUsers);
router.get('/find/:id', findUser);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteUser);



module.exports = router; 