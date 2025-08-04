import express from "express";

import {
  getALLCategoryController,
  getCategorybyIdController,
  getCategorybySlugController,
} from "../controllers/categoryController.js";
export const categoryRouter = express.Router();
// get all category
categoryRouter.get("/", getALLCategoryController);
// get category by slug
categoryRouter.get("/slug/:slug", getCategorybySlugController);
categoryRouter.get("/id/:_id", getCategorybyIdController);

export default categoryRouter;
