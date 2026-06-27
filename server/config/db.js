const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emergency_room";
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("🚨 DATABASE WARNING: MongoDB Connection Failed ->", err.message);
    console.log("🛡️ FAIL-SAFE MODE: Server keeps running to serve client requests with backup layers.");
  }
};

module.exports = connectDB;