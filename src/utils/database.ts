import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const dbConnection = () => {
  try {
    mongoose.connect(MONGO_URL, {
      dbName: "db-tspbk",
    });
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", () => {
    console.log("Database connected at :", MONGO_URL);
  });
  dbConnection.on("error", (error) => {
    console.log("Database connection error:", error);
  });
};

export default dbConnection;
