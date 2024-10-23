import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.MONGOURI;

const connectDB = async () => {
  try {
    mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
connectDB();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Mongodb connection error"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;
