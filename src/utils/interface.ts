import { Request } from "express";
import { Types } from "mongoose";
import { GENDER } from "./constant";

export interface User {
  username: string;
  password: string;
  role: string;
}

export type TRegister = Omit<User, "role">;

export interface IUserToken extends Omit<User, "password"> {
  id?: Types.ObjectId;
}

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface Song {
  title: string;
  artist: string;
  youtubeUrl: string;
  chordImageUrl: string;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface WorshipLeader {
  name: string;
  gender: GENDER;
  joinDate: string | Date;
  isActive: boolean;
  imageUrl?: string;
}
