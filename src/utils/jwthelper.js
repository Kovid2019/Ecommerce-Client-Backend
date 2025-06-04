import jwt from "jsonwebtoken";
import { createNewSession } from "../models/Session/SessionModel.js";

//access jwt: session table | for session storage
export const generateAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "3h",
  });

  const expiry = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hr expiry

  await createNewSession({ token, association: email, expiry });

  return token;
};

// refresh jwt : session table | for local storage
export const generateRefreshJWT = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.error(error);
  }
};

// generate tokens
export const generateJWTs = async (email) => {
  return {
    accessJWT: await generateAccessJWT(email),
    refreshJWT: await generateRefreshJWT(email),
  };
};

//verify access token and return decoded email
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
};

//verify refresh token and return decoded email
export const verifyRefreshJWT = (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);
};
