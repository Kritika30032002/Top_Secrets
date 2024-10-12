require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import Express framework
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const session = require('express-session'); // Middleware for session management
const passport = require('passport'); // Import Passport for authentication
require('./auth/passport');  // Import the authentication strategy configuration
require('./db/mongoose');     // Import the database connection setup

const app = express(); // Create an instance of an Express application

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));
// Middleware to parse JSON requests
app.use(express.json());
// Set the view engine to EJS for rendering templates
app.set("view engine", "ejs");
// Middleware to parse URL-encoded bodies (from forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware configuration
app.use(session({
    secret: "Our little secret.", // Secret used for signing the session ID
    resave: false, // Prevents resaving of unmodified sessions
    saveUninitialized: false, // Prevents creation of uninitialized sessions
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Import user-related routes
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes); // Use userRoutes for all routes prefixed with '/'

// Handle 404 errors for any routes not matched above
app.get("*", (req, res) => {
    res.status(404).render("404-page");
});

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
