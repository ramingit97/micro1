import Joi, { ObjectSchema } from "joi";

const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
  );

export const registerSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(PASSWORD_REGEX).min(8)
    .messages({
      'string.pattern.base': `Password regexp fails`,
    })
});