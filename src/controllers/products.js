import { Router } from "express";
import Product from "../models/product.js";
import {
  databaseConnect,
  databaseClear,
  databaseClose,
} from "../utils/database.js";

const router = Router();

// GET all products
router.get("/", async (request, response, next) => {
  try {
    const products = await Product.find({});
    response.status(200).json({
      message: "Hello, from the products controller!",
      products,
    });
  } catch (error) {
    next(error);
  }
});

// POST a new product
router.post("/", async (request, response, next) => {
  try {
    const bodyData = request.body;
    const product = await Product.create(bodyData);
    response.status(201).json({
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE all products
router.get("/deleteall", async (request, response, next) => {
  try {
    await databaseClear();
    response.status(200).json({
      message: "All products have been deleted.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
