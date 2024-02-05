const Joi = require("joi");

// const numberSchema = Joi.object({
//     number: Joi.string()
//         .min(10)
//         .max(10)
//         .required()
//         .messages({
//             'any.required': 'Number is a required field',
//             'string.base': `Number should be a type of 'text'`,
//             'string.integer': 'Number must be an integer',
//             'string.min': 'Number must be at least 10',
//             'string.max': 'Number must be at most 10',
//         }),
// });

const numberSchema = Joi.object({
    number: Joi.number()
        .min(1111111111)
        .max(9999999999)
        .required()
        .strict(true)
        .messages({     
            'any.required': 'Number is a required field',
            'number.base': 'Number should be a type of number',
            'number.integer': 'Number must be an integer',
            'number.min': 'Number must be at least 10',
            'number.max': 'Number must be at most 99999999999 ',
        }),
});
module.exports = { numberSchema };

