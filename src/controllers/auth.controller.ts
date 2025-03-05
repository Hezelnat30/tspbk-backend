import { Request, Response } from "express";
import { IReqUser, TRegister, User } from "../utils/interface";
import { registerSchema } from "../utils/schema";
import UserModel from "../models/user.model";
import response from "../utils/response";
import encryption from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { Error } from "mongoose";
import { create } from "ts-node";
import { formatDate } from "../utils/hooks";

export default {
  async register(req: Request, res: Response) {
    const { username, password } = req.body as unknown as TRegister;
    try {
      await registerSchema.validate({ username, password });
      const existingUser = await UserModel.findOne({ username });

      if (existingUser) return response.ERROR(res, null, "User already exists");

      const result = await UserModel.create({ username, password });

      return response.SUCCESS(res, 201, result, "Signup successful");
    } catch (error) {
      response.ERROR(res, error, "Signup failed");
    }
  },
  async login(req: Request, res: Response) {
    const { username, password } = req.body as unknown as TRegister;
    try {
      const user = await UserModel.findOne({ username });
      if (!user) return response.UNAUTHORIZED(res, "User not found");

      // Password verification
      const passwordVerification: boolean = await encryption.verifyPassword(
        password,
        user.password
      );
      if (!passwordVerification)
        return response.UNAUTHORIZED(res, "Invalid password");

      const token = generateToken({
        role: user.role,
        username: user.username,
      });

      const data = {
        id: user._id,
        token,
      };

      return response.SUCCESS(res, 200, data, "Signin successful");
    } catch (error) {
      response.ERROR(res, error, "Signin failed");
    }
  },
  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findOne({
        username: user?.username,
      }).lean();

      if (!result) return response.UNAUTHORIZED(res, "User not found");

      const data = {
        id: result._id,
        username: result.username,
        role: result.role,
        createdAt: formatDate((result as any).createdAt),
        updatedAt: formatDate((result as any).updatedAt),
      };

      return response.SUCCESS(res, 200, data, "Success Get User");
    } catch (error) {
      return response.ERROR(res, error, "Failed Get User");
    }
  },
};
