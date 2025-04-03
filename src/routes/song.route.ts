import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import songController from "../controllers/song.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const songRoute = express.Router();

songRoute.post(
  "/song/add",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  songController.addSong
);
songRoute.put(
  "/song/update/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  songController.updateSong
);
songRoute.get(
  "/songs",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  songController.findAll
);
songRoute.get(
  "/song/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  songController.findOne
);
songRoute.delete(
  "/song/delete/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  songController.deleteSong
);

export default songRoute;
