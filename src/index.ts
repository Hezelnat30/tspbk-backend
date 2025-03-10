import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./utils/env";
import connect from "./utils/database";
import authRouter from "./routes/auth.route";
import songRoute from "./routes/song.route";
import mediaRoute from "./routes/media.route";
import dbConnection from "./utils/database";
import worshipLeaderRoute from "./routes/worshipLeader.route";
import serviceRoute from "./routes/service.route";

const app = express();
app.use(cors());
app.use(express.json());

function init() {
  try {
    dbConnection();
    app.get("/", (req, res: Response) => {
      res.status(200).json({
        message: "Server is running!",
        data: null,
      });
    });

    const apiRoutes = [
      authRouter,
      songRoute,
      mediaRoute,
      worshipLeaderRoute,
      serviceRoute,
    ];

    apiRoutes.forEach((route) => app.use("/api/v1", route));

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();

export default app;
