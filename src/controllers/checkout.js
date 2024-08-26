import { Router } from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import Product from "../models/Product.js"; // Adjust the path according to your project structure

dotenv.config();
const router = Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ message: "Products array is missing or invalid" });
    }

    // Fetch product details from the database
    const productIds = products.map((product) => product.id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const lineItems = products.map((product) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === product.id);
      if (!dbProduct) {
        throw new Error(`Product with ID ${product.id} not found`);
      }
      return {
        price_data: {
          currency: "aud",
          product_data: {
            name: dbProduct.name,
            images: [dbProduct.mainImageUrl],
          },
          unit_amount: Math.round(dbProduct.price * 100), // Use price from the database
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(200).json({
      message: "Checkout successful!",
      id: session.id,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
