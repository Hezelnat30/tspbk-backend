import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./utils/env";
import connect from "./utils/database";
import authRouter from "./routes/auth.route";
import songRoute from "./routes/song.route";
import mediaRoute from "./routes/media.route";
import dbConnection from "./utils/database";

const app = express();
app.use(cors());
app.use(express.json());

async function init() {
  try {
    const dbStatus = await dbConnection();
    console.log(dbStatus);

    app.get("/", (req, res: Response) => {
      res.status(200).json({
        message: "Server is running!",
        data: null,
      });
    });

    const apiRoutes = [authRouter, songRoute, mediaRoute];

    apiRoutes.forEach((route) => app.use("/api/v1", route));

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
