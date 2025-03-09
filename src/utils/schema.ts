import * as yup from "yup";
import { GENDER } from "./constant";

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(5, "Username must be at least 5 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

export const addSongSchema = yup.object({
  title: yup
    .string()
    .min(6, "Title must be at least 6 characters")
    .required("Title is required"),
  artist: yup
    .string()
    .min(3, "Artist must be at least 3 characters")
    .required("Artist is required"),
  youtubeUrl: yup.string().required("Youtube URL is required"),
  chordImageUrl: yup.string().required("Please upload an image chord"),
});

export const updateSongSchema = addSongSchema.partial();

export const addWorshipLeaderSchema = yup.object({
  name: yup
    .string()
    .min(6, "Name must be at least 6 characters")
    .required("Name is required"),
  gender: yup
    .string()
    .oneOf([GENDER.MALE, GENDER.FEMALE])
    .required("Gender is required"),
  joinDate: yup.string().required("Join date is required"),
  isActive: yup.boolean().default(true),
  imageUrl: yup.string(),
});

export const updateWorshipLeaderSchema = addWorshipLeaderSchema.partial();
