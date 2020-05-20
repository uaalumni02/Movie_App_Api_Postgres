const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = Joi.object({
  rating: Joi.string().min(1).max(7),

  id: Joi.string().regex(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  ),
});

export default schema;
