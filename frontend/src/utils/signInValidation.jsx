import Joi from "joi";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email is not valid",
    }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const validation = async (isValid) => {
  let notValid = {};

  const { error } = schema.validate(isValid, {
    abortEarly: false,
  });

  if (error) {
    error.details.forEach((item) => {
      notValid[item.path[0]] = item.message;
    });
  }

  return { notValid };
};

export default validation;
