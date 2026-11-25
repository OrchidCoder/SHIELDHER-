
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("--------------------------------------");
    console.log("       MONGODB CONNECTED");
    console.log("--------------------------------------");
    console.log(`Database Host: ${connection.connection.host}`);
    console.log(`Database Name: ${connection.connection.name}`);
    console.log("--------------------------------------");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
