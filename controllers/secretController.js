const User = require("../models/user");

exports.getSecrets = (req, res) => {
  User.find({ secret: { $ne: null } }, (err, foundUsers) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("secrets", { usersWithSecrets: foundUsers, upvoted: false, downvoted: false });
  });
};

exports.getSecretForm = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secret-form");
  } else {
    res.redirect("/login");
  }
};

exports.submitSecretForm = (req, res) => {
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, (err, foundUser) => {
    if (err) return res.status(500).send(err);

    foundUser.secret.push({ title: submittedSecret });
    foundUser.save((err) => {
      if (err) return res.status(500).send(err);
      res.redirect("/secrets");
    });
  });
};
