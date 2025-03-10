import mongoose, { ObjectId } from "mongoose";
import * as yup from "yup";
import { serviceDAO } from "../utils/schema";

const Schema = mongoose.Schema;

export type TService = yup.InferType<typeof serviceDAO>;

export interface Service extends Omit<TService, "worshipLeader" | "songList"> {
  worshipLeader: ObjectId;
  songList: ObjectId[];
}

const ServiceSchema = new Schema<Service>(
  {
    date: {
      type: String,
      required: true,
    },
    musicDirector: {
      type: String,
      required: true,
    },
    worshipLeader: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "WorshipLeader",
    },
    songList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Song",
    },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model("Service", ServiceSchema);
export default ServiceModel;
