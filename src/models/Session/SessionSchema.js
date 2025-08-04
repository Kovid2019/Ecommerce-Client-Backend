import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    association: {
      type: String,
    },
    expire: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 36000000000), // 60min * 60sec * 1000ms = 1 hour
      expires: 0, // This will automatically delete the document after 1 hour
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("session", sessionSchema); //sessions collection
