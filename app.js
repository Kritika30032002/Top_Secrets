require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const findOrCreate = require('mongoose-findorcreate');
// const bcrypt = require("bcrypt");
// const saltRounds=10;
// const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  secret:String,
  facebookId:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

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

app.get("/",function(req,res){
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/about",function(req,res){
  res.render("about");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req,res){
   User.find({"secret": {$ne:null}},function(err,foundUsers){
     if(err){
      //  console.log(err);
     }
     else{
       if(foundUsers){
         res.render("secrets",{usersWithSecrets:foundUsers});
       }
     }
   });
});

app.get("/submit",function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }
  else{
    res.redirect("/login");
  }
});

app.post("/submit",function(req,res){
     const submittedSecret = req.body.secret;
    //  console.log(req.user.id);

     User.findById(req.user.id,function(err,foundUser){
       if(err){
        //  console.log(err);
       }
       else{
         if(foundUser){
           foundUser.secret=submittedSecret;
           foundUser.save(function(){
             res.redirect("/secrets");
           });
         }
       }
     });
});


app.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



app.post("/register",function(req,res){

     User.register({username:req.body.username},req.body.password,function(err,user){
       if(err){
        //  console.log(err);
         res.redirect("/register");
       }
       else{
          passport.authenticate("local")(req,res,function(){
           res.redirect("/secrets");
         });
       }
     });

  });

app.post("/login",function(req,res){

      const user = new User({
           username:req.body.username,
           password:req.body.password
      });

      req.login(user,function(err){
          if(err){
            // console.log(err);
          }
          else{
            passport.authenticate("local")(req,res,function(){
              res.redirect("/secrets");
            });
          }
      });

    });


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

app.listen(3000,function(){
    // console.log("Server started on port 3000.");
});
