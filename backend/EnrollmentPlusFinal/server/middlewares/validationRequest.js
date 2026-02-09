import Joi from "joi";

const passwordSchema = Joi.string()
  .min(8)
  .max(100)
  .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number, and at least one special character.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "any.required": "Password is required.",
  });

export default (req, res, next) => {
  const fieldtype = req.path;
  console.log(fieldtype);
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }); 

  console.log(fieldtype)

  let schema;

  switch (fieldtype) {
    case "/user-register":
      schema = Joi.object({
        first_name: Joi.string().min(2).max(50).trim().required(),
        last_name: Joi.string().min(2).max(50).trim().required(),
        middle_name: Joi.string().allow("").max(50).trim(),
        email: Joi.string().email().required(),
        password: passwordSchema,
      });
      break;

    case "/user-login":
      schema = Joi.object({
        email: Joi.string().email().required(),
        password: passwordSchema,
      });
      break;

    case "/user-change-password":
      schema = Joi.object({
        new_password: passwordSchema,
      });
      break;

    case "/request-password-reset":
      schema = Joi.object({
        email: Joi.string().email().required(),
      });
      break;

    case "/Recovery":
      schema = Joi.object({
        token: Joi.string().length(64).hex().required(),
        newPassword: passwordSchema,
      });
      break;

    case "/addCourse":
      schema = Joi.object({
        course_name: Joi.string().min(2).max(100).required(),
        course_code: Joi.string().min(2).max(100).required(),
      });
      break;

    case "/deleteCourse":
      schema = Joi.object({
        course_id: Joi.string().min(2).max(100).required(),
        is_active: Joi.boolean().required(),
      });
      break;

    default:
      throw new Error(`Validation schema not defined for path: ${fieldtype}`);
  }

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(error);
  }

  next();
};

function sanitizeInput(input) {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
