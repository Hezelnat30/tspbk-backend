import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/auth/signup", authController.register);
authRouter.post("/auth/signin", authController.login);
authRouter.get("/auth/get-user", authMiddleware, authController.me);

export default authRouter;
