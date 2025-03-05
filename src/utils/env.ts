import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URL: string = process.env.DATABASE_URL || "";
const SECRET: string = process.env.SECRET || "";

export { PORT, MONGO_URL, SECRET };
