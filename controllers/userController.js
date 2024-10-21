const User = require('../models/User');

// Fetch and display secrets from users who have shared them
exports.getSecrets = (req, res) => {
    // Find all users with non-null secrets
    User.find({ secret: { $ne: null } }, (err, foundUsers) => {
        if (err) {
            console.log(err); // Log errors, if any
        } else {
            if (foundUsers) {
                // Render the 'secrets' page with the found users and their secrets
                res.render("secrets", {
                    usersWithSecrets: foundUsers,
                    upvoted: false, // Initialize upvoted and downvoted status
                    downvoted: false,
                });
            }
        }
    });
};

// Allow the logged-in user to submit a secret
exports.submitSecret = (req, res) => {
    const submittedSecret = req.body.secret; // Get the secret from the request body
    User.findById(req.user.id, (err, foundUser) => {
        if (err) {
            console.log(err); // Log errors, if any
        } else {
            if (foundUser) {
                // Push the submitted secret into the user's secret array
                foundUser.secret.push({ title: submittedSecret });
                // Save the updated user with the new secret
                foundUser.save((err) => {
                    if (err) {
                        console.log(err); // Log errors during saving
                    } else {
                        res.redirect("/secrets"); // Redirect to secrets page after saving
                    }
                });
            }
        }
    });
};

// Handle upvoting and downvoting of secrets
exports.voteSecret = async (req, res) => {
    try {
        // Extract vote information from the request body
        const { upvoteCount, downvoteCount, index, username } = req.body;
        // Find the user by their username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' }); // Handle user not found
        if (index < 0 || index >= user.secret.length) return res.status(400).json({ error: 'Invalid secret index' });

        // Update the vote counts for the selected secret
        user.secret[index].upvote = upvoteCount;
        user.secret[index].downvote = downvoteCount;

        // Save the user after updating votes
        await user.save();
        res.json({ message: 'Vote updated successfully', user });
    } catch (error) {
        console.error(error); // Log any errors during the process
        res.status(500).json({ error: 'Internal server error' }); // Handle internal server error
    }
};

// Render the home page
exports.home = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};

// Render the login page
exports.getlogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};

// Handle login form submission and authentication
exports.postlogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Handle error during authentication
        }
        if (!user) {
            // Render login page with error message if authentication fails
            return res.render('login', { error: info.message });
        }
        // Log in the user after successful authentication
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle login error
            }
            return res.redirect('/secrets'); // Redirect to secrets page after login
        });
    })(req, res, next);
};

// Render the about page
exports.about = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};

// Render the contact page
exports.contact = async (req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};

// Render the registration page
exports.getregister = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};

// Handle user registration and automatic login
exports.postregister = (req, res) => {
    // Register a new user using the provided username and password
    User.register(
        { username: req.body.username }, // Create a new user with the submitted username
        req.body.password, // Set the password for the new user
        (err, user) => {
            if (err) {
                console.error(err); // Log the registration error
                return res.render('register', { error: err.message }); // Show error message on registration page
            }
            // Automatically log in the user after successful registration
            passport.authenticate('local')(req, res, () => {
                res.redirect('/login'); // Redirect to the login page after registration
            });
        }
    );
};

// Render the privacy policy page
exports.privacy = async (req, res) => {
    try {
        res.render('privacy');
    } catch (error) {
        console.error(error); // Log any rendering errors
    }
};
