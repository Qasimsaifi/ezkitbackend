const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, required: true },
  comment: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const RelatedProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Reference to Product
  difficulty: { type: String, required: true }, // Keep difficulty as it’s specific to the relation
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    badge: { type: String },
    images: [{ type: String, required: true }],
    specifications: [{ type: String, required: true }],
    features: [{ type: String, required: true }],
    inTheBox: [{ type: String, required: true }],
    difficulty: { type: String, required: true },
    completionTime: { type: String, required: true },
    reviews: [ReviewSchema],
    relatedProducts: [RelatedProductSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
