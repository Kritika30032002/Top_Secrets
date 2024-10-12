const mongoose = require('mongoose');

// Disable strict query mode for Mongoose
mongoose.set('strictQuery', false);

// Connect to the MongoDB server using connection string from environment variables
mongoose.connect(process.env.MONGO_SERVER, {
    useNewUrlParser: true, // Use the new URL parser to handle connection strings
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
}).then(() => {
    console.log("Database connected successfully"); // Log success message upon successful connection
}).catch((error) => {
    console.log("DB connection failed", process.env.MONGO_SERVER); // Log error message if connection fails
});
