import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshJWT: {
      type: String,
    },
    profilePicture: {
      type: String, // store as URL or path
    },
    authProvider: {
      type: String, // e.g., 'google', 'facebook', 'local'
      default: "local",
    },
    providerId: {
      type: String, // for OAuth
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    wishList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("User", userSchema);
