import UserSchema from "./UserSchema.js";

//Insert new user
export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};
export const updateUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj, { new: true });
};

// Find user by email
export const findUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
