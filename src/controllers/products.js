import { Router } from "express";
import Product from "../models/product.js";
import dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { databaseClear } from "../utils/database.js";
dotenv.config();

const router = Router();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});



// GET all products
router.get("/", async (req, res, next) => {

  console.log("GET /products");
  try {
    const products = await Product.find({});

    for (const product of products) {
      // Generate signed URL for the main image
      const mainImageParams = {
        Bucket: bucketName,
        Key: product.mainImageUrl, 
      };
      const mainImageUrl = await getSignedUrl(
        s3,
        new GetObjectCommand(mainImageParams)
      );
      product.mainImageUrl = mainImageUrl;

      // Generate signed URLs for all images
      const signedUrls = await Promise.all(
        product.allImages.map(async (imageKey) => {
          const getObjectParams = {
            Bucket: bucketName,
            Key: imageKey,
          };
          const command = new GetObjectCommand(getObjectParams);
          return getSignedUrl(s3, command, { expiresIn: 3600 });
        })
      );
      product.allImages = signedUrls;
    }

    res.status(200).json({
      message: "Products fetched successfully!",
      products,
    });
  } catch (error) {
    next(error);
  }
});

// POST a new product
router.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: "Product added successfully!",
      product,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE all products
router.get("/deleteall", async (req, res, next) => {
  try {
    await databaseClear();
    res.status(200).json({
      message: "All products have been deleted.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
