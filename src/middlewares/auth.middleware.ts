import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interface";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) return response.UNAUTHORIZED(res);

    const [prefix, token] = authorization?.split(" ");

    if (!(prefix === "Bearer" && token)) {
      return response.UNAUTHORIZED(res);
    }

    const user = getUserData(token);

    if (!user) return response.UNAUTHORIZED(res);

    (req as IReqUser).user = user;
    next();
  } catch (error) {
    return response.UNAUTHORIZED(res, error);
  }
};
