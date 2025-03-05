import { Request } from "express";
import { Types } from "mongoose";

enum ROLES {
  ADMIN = "admin",
  USER = "user",
}

enum HTTP_STATUS {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

interface User {
  username: string;
  password: string;
  role: string;
}

type TRegister = Omit<User, "role">;

interface IUserToken extends Omit<User, "password"> {
  id?: Types.ObjectId;
}

interface IReqUser extends Request {
  user?: IUserToken;
}

export { HTTP_STATUS, ROLES, User, TRegister, IUserToken, IReqUser };
