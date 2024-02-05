const Joi = require('joi');
const authSchema=Joi.object({
    email: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+.[a-zA-Z0-9._]+$"))
    .required()
    .email()
    .messages({
      "string.base": `Email Id should be a type of 'text'`,
      "string.pattern.base": `Email Id should a valid pattern`,
      "string.empty": `Email Id cannot be an empty field`,
      "string.email": `Email Id should be a valid email`,
       "any.required": `Password is a required field`,
    }),
    password: Joi.string()
    .min(4)
    .max(30)
    .required()
    .messages({
      "string.base": `Password should be a type of 'text'`,
      "string.empty": `Password cannot be an empty field`,
      "string.pattern.base": `Invalid password`,
      "string.min": `Password must be at least 6 characters`,
      "string.max": `Password must be at most 30 characters`,
      "any.required": `Password is a required field`,
    }),
})
module.exports={authSchema}