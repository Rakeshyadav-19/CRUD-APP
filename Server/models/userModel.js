import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    password: { type: String },
    team_Id: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    role: { type: String, enum: ["Employee", "Admin"], default: "Employee" },
    profile_pic: { type: Buffer },
    contentType: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema, "user_info");
export default User;
