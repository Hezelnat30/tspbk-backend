import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./utils/env";
import connect from "./utils/database";
import dbConnection from "./utils/database";
import authRouter from "./routes/auth.route";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

async function init() {
  try {
    const dbStatus = await dbConnection();
    console.log("Database status: ", dbStatus);

    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api/v1", authRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
