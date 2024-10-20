const express = require("express");
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const secretController = require('../controllers/secretController');
const userController = require('../controllers/userController');

// Authentication Routes
router.get("/", authController.getHome);
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);

// Google OAuth Routes
router.get("/auth/google", authController.authGoogle);
router.get("/auth/google/secrets", authController.authGoogleSecrets);

// Facebook OAuth Routes
router.get("/auth/facebook", authController.authFacebook);
router.get("/auth/facebook/secrets", authController.authFacebookSecrets);

// Secret Routes
router.get("/secrets", secretController.getSecrets);
router.get("/submit-secret-form", secretController.getSecretForm);
router.post("/submit-secret-form", secretController.submitSecretForm);

// User Routes (optional, can add more functionalities)
router.get("/about", userController.getAbout);
router.get("/contact", userController.getContact);
router.get("/privacy", userController.getPrivacy);

module.exports = router;
