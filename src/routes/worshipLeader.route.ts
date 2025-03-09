import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import worshipLeaderController from "../controllers/worshipLeader.controller";

const worshipLeaderRoute = express.Router();

worshipLeaderRoute.post(
  "/worship-leader/add",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  worshipLeaderController.addWorshipLeader
);
worshipLeaderRoute.put(
  "/worship-leader/update/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  worshipLeaderController.updateWorshipLeader
);
worshipLeaderRoute.delete(
  "/worship-leader/delete/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  worshipLeaderController.deleteWorshipLeader
);
worshipLeaderRoute.get("/worship-leaders", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  worshipLeaderController.findAll,
]);
worshipLeaderRoute.get("/worship-leader/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  worshipLeaderController.findOne,
]);

export default worshipLeaderRoute;
