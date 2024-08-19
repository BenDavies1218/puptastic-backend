import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  mainImageUrl: {
    type: String,
    required: true,
  },
  allImages: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
