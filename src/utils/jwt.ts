import jwt from "jsonwebtoken";
import { IUserToken } from "./interface";
import { SECRET } from "./env";

export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "4h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
