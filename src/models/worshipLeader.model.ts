import mongoose from "mongoose";
import { WorshipLeader } from "../utils/interface";
import { GENDER } from "../utils/constant";

const Schema = mongoose.Schema;

const WorshipLeaderSchema = new Schema<WorshipLeader>(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: [GENDER.MALE, GENDER.FEMALE],
      required: true,
    },
    joinDate: {
      type: String || Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const WorshipLeaderModel = mongoose.model("WorshipLeader", WorshipLeaderSchema);
export default WorshipLeaderModel;
