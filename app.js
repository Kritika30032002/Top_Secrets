require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

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

// Import routes
const serverRoutes = require('./routes/server');
app.use(serverRoutes);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected successfully");
}).catch((error) => {
  console.log("DB connection failed", process.env.MONGO_SERVER);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
