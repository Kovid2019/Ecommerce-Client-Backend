import express from "express";
import {
  activateUser,
  changePassword,
  forgetPassword,
  getUser,
  insertNewUser,
  loginUser,
  logout,
} from "../controllers/authController.js";
import {
  loginDataValidation,
  newUserDataValidation,
  userActivationDataValidation,
} from "../middleware/validations/authDataValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", newUserDataValidation, insertNewUser);
router.post("/activate-user", userActivationDataValidation, activateUser);

//login user
authRouter.post("/login", loginDataValidation, loginUser);

//get the user-info
authRouter.get("/user-info", authMiddleware, getUser);

// forget password
authRouter.post("/forget-password", forgetPassword);

// reset password
authRouter.patch("/change-password", changePassword);

//logout
authRouter.post("/logout", logout);

export default router;
