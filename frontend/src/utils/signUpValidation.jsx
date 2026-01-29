import Joi from "joi";

const schema = Joi.object({
  fName: Joi.string()
    .trim()
    .min(2)
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.pattern.base":
        "First name must not contain numbers or special characters",
    }),

  lName: Joi.string()
    .trim()
    .min(2)
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.pattern.base":
        "Last name must not contain numbers or special characters",
    }),

  birthDate: Joi.date().iso().required().messages({
    "date.base": "Birth date is required",
    "date.format": "Birth date must be a valid date",
  }),

  sex: Joi.string().valid("Male", "Female").required().messages({
    "any.only": "Please select a gender",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email is not valid",
    }),

  mNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be in international format (e.g. +639171234567)",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain numbers and special characters",
    }),
});

const signUpValidation = async (isValid) => {
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

export default signUpValidation;
