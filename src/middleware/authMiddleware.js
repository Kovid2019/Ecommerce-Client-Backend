import { getSession } from "../models/Session/SessionModel.js";
import { getOneUser, getUserByEmail } from "../models/User/UserModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";
import { responseClient } from "./responseClient.js";

export const userAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers; //Getting authorization from headers.
  console.log(req.body, "12");
  let message = "Unauthorized";

  // Get accessJWT from headers.
  if (authorization) {
    try {
      const token = authorization;

      //Check if accessJWT is valid.
      const decoded = await verifyAccessJWT(token);

      if (decoded?.email) {
        // Check if exists in session collection(Table).
        const tokenSession = await getSession({ token });

        if (tokenSession?._id) {
          // If exists, get user by email.
          const user = await getUserByEmail(decoded.email);

          if (user?._id && user.status === "active") {
            //Return the user.
            req.userInfo = user;
            return next();
          }
        }
      } else {
        message = decoded === "jwt expired" ? decoded : "Invalid token payload";
        // console.log(message);
      }
    } catch (error) {
      message = "Token verification failed";
      console.error("Token verification error:", error);
    }
  }
  //   const message = decoded === "jwt expired" ? decoded : "Unauthorized access";
  responseClient({ req, res, message, statusCode: 401 });
};

export const renewAccessJWTMiddleware = async (req, res) => {
  const { authorization } = req.headers; //Getting authorization from headers.

  let message = "Unauthorized";

  // Get accessJWT from headers.
  if (authorization) {
    const token = authorization;

    //Check if accessJWT is valid.
    const decoded = await verifyRefreshJWT(token);

    if (decoded.email) {
      // Check if exists in session collection(Table).

      const user = await getOneUser({
        email: decoded.email,
        refreshJWT: token,
      });

      if (user?._id) {
        // Create new accessJWT
        const token = await createAccessJWT(decoded.email);
        //Return accessJWT
        return responseClient({
          req,
          res,
          message: "Here is the accessJWT",
          payload: token,
        });
      }
    }
  }
  //   const message = decoded === "jwt expired" ? decoded : "Unauthorized access";
  responseClient({ req, res, message, statusCode: 401 });
};
