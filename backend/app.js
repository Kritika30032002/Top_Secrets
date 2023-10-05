require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
// const bcrypt = require("bcrypt");
// const saltRounds=10;
// const md5 = require("md5");

const app = express();

// Set up middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Include the route files
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const homeRoutes = require('./routes/homeRoutes.js');

// Use the route files
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT} http://localhost:${PORT}.`);
});


// previous code:

// app.post("/register",function(req,res){
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     const newUser = new User({
//       email:req.body.username,
//         password:hash
//       // password:md5(req.body.password)
//     });
//
//     newUser.save(function(err){
//       if(err){
//         console.log(err);
//       }else{
//         res.render("secrets");
//       }
//     });
// });
//
// });

// app.post("/login",function(req,res){
//   const username= req.body.username;
//   const password= req.body.password;
//
//   User.findOne({email:username},function(err,foundUser){
//     if(err){
//       console.log(err);
//     }
//     else{
//       if(foundUser){
//         bcrypt.compare(password, foundUser.password, function(err, result) {
//     // result == true
//       if(result ===true){
//       res.render("secrets");
//     }
// });
//
//         }
//       }
//
//   });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// passport.use(new FacebookStrategy({
//   clientID: FACEBOOK_APP_ID, // Include your App ID
//   clientSecret: FACEBOOK_APP_SECRET, // Include you App Secret
//   callbackURL: "http://localhost:3000/auth/facebook/secrets"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));