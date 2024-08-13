import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    member: Array,
  },
  {
    timestamps: true,
  }
);
const chatModel=mongoose.model("chat",chatSchema);
export default chatModel
