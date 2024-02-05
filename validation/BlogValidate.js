const Joi=require("joi");
const blogSchema=Joi.object({
    title:Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
        "string.base":`title Must Be 'text'`,
        "any.required":`title Must be Required`,
        "string.max":`title must be at least 30 character`,
        "string.min":`title must be at most 5 character`
    }),
    bigText:Joi.string()
    .min(30)
    .optional()
    .messages({
            "string.base":`Big Text Should be 'text'`,
            "string.min":'BigText at least 30 character',
        }),
    status:Joi.object()
    .optional(),
    category:Joi.object()
    .optional(),
    image:Joi.string()
    .required()
    .messages({
        "string.base":`image Text Should be 'text'`,
    }),
    description:Joi.string()
    .min(10)
    .max(100)
    .required()
    .messages({
        "string.base":`Description Must Be 'text'`,
        "any.required":`Description Must be Required`,
        "string.max":`Description must be at least 100 character`,
        "string.min":`Description must be at most 10 character`
    }),
    type:Joi.string()
    .min(2)
    .max(10)
    .required()
    .messages({
        "string.base":`type Must Be 'text'`,
        "any.required":`type Must be Required`,
        "string.max":`type must be at least 10 character`,
        "string.min":`type must be at most 2 character`
    }),
})
module.exports={blogSchema}