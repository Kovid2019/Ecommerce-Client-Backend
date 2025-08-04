import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    product_title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    thumbnail: {
      type: String,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cartCollection = mongoose.model("Cart", CartSchema);
export default cartCollection;
