const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile'] });

exports.googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/secrets',
});

exports.facebookAuth = passport.authenticate('facebook');

exports.facebookAuthCallback = passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/secrets',
});
