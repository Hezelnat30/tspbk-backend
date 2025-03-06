import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      dbName: "db-tspbk",
    });
    return Promise.resolve(`Database connected at ${MONGO_URL}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnection;
