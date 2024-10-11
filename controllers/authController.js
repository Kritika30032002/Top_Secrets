const passport = require("passport");
const User = require("../models/user");

exports.getHome = (req, res) => {
  res.render("home");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = (req, res) => {
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/login");
    });
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) return res.render("login", { error: info.message });
    req.logIn(user, function (err) {
      if (err) return next(err);
      res.redirect("/secrets");
    });
  })(req, res, next);
};

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
};

// Google OAuth
exports.authGoogle = passport.authenticate("google", { scope: ["profile"] });

exports.authGoogleSecrets = passport.authenticate("google", { failureRedirect: "/login" }, (req, res) => {
  res.redirect("/secrets");
});

// Facebook OAuth
exports.authFacebook = passport.authenticate("facebook");

exports.authFacebookSecrets = passport.authenticate("facebook", { failureRedirect: "/login" }, (req, res) => {
  res.redirect("/secrets");
});
