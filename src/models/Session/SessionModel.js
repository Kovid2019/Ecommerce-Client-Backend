import SessionSchema from "./SessionSchema.js";
//Insert new session
export const createNewSession = (sessionObj) => {
  return SessionSchema(sessionObj).save();
};
export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
//get session
export const getSession = (filter) => {
  return SessionSchema.findOne(filter);
};
