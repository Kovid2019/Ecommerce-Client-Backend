import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/User/UserModel.js";
import { comparePassword, hashpassword } from "../utils/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { responseClient } from "../middleware/responseClient.js";
import {
  createNewSession,
  deleteSession,
} from "../models/Session/SessionModel.js";
import {
  userActivatedNotificationEmail,
  userActivationUrlEmail,
  userResetPasswordEmail,
} from "../services/email/emailService.js";
import { getJwts } from "../utils/jwt.js";
import { userResetPasswordLinkEmailTemplate } from "../services/email/emailTemplate.js";
import UserSchema from "../models/User/UserSchema.js";

// Register(SignUp) of new user.
export const insertNewUser = async (req, res, next) => {
  try {
    console.log(req.body, "aaa");
    //Receive the user Data
    const { password } = req.body;
    //Encrypt the password
    req.body.password = hashpassword(password);
    //Create and send unique activation link to the user for email verification

    //Insert the user in the database
    const user = await createNewUser(req.body);

    // Create and send unique activation link to the user for email verification
    if (user?._id) {
      const session = await createNewSession({
        token: uuidv4(),
        association: user.email,
      });
      if (session?._id) {
        const url = `${process.env.ROOT_URL}/activate-user?sessionId=${session._id}&t=${session.token}`;
        // Send this url to their email
        const emailId = await userActivationUrlEmail({
          email: user.email,
          url,
          name: user.fName,
        });

        if (emailId) {
          const message =
            " We have sent an activation link to your email. Please check your inbox and activate your account.";
          return responseClient({ req, res, message });
        }
      }
    }
    throw new Error("Unable to create an account. Try again later..");
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      error.message =
        "Email already exists. Please try with a different email.";
      error.statusCode = 409;
    }
    next(error);
  }
};

//activate user
export const activateUser = async (req, res, next) => {
  try {
    const { sessionId, token: t } = req.body;
    console.log("req.body", req.body);

    if (sessionId && t) {
      const session = await deleteSession({
        _id: sessionId,
        token: t,
      });

      if (session?._id) {
        //Update the user status to active
        const user = await updateUser(
          { email: session.association },
          { status: "active" }
        );

        if (user?._id) {
          //Send email notification to the user
          userActivatedNotificationEmail({
            email: user.email,
            name: user.fName,
          });
          const message =
            "Your account has been activated successfully. You may login now.";
          return responseClient({ req, res, message });
        }
      }
      return;
    }

    const message =
      "Invalid activation link or token expired. Please try again.";
    const statusCode = 400;
    return responseClient({ req, res, message, statusCode });
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    //destructure user data
    const { email, password } = req.body;

    //check if user exists
    const user = await getUserByEmail(email);

    //if user not found
    if (!user || !user._id) {
      return responseClient({
        req,
        res,
        message: "User not found. Please register to login!",
        statusCode: 404,
      });
    }

    //check if password is correct
    const isMatch = comparePassword(password, user.password);

    if (isMatch) {
      const jwt = await getJwts(user.email);
      return responseClient({
        req,
        res,
        message: "User logged in successfully!!",
        payload: jwt,
      });
    }

    return responseClient({
      req,
      res,
      message: "Invalid credentials",
      statusCode: 401,
    });
  } catch (error) {
    console.log("Login error:", error);
    // Forward error to Express error-handling middleware
    next(error);
  }
};

//Get the user info
export const getUser = async (req, res) => {
  try {
    responseClient({
      req,
      res,
      message: "User info fetched successfully",
      payload: req.userInfo, // req.userInfo is set by userAuthMiddleware
    });
  } catch (error) {
    responseClient({
      req,
      res,
      message: error.message || "Unable to get user info",
      statusCode: error.statusCode || 500,
    });
  }
};

//Forgot password
export const forgetPassword = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    // console.log("user", user);

    // if user not found
    if (!user?._id) {
      return responseClient({
        req,
        res,
        message: "User not found",
        statusCode: 404,
      });
    }

    // if user found
    const secureID = uuidv4();

    const newUserSession = await createNewSession({
      token: secureID,
      association: user.email,
      expiry: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    });

    if (newUserSession?._id) {
      const resetPasswordUrl = `${process.env.ROOT_URL}/change-password?e=${user.email}&id=${secureID}`;
      userResetPasswordLinkEmailTemplate(user, resetPasswordUrl);
    }

    return responseClient({
      req,
      res,
      payload: {},
      message: "Check your inbox/spam to reset your password",
    });
  } catch (error) {
    console.log("Forget Password Error:", error.message);
    return next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { formData, token, email } = req.body;

    // Check if user exists
    const user = await getUserByEmail(email);

    // Delete token from session table after password reset for one-time use
    const sessionToken = await deleteSession({ token, association: email });

    if (user && sessionToken) {
      const { password } = formData;
      const encryptPassword = hashpassword(password);
      const updatedPassword = await updateUser(
        { email },
        { password: encryptPassword }
      );

      return responseClient({
        req,
        res,
        payload: updatedPassword,
        message: "Password Reset successfully!!",
      });
    } else {
      return responseClient({
        req,
        res,
        message: "Token expired or invalid. Please try again",
        statusCode: 400, // 400 is more appropriate than 500 here
      });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return next(error);
  }
};

// Logout user
export const logoutUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return responseClient({
        req,
        res,
        message: "Authorization token missing",
        statusCode: 401,
      });
    }

    const token = authorization.split(" ")[1];
    //Remove session for the user
    const result = await deleteSession({
      token,
      association: email,
    });

    //Use ternary operator to hanle succes or failure
    result
      ? responseClient({ req, res, message: "User logged out successfuly..!" })
      : responseClient({
          req,
          res,
          message: "Session not found or already deleted..",
          statusCode: 500,
        });
  } catch (error) {
    responseClient({ req, res, message: error.message, statusCode: 500 });
    return next(error);
  }
};

export const toggleWishlistController = async (req, res, next) => {
  try {
    console.log(req.body);
    const { productId } = req.body;
    // const { user } = req.userInfo;

    if (req.userInfo.wishList.includes(productId)) {
      const obj = req.userInfo.wishList?.filter(
        (list) => list.toString() !== productId.toString()
      );
      console.log(req.userInfo.wishList, "300");
      console.log(obj, "301");
      const user = await updateUser(
        { _id: req.userInfo._id },
        { $set: { wishList: obj } }
      );

      return responseClient({
        req,
        res,
        message: "This product is aready in your wishlist",

        payload: user.wishList,
      });
    } else {
      const user = await updateUser(
        { _id: req.userInfo._id },
        { $set: { wishList: [...req.userInfo.wishList, productId] } }
      );
      console.log(user);
      responseClient({
        req,
        res,
        message: "This product is added to your wishlist",

        payload: user.wishList,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getWishlistProducts = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userInfo._id).populate(
      "wishList"
    );
    if (!user) {
      return responseClient({
        req,
        res,
        statusCode: 404,
        message: "User not found",
      });
    }
    return responseClient({
      req,
      res,
      statusCode: 200,
      message: "Wishlist fetched",
      payload: user.wishList,
    });
  } catch (error) {
    responseClient({
      req,
      res,
      statusCode: 500,
      message: error.message || "Server error",
    });
  }
};
