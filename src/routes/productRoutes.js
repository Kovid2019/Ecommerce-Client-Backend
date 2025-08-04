import express from "express";
import {
  getProductsByCategoryIdController,
  getProductByIdController,
  getAllProductsController,
  getAllFilterProductsController,
} from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.get("/category/:categoryId", getProductsByCategoryIdController);
productRouter.get("/Id/:_id", getProductByIdController);
productRouter.get("/", getAllProductsController);
productRouter.get("/filterProduct", getAllFilterProductsController);

export default productRouter;
