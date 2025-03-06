import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URL: string = process.env.DATABASE_URL || "";
const SECRET: string = process.env.SECRET || "";
const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";

export {
  PORT,
  MONGO_URL,
  SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
