import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
    },
    Manager: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Team = model("Team", teamSchema, "team_info");
export default Team;
