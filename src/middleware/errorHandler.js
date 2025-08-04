import { responseClient } from "./responseClient.js";

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500; //We get the value of statusCode from the error object.
  const message = error.message || "Internal Server Error";
  responseClient({ req, res, statusCode, message });
};
