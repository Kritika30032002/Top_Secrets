const User = require('../models/user');

exports.secrets = (req, res) => {
    User.find({ secret: { $ne: null } }, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render('secrets', { usersWithSecrets: foundUsers });
            }
        }
    });
};

exports.submitSecret = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
};

exports.postSecret = (req, res) => {
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(() => {
                    res.redirect('/secrets');
                });
            }
        }
    });
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
