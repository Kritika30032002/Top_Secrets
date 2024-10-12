const User = require('../models/User');

exports.getSecrets = (req, res) => {
    User.find({ secret: { $ne: null } }, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render("secrets", {
                    usersWithSecrets: foundUsers,
                    upvoted: false,
                    downvoted: false,
                });
            }
        }
    });
};

exports.submitSecret = (req, res) => {
    const submittedSecret = req.body.secret;
    User.findById(req.user.id, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret.push({ title: submittedSecret });
                foundUser.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/secrets");
                    }
                });
            }
        }
    });
};

exports.voteSecret = async (req, res) => {
    try {
        const { upvoteCount, downvoteCount, index, username } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (index < 0 || index >= user.secret.length) return res.status(400).json({ error: 'Invalid secret index' });

        user.secret[index].upvote = upvoteCount;
        user.secret[index].downvote = downvoteCount;

        await user.save();
        res.json({ message: 'Vote updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.home = async  (req, res) => {
    try {
        res.render('home')
    }catch(error){
        console.error(error);
    }

};
exports.login = async  (req, res) => {
    try {
        res.render('login')
    }catch(error){
        console.error(error);
    }

};
exports.about = async  (req, res) => {
    try {
        res.render('about')
    }catch(error){
        console.error(error);
    }

};
exports.contact = async  (req, res) => {
    try {
        res.render('contact')
    }catch(error){
        console.error(error);
    }

};
exports.register = async  (req, res) => {
    try {
        res.render('register')
    }catch(error){
        console.error(error);
    }

};
exports.privacy = async  (req, res) => {
    try {
        res.render('privacy')
    }catch(error){
        console.error(error);
    }

};