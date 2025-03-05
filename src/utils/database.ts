import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      dbName: "db-tspbk",
    });
    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(`Database connection error: ${error}`);
  }
};

export default dbConnection;
