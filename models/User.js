const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const passportLocalMongoose = require('passport-local-mongoose'); // Import Passport-Local-Mongoose for user authentication
const findOrCreate = require('mongoose-findorcreate'); // Import Mongoose FindOrCreate plugin for Google/Facebook authentication

// Define the user schema
const userSchema = new mongoose.Schema({
    username: String, // Username of the user
    password: String, // Password of the user (hashed)
    googleId: String, // Google authentication ID
    facebookId: String, // Facebook authentication ID
    secret: [{ // Array of secrets submitted by the user
        title: { type: String, required: true }, // Title of the secret
        upvote: { type: Number, default: 0 }, // Upvote count for the secret
        downvote: { type: Number, default: 0 }, // Downvote count for the secret
    }]
});

// Attach Passport-Local-Mongoose plugin to userSchema for authentication
userSchema.plugin(passportLocalMongoose);

// Attach FindOrCreate plugin to userSchema for finding or creating users based on social auth
userSchema.plugin(findOrCreate);

// Export the User model based on userSchema
module.exports = mongoose.model('User', userSchema);
