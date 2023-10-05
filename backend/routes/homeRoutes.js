const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');

router.get('/', homeController.home);
router.get('/login', homeController.login);
router.get('/about', homeController.about);
router.get('/register', homeController.register);

module.exports = router;
