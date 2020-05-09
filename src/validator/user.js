const Joi = require("@hapi/joi");

const schema = Joi.object({
  username: Joi.string()
    .regex(/^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$/)
    .min(3)
    .max(30),
  // .required(),
  password: Joi.string().min(3).max(15),
  id: Joi.string().regex(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  ),
});

export default schema;
