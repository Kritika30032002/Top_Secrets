const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/secrets', userController.secrets);
router.get('/submit', userController.submitSecret);
router.post('/submit', userController.postSecret);
router.get('/logout', userController.logout);

module.exports = router;
