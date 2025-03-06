import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const dbConnection = async () => {
  try {
    if (!MONGO_URL) return Promise.reject("Connection string not found");
    await mongoose.connect(MONGO_URL, {
      dbName: "db-tspbk",
    });
    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(`Database connection error: ${error}`);
  }
};

export default dbConnection;
