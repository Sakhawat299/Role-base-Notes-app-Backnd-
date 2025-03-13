require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesapp"; 
    console.log("MONGO_URI from .env:", process.env.MONGO_URI);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    });

    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
