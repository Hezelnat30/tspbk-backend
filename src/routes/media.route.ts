import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";

const mediaRoute = express.Router();

mediaRoute.post(
  "/media/upload-chord",
  [authMiddleware, mediaMiddleware.single("file")],
  mediaController.single
);
mediaRoute.post(
  "/media/add-profile",
  [authMiddleware, mediaMiddleware.single("file")],
  mediaController.single
);
mediaRoute.delete("/media/remove", authMiddleware, mediaController.remove);

export default mediaRoute;
