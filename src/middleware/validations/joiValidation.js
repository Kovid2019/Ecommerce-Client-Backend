import Joi from "joi";
import { responseClient } from "../responseClient.js";

export const validateData = ({ req, res, next, obj }) => {
  // Create a schema or rules for the data to be validated
  const schema = Joi.object(obj);

  // Pass your data, req.body to the schema to validate it
  const { error } = schema.validate(req.body);

  // If there is an error, send a response with the error message
  if (error) {
    return responseClient({
      req,
      res,
      message: error.message,
      statusCode: 400,
    });
  }
  // If there is no error, call the next middleware

  next();
};
