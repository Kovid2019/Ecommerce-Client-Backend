import {
  createNewUser,
  findUserByEmail,
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
} from "../services/email/emailService.js";
import { sendResetPasswordLinkEmail } from "../utils/nodemailerHelper.js";
import { generateJWTs } from "../utils/jwthelper.js";

export const insertNewUser = async (req, res, next) => {
  try {
    // TODO SignUp process

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
        const url = `${process.env.ROOT_URL}/activate-user?sessionId=/${session._id}&t=${session.token}`;
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
      error.statusCode = 409; // Conflict
    }
    next(error);
  }
};
export const activateUser = async (req, res, next) => {
  try {
    const { sessionId, t } = req.body;
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
        userActivatedNotificationEmail({ email: user.email, name: user.fName });
        const message =
          "Your account has been activated successfully. You may login now.";
        return responseClient({ req, res, message });
      }
    }
    const message =
      "Invalid activation link or token expired. Please try again.";
    const statusCode = 400; // Bad Request
    responseClient({ req, res, message, statusCode });
  } catch (error) {
    next(error);
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    //destructure email and password from req.body
    const { email, password } = req.body;

    // check if user exist
    const user = await findUserByEmail(email);

    // if user not found
    if (!user || !user._id) {
      return responseClient({
        res,
        message: "User not found. Please register to login!",
        statusCode: 404,
      });
    }

    // Compare password
    const isMatch = comparePassword(password, user.password);

    // if password match then generate token
    if (isMatch) {
      const jwt = await generateJWTs(user.email);
      return responseClient({
        res,
        message: "User logged in successfully!!",
        payload: jwt,
      });
    }

    // if password not match
    return responseClient({
      res,
      message: "Invalid credentials",
      statusCode: 401,
    });
  } catch (error) {
    console.log("Login error:", error);
    return responseClient({
      res,
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};

//get the user
export const getUser = async (req, res) => {
  //retrieves and returns user information.
  try {
    responseClient({
      res,
      payload: req.userInfo, // from auth middleware
      message: "User fetched successfully",
    });
  } catch (error) {
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

// forget password
export const forgetPassword = async (req, res) => {
  try {
    //find if user exist
    const user = await findUserByEmail(req.body.email);

    // if user not found
    if (!user?._id) {
      return responseClient({
        res,
        message: "User not found",
        statusCode: 404,
      });
    }

    //if user found
    if (user?._id) {
      // if user is created send a verification email
      const secureID = uuidv4();

      // store this secure ID in session storage for that user
      const newUserSession = await createNewSession({
        token: secureID,
        association: user.email,
        expiry: new Date(Date.now() + 3 * 60 * 60 * 1000), //session will be expired in 3 hr
      });

      if (newUserSession?._id) {
        const resetPasswordUrl = `${process.env.ROOT_URL}/change-password?e=${user.email}&id=${secureID}`;

        //send mail via node mailer
        sendResetPasswordLinkEmail(user, resetPasswordUrl);
      }
    }

    // if user found
    user?._id
      ? responseClient({
          res,
          payload: {},
          message: "Check your inbox/spam to reset your password",
        })
      : responseClient({
          res,
          message: "Something went wrong",
          statusCode: 500,
        });
  } catch (error) {
    console.log(error.message);
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    const { formData, token, email } = req.body;
    // console.log("req.body", req.body);

    //check if user exists
    const user = await findUserByEmail(email);

    //delete token from session table after password reset for one time click
    const sessionToken = await deleteSession({ token, association: email });
    // console.log("sessionToken", sessionToken);

    if (user && sessionToken) {
      const { password } = formData;
      const encryptPassword = hashpassword(password);
      const updatedPasword = await updateUser(
        { email },
        { password: encryptPassword }
      );
      responseClient({
        res,
        payload: updatedPasword,
        message: "Password Reset successfully!!",
      });
    } else {
      responseClient({
        res,
        message: "Token expired or invalid. Please try again",
        statusCode: 500,
      });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    const { authorization } = req.headers; // from auth middleware

    // Remove session for the user
    const result = await deleteSession({
      token: authorization,
      association: email,
    });

    // Use ternary operator to handle success or failure
    result
      ? responseClient({
          res,
          payload: {},
          message: "User logged out successfully!!",
        })
      : responseClient({
          res,
          message: "Session not found or already deleted.",
          statusCode: 500,
        });
  } catch (error) {
    console.error("Error logging out:", error);
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};
