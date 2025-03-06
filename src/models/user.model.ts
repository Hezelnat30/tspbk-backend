import mongoose from "mongoose";
import encryption from "../utils/encryption";
import { ROLES } from "../utils/constant";
import { User } from "../utils/interface";

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.USER],
      default: ROLES.ADMIN,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await encryption.hashPassword(user.password);
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
