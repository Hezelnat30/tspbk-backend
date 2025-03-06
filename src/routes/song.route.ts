import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import songController from "../controllers/song.controller";

const songRoute = express.Router();

songRoute.post("/song/add", authMiddleware, songController.addSong);
songRoute.put("/song/update/:id", authMiddleware, songController.updateSong);
songRoute.get("/songs", authMiddleware, songController.findAll);
songRoute.get("/song/:id", authMiddleware, songController.findOne);

export default songRoute;
