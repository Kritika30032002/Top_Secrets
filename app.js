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

//mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: [String],
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
      callbackURL: `${process.env.PUBLIC_BASENAME}auth/google/secrets`,
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
  res.render("contact.ejs");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err.message });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.send({
            success: true,
            message: "Registration Successful, Login to continue",
          });
        });
      }
    }
  );
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    // Check for errors during authentication
    if (err) {
      return next(err);
    }
    // Check if authentication failed
    if (!user) {
      // Send success-fail-message, further raise toast notifications
      res.send({ success: false, message: info.message });
    }
    // If authentication succeeded, log in the user
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Send success-true-message, further redirects to secrets page
      res.send({ success: true, message: "Login Successful!" });
    });
  })(req, res, next);
});

app.get("/secrets", function (req, res) {
  User.find({ secret: { $ne: null } }, function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
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

        foundUser.secret.push(submittedSecret);

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
  req.logout(function(err) {
    if (err) {
      console.error('Error during logout:', err);
      return res.redirect("/"); // Handle errors gracefully, redirect to home or login page
    }

    res.redirect("/");
  });
});

// Catch-all route for 404 errors
app.get('*', (req, res) => {
  // Redirect to a specific URL or send a custom 404 response

  res.status(404).render("404-page");
});

app.listen(3000, () => {
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
  console.log(`Server is running on 3000`);
});
