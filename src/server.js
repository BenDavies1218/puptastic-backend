import express from "express";
import cors from "cors";
import productsRouter from "./controllers/products.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/products", productsRouter);

// 404 HANDLING ROUTE
app.use((req, res) => {
  res.status(404).json({
    message: "404 Page Not Found!",
  });
});

// ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
  console.error(error.stack); // Log the error stack for debugging
  res.status(error.status || 500).json({
    message: "An error occurred",
    error: error.message,
  });
});

// EXPORT THE APP
export default app;
