import express from "express";
import {
  activateUser,
  forgetPassword,
  getUser,
  getWishlistProducts,
  insertNewUser,
  loginUser,
  logoutUser,
  resetPassword,
  toggleWishlistController,
} from "../controllers/authController.js";
import {
  loginDataValidation,
  newUserDataValidation,
  userActivationDataValidation,
} from "../middleware/validations/authDataValidation.js";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", newUserDataValidation, insertNewUser);
router.post("/activate-user", userActivationDataValidation, activateUser);
router.post("/login", loginDataValidation, loginUser);
router.get("/user-info", userAuthMiddleware, getUser);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", userAuthMiddleware, logoutUser);
// router.post("/wishlist", userAuthMiddleware, addToWishlist);
// router.delete("/wishlist/:productId", userAuthMiddleware, removeFromWishlist);
router.post("/wishlist", userAuthMiddleware, toggleWishlistController);
router.get("/wishlist", userAuthMiddleware, getWishlistProducts);
export default router;
