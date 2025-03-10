import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import serviceController from "../controllers/service.controller";

const serviceRoute = express.Router();

serviceRoute.post(
  "/service/add",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  serviceController.addService
);
serviceRoute.put(
  "/service/update/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  serviceController.updateService
);
serviceRoute.delete(
  "/service/delete/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  serviceController.deleteService
);
serviceRoute.get(
  "/services",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  serviceController.findAll
);
serviceRoute.get(
  "/service",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  serviceController.findOne
);

export default serviceRoute;
