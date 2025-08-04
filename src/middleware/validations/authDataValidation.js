import {
  ADDRESS_REQUIRED,
  EMAIL_REQUIRED,
  FNAME_REQUIRED,
  LNAME_REQUIRED,
  PASSWORD_REQUIRED,
  PHONE_REQUIRED,
  SESSION_REQUIRED,
  TOKEN_REQUIRED,
} from "./joiConst.js";
import { validateData } from "./joiValidation.js";

export const newUserDataValidation = (req, res, next) => {
  const obj = {
    fName: FNAME_REQUIRED,
    lName: LNAME_REQUIRED,
    email: EMAIL_REQUIRED,
    password: PASSWORD_REQUIRED,
    phone: PHONE_REQUIRED,
    // address: ADDRESS_REQUIRED,
  };
  validateData({ req, res, next, obj });
};
export const userActivationDataValidation = (req, res, next) => {
  // Create an object with the required fields(schema or rules)
  const obj = {
    sessionId: SESSION_REQUIRED,
    t: TOKEN_REQUIRED,
  };
  validateData({ req, res, next, obj });
};
export const loginDataValidation = (req, res, next) => {
  const obj = {
    email: EMAIL_REQUIRED,
    password: PASSWORD_REQUIRED,
  };
  validateData({ req, res, next, obj });
};
