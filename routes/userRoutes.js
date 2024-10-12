const express = require('express');
const passport = require('passport');
const userController = require('../controllers/ userController');

const router = express.Router();

router.get('/secrets', userController.getSecrets);
router.post('/submit-secret-form', userController.submitSecret);
router.post('/api/votes', userController.voteSecret);
router.get('/', userController.home);
router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/about', userController.about);
router.get('/contact', userController.contact);
router.get('/privacy', userController.privacy);


module.exports = router;
