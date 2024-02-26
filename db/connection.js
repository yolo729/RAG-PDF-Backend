const mongoose = require("mongoose");
const env = require("dotenv").config();

const connectDb = async () => {
  try {
    const env = process.env.ENV;
    const mongo_url =
      env === "dev" ? process.env.MONGODB_URL : process.env.AZURE_MONGODB_URL;
    const connect = await mongoose.connect(mongo_url);
    console.log("Database connected: ");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
