import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnect = async () => {
  const databaseURL =
    process.env.DATABASE_URL || "mongodb://localhost:27017/testpuptastic";
  try {
    await mongoose.connect(databaseURL);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

const databaseClear = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
  } catch (error) {
    console.error("Database clear error:", error);
  }
};

const databaseClose = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Database close error:", error);
  }
};

export { databaseConnect, databaseClear, databaseClose };
