import Joi from "joi";
export const FNAME = Joi.string().min(3);
export const FNAME_REQUIRED = FNAME.required();
export const LNAME = Joi.string().min(3);
export const LNAME_REQUIRED = LNAME.required();
export const EMAIL = Joi.string().email({ minDomainSegments: 2 });
export const EMAIL_REQUIRED = EMAIL.required();
export const PASSWORD = Joi.string().min(6);
export const PASSWORD_REQUIRED = PASSWORD.required();
export const PHONE = Joi.number();
export const PHONE_REQUIRED = PHONE.required();
export const ADDRESS = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),

  country: Joi.string().required(),
});
export const ADDRESS_REQUIRED = ADDRESS.required();
export const SESSION = Joi.string().min(10).max(30);
export const SESSION_REQUIRED = SESSION.required();
export const TOKEN = Joi.string().min(10);
export const TOKEN_REQUIRED = TOKEN.required();
