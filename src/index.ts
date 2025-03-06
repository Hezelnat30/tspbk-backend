import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./utils/env";
import connect from "./utils/database";
import authRouter from "./routes/auth.route";
import songRoute from "./routes/song.route";
import mediaRoute from "./routes/media.route";

async function init() {
  // Express app
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res: Response) => {
    res.status(200).json({
      message: "Server is running!",
      data: null,
    });
  });

  const apiRoutes = [authRouter, songRoute, mediaRoute];
  apiRoutes.forEach((route) => app.use("/api/v1", route));

  try {
    const dbStatus = await connect();
    console.log("Database status:", dbStatus);
  } catch (dbError) {
    console.error("Database connection error:", dbError);
    // Aplikasi tetap berjalan meskipun koneksi database gagal
  }

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

init();
