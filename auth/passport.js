const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.PUBLIC_BASENAME}auth/google/secrets`,
}, 

function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, { username: profile.displayName }, (err, user) => {
        return cb(err, user);
    });
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.PUBLIC_BASENAME}auth/facebook/secrets`,
}, 


function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, { username: profile.displayName }, (err, user) => {
        return cb(err, user);
    });
}));
