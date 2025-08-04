import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Category name
    slug: { type: String, index: true }, // URL-friendly unique string
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    }, // Parent category reference
    path: { type: String, required: true, unique: true, index: true }, // Materialized path e.g. "/men/shoes"
    level: { type: Number, required: true }, // Depth level in tree, root=1
    description: { type: String }, // Optional description
    icon: { type: String }, // Optional icon url or class
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Flag to highlight featured categories
  },
  { timestamps: true }
);

const categoryCollection = mongoose.model("Category", categorySchema);
export default categoryCollection;
