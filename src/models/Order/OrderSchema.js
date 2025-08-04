import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      method: { type: String, default: "Card" },
      transactionId: {
        type: String,
      },
      status: {
        type: String,
        default: "Paid",
      },
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },

    guestInfo: {
      guestId: {
        type: String,
      },
      email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        required: function () {
          return this.isGuest;
        },
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      phoneNumber: { type: String },
    },
    shippingAddresses: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    orderStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Dispatched",
        "On The Way",
        "Delivered",
      ],
      default: "Order Placed",
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
