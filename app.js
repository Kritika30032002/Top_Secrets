require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('./auth/passport');  // Authentication logic
require('./db/mongoose');     // Database connection

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

app.get("*", (req, res) => {
    res.status(404).render("404-page");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
