// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt";

const saltRound = 10;
export const hashpassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltRound);
};
export const comparePassword = (plainPassword, hashpassword) => {
  return bcrypt.compareSync(plainPassword, hashpassword);
};
