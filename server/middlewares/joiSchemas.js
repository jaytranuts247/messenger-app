const Joi = require("joi");

const Schemas = {
  userRegister: Joi.object({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string(),
    confirmedPassword: Joi.ref("password"),
  }),
  userLogin: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string(),
  }),
};

module.exports = Schemas;
