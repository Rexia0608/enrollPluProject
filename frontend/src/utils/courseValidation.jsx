// utils/courseValidation.js
import Joi from "joi";

const courseSchema = Joi.object({
  code: Joi.string().required().messages({
    "string.empty": "Course code is required",
    "any.required": "Course code is required",
  }),

  name: Joi.string().required().messages({
    "string.empty": "Course name is required",
    "any.required": "Course name is required",
  }),

  type: Joi.string().required().messages({
    "string.empty": "Course type is required",
    "any.required": "Course type is required",
  }),

  tuition_fee: Joi.alternatives()
    .try(Joi.number().min(0).allow(""), Joi.string().allow(""))
    .optional()
    .messages({
      "number.base": "Tuition fee must be a number",
      "number.min": "Tuition fee cannot be negative",
    }),

  status: Joi.string().valid("active", "inactive").default("active").messages({
    "any.only": "Status must be either active or inactive",
  }),
});

const validateCourse = (data, existingCourses = [], currentCourseId = null) => {
  let errors = {};

  // Joi validation
  const { error } = courseSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    error.details.forEach((item) => {
      errors[item.path[0]] = item.message;
    });
  }

  // Only check for duplicates if we have existing courses and the field has a value
  if (existingCourses && existingCourses.length > 0) {
    // Check for duplicate course code (case insensitive)
    if (data.code && data.code.trim() !== "") {
      const isDuplicateCode = existingCourses.some(
        (course) =>
          course && // Check if course exists
          course.code && // Check if code exists
          course.code?.toLowerCase() === data.code.toLowerCase() &&
          course.id !== currentCourseId, // Exclude current course when editing
      );

      if (isDuplicateCode) {
        errors.code = "Course code already exists. Please use a unique code.";
      }
    }

    // Check for duplicate course name (case insensitive)
    if (data.name && data.name.trim() !== "") {
      const isDuplicateName = existingCourses.some(
        (course) =>
          course && // Check if course exists
          course.name && // Check if name exists
          course.name?.toLowerCase() === data.name.toLowerCase() &&
          course.id !== currentCourseId, // Exclude current course when editing
      );

      if (isDuplicateName) {
        errors.name = "Course name already exists. Please use a unique name.";
      }
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default validateCourse;
