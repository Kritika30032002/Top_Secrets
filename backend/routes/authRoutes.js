const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/secrets', authController.googleAuthCallback);
router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/secrets', authController.facebookAuthCallback);

module.exports = router;
