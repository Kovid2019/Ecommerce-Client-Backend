import bcrypt from "bcryptjs";
const saltRound = 15;
export const hashpassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltRound);
};
export const comparePassword = (plainPassword, hashpassword) => {
  return bcrypt.compareSync(plainPassword, hashpassword);
};
