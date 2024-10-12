const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController'); // Import the user controller

const router = express.Router(); // Create a new Express router

// Route for displaying all secrets
router.get('/secrets', userController.getSecrets);

// Route for handling the submission of a new secret
router.post('/submit-secret-form', userController.submitSecret);

// API route for handling votes on secrets
router.post('/api/votes', userController.voteSecret);

// Home page route
router.get('/', userController.home);

// Routes for login page display and form submission
router.get('/login', userController.getlogin);
router.post('/login', userController.postlogin);

// Routes for registration page display and form submission
router.get('/register', userController.getregister);
router.post('/register', userController.postregister);

// About page route
router.get('/about', userController.about);

// Contact page route
router.get('/contact', userController.contact);

// Privacy policy page route
router.get('/privacy', userController.privacy);

module.exports = router; // Export the router for use in the main application
