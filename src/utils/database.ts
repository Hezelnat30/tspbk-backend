import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const dbConnection = () => {
  try {
    mongoose.connect(MONGO_URL, {
      dbName: "db-tspbk",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  const dbStatus = mongoose.connection;
  dbStatus.once("open", () => {
    console.log("Database is connected");
  });

  dbStatus.on("error", (error) => {
    console.log(error);
  });
};

export default dbConnection;
