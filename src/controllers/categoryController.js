import { responseClient } from "../middleware/responseClient.js";
import {
  getAllCategory,
  getCategoryBySlug,
  getCategoryById,
} from "../models/Category/CategoryModel.js";

export const getALLCategoryController = async (req, res, next) => {
  try {
    const allCategories = await getAllCategory();
    allCategories?.length
      ? responseClient({
          res,
          message: "here is all category",
          payload: allCategories,
          req,
        })
      : responseClient({
          res,
          statusCode: 400,
          message: "something went wrong unable to get data",
          req,
        });
  } catch (error) {
    next(error);
  }
};
export const getCategorybySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return responseClient({
        req,
        res,
        message: "slug is required",
        statusCode: 400,
      });
    }

    const category = await getCategoryBySlug(slug);
    category?._id
      ? responseClient({
          req,
          res,
          message: "here is the category",
          payload: category,
        })
      : responseClient({
          req,
          res,
          message: "something went wrong check your url",
          statusCode: 400,
        });
  } catch (error) {
    next(error);
  }
};
export const getCategorybyIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return responseClient({
        req,
        res,
        message: "slug is required",
        statusCode: 400,
      });
    }

    const category = await getCategoryById(_id);
    category?._id
      ? responseClient({
          req,
          res,
          message: "here is the category",
          payload: category,
        })
      : responseClient({
          req,
          res,
          message: "something went wrong check your url",
          statusCode: 400,
        });
  } catch (error) {
    next(error);
  }
};
