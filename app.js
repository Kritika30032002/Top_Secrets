require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const axios = require("axios");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: [
    {
      title: { type: String, required: true },
      upvote: { type: Number, default: 0 },
      downvote: { type: Number, default: 0 },
    }
  ],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.PUBLIC_BASENAME}auth/google/secrets`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, (err, existingUser) => {
        if (err) {
          return cb(err);
        }

        if (existingUser) {
          console.log("User already exists, return the existing user");
          return cb(null, existingUser);
        }

        console.log("User does not exist, create a new one")
        const newUser = new User({ googleId: profile.id, username: profile.displayName });
        console.log("id" + newUser.googleId);
        console.log("username" + newUser.username);
        newUser.save((err, user) => {
          if (err) {
            console.error('Error saving new user:', err);
            return cb(err, null);
          }

          console.log('New User saved successfully:', user);
          return cb(null, user);
        });
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.PUBLIC_BASENAME}auth/facebook/secrets`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ facebookId: profile.id }, (err, existingUser) => {
        if (err) {
          return cb(err);
        }

        if (existingUser) {
          console.log("User already exists, return the existing user");
          return cb(null, existingUser);
        }

        console.log("User does not exist, create a new one")
        const newUser = new User({ facebookId: profile.id, username: profile.displayName });
        console.log("id" + newUser.facebookId);
        console.log("username" + newUser.username);
        newUser.save((err, user) => {
          if (err) {
            console.error('Error saving new user:', err);
            return cb(err, null);
          }

          console.log('New User saved successfully:', user);
          return cb(null, user);
        });
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/privacy", function (req, res) {
  res.render("privacy");
});

app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("register", { error: err.message });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/login");
        });
      }
    }
  );
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", { error: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/secrets");
    });
  })(req, res, next);
});

app.get("/secrets", function (req, res) {
  User.find({ secret: { $ne: null } }, function (err, foundUsers) {
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
});

app.get("/submit-secret-form", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secret-form");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit-secret-form", function (req, res) {
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
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error('Error during logout:', err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

app.post('/api/votes', async (req, res) => {
  try {
    const { upvoteCount, downvoteCount, index, username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (index < 0 || index >= user.secret.length) {
      return res.status(400).json({ error: 'Invalid secret index' });
    }

    user.secret[index].upvote = upvoteCount;
    user.secret[index].downvote = downvoteCount;

    await user.save();

    res.json({ message: 'Vote updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/delete-secret
app.post('/api/delete-secret', async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'User is not authenticated.' });
    }
    const { index } = req.body;
    const user = await User.findById(req.user.id); // Assuming user is logged in

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof index === 'number' && index >= 0 && index < user.secret.length) {
      // Remove the secret based on index
      user.secret.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: 'Secret deleted successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid index provided.' });
    }
  } catch (error) {
    console.error('Error deleting secret:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});


// POST /api/save-update-secret
app.post('/api/save-update-secret', async (req, res) => {
  try {
    console.log('User Authenticated:', req.isAuthenticated()); // Check if user is authenticated
    console.log('User ID:', req.user ? req.user.id : 'No user'); // Check user object
    
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'User is not authenticated.' });
    }

      const { index, content } = req.body;

      // Find user using req.user.id
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Validate index
      if (typeof index !== 'number' || index < 0 || index >= user.secret.length) {
          return res.status(400).json({ message: 'Invalid index provided.' });
      }

      // Validate content
      if (typeof content !== 'string') {
          return res.status(400).json({ message: 'Content must be a string.' });
      }

      // Access the secret safely
      const secret = user.secret[index];
      if (!secret || typeof secret.title === 'undefined') {
          return res.status(400).json({ message: 'Secret not found or invalid structure.' });
      }

      // Update the title
      secret.title = content;
      await user.save();

      res.status(200).json({ message: 'Secret updated successfully.' });
  } catch (error) {
      console.error('Error updating secret:', error.message || error);
      res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});



app.get('*', (req, res) => {
  res.status(404).render("404-page");
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("DB connection failed", process.env.MONGO_SERVER);
    });
  console.log(`Server is running on ${process.env.PORT}`);
});
