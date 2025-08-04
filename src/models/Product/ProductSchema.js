import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Product title
    description: String,
    slug: { type: String, required: true, index: true }, // Description text
    price: { type: Number, required: true }, // Normal price
    discountPrice: Number, // Discounted price if any
    images: [String], // Array of image URLs
    thumbnail: String, // Main thumbnail image
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sale: { type: Boolean, default: false },
    mainCategory: { type: String, required: true },

    productPath: { type: String, required: true, index: true },
    stock: Number,
    sizes: [String],
    colors: [String],
    brand: String,
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    tags: [String],

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // References to reviews
    videoUrl: { type: String },
  },
  { timestamps: true }
);

const productCollection = mongoose.model("Product", productSchema);
export default productCollection;
