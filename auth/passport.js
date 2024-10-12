const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Use passport-local-mongoose's createStrategy for local authentication
passport.use(User.createStrategy());

// Serialize the user ID to save in the session for tracking
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize the user from the session by fetching the user data based on the ID stored in the session
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,  // Client ID for Google OAuth, stored in environment variables
    clientSecret: process.env.GOOGLE_SECRET,  // Client Secret for Google OAuth, stored in environment variables
    callbackURL: `${process.env.PUBLIC_BASENAME}auth/google/secrets`,  // Callback URL after successful authentication
}, 
// Function to handle the Google OAuth response
function (accessToken, refreshToken, profile, cb) {
    // Find or create a user based on their Google ID and profile data
    User.findOrCreate({ googleId: profile.id }, { username: profile.displayName }, (err, user) => {
        return cb(err, user);  // Return the user to Passport for session handling
    });
}));

// Facebook OAuth strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,  // Client ID for Facebook OAuth, stored in environment variables
    clientSecret: process.env.FACEBOOK_APP_SECRET,  // Client Secret for Facebook OAuth, stored in environment variables
    callbackURL: `${process.env.PUBLIC_BASENAME}auth/facebook/secrets`,  // Callback URL after successful authentication
}, 
// Function to handle the Facebook OAuth response
function (accessToken, refreshToken, profile, cb) {
    // Find or create a user based on their Facebook ID and profile data
    User.findOrCreate({ facebookId: profile.id }, { username: profile.displayName }, (err, user) => {
        return cb(err, user);  // Return the user to Passport for session handling
    });
}));
