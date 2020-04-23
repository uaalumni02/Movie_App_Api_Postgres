const Joi = require('@hapi/joi');


const schema = Joi.object({
    username: Joi.string().regex(/^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$/)
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .min(3)
        .max(15)
})

export default schema