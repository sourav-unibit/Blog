const Joi=require("joi");
const userSignUpSchema=Joi.object({
    name:Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
        "string.base":`Name Must Be 'text'`,
        "any.required":`Name Must be Required`,
        "string.max":`Name must be at least 20 character`,
        "string.min":`Name must be at most 2 character`
    }),
    email:Joi.string()
    .email()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+.[a-zA-Z0-9._]+$"))
    .messages({
        "string.base": `Email Id should be a type of 'text'`,
        "string.pattern.base": `Email Id should a valid pattern`,
        "string.empty": `Email Id cannot be an empty field`,
        "string.email": `Email Id should be a valid email`,
        "any.required": `Email is a required field`,
    }),
    phoneNumber:Joi.number()
    .min(1111111111)
    .max(9999999999)
    .strict(true)
    .required()
    .messages({     
        'any.required': 'Number is a required field',
        'number.base': 'Number should be a type of number',
        'number.integer': 'Number must be an integer',
        'number.min': 'Number must be at least 10',
        'number.max': 'Number must be at most 99999999999 ',
    }),
    password: Joi.string()
    .min(4)
    .max(30)
    .required()
    .messages({
      "string.base": `Password should be a type of 'text'`,
      "string.empty": `Password cannot be an empty field`,
      "string.pattern.base": `Invalid password`,
      "string.min": `Password must be at least 4 characters`,
      "string.max": `Password must be at most 30 characters`,
      "any.required": `Password is a required field`,
    }),
    confirmPassword:Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
        'any.only':'passwords do not match',
        'any.required':'Confirm Password is a Required field'
    }),
})
const userSignInSchema=Joi.object({
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
module.exports={userSignUpSchema,userSignInSchema}