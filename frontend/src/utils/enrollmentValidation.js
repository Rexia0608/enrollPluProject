// utils/validation/enrollmentValidation.js

/**
 * Validation rules and schemas for enrollment profiling
 */

// Validation patterns
const PATTERNS = {
  PHONE: /^[0-9]{11}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  FILE_TYPES: [".pdf", ".jpg", ".jpeg", ".png"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Validation messages
export const VALIDATION_MESSAGES = {
  STUDENT_TYPE: {
    REQUIRED: "Please select your student type",
  },
  CONTACT: {
    REQUIRED: "Contact number is required",
    INVALID: "Must be 11 digits",
  },
  ADDRESS: {
    REQUIRED: "Address is required",
  },
  YEAR_LEVEL: {
    REQUIRED: "Please select year level",
  },
  COURSE: {
    REQUIRED: "Please select a course",
  },
  DOCUMENTS: {
    REQUIRED: (label) => `${label} is required`,
    INVALID_TYPE: "File must be PDF, JPG, or PNG",
    TOO_LARGE: "File size must not exceed 5MB",
  },
};

/**
 * Validate student type
 */
export const validateStudentType = (studentType) => {
  const errors = {};

  if (!studentType) {
    errors.studentType = VALIDATION_MESSAGES.STUDENT_TYPE.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate contact number
 */
export const validateContactNumber = (contactNumber) => {
  const errors = {};

  if (!contactNumber?.trim()) {
    errors.contactNumber = VALIDATION_MESSAGES.CONTACT.REQUIRED;
  } else {
    const digitsOnly = contactNumber.replace(/\D/g, "");
    if (!PATTERNS.PHONE.test(digitsOnly)) {
      errors.contactNumber = VALIDATION_MESSAGES.CONTACT.INVALID;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate address
 */
export const validateAddress = (address) => {
  const errors = {};

  if (!address?.trim()) {
    errors.address = VALIDATION_MESSAGES.ADDRESS.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate year level
 */
export const validateYearLevel = (yearLevel) => {
  const errors = {};

  if (!yearLevel) {
    errors.yearLevel = VALIDATION_MESSAGES.YEAR_LEVEL.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate course
 */
export const validateCourse = (course) => {
  const errors = {};

  if (!course) {
    errors.course = VALIDATION_MESSAGES.COURSE.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate profile information (step 2)
 */
export const validateProfileInfo = (formData) => {
  const errors = {};

  // Contact number validation
  if (!formData.contactNumber?.trim()) {
    errors.contactNumber = VALIDATION_MESSAGES.CONTACT.REQUIRED;
  } else {
    const digitsOnly = formData.contactNumber.replace(/\D/g, "");
    if (!PATTERNS.PHONE.test(digitsOnly)) {
      errors.contactNumber = VALIDATION_MESSAGES.CONTACT.INVALID;
    }
  }

  // Address validation
  if (!formData.address?.trim()) {
    errors.address = VALIDATION_MESSAGES.ADDRESS.REQUIRED;
  }

  // Year level validation
  if (!formData.yearLevel) {
    errors.yearLevel = VALIDATION_MESSAGES.YEAR_LEVEL.REQUIRED;
  }

  // Course validation
  if (!formData.course) {
    errors.course = VALIDATION_MESSAGES.COURSE.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate a single file
 */
export const validateFile = (file, label) => {
  if (!file) return null;

  // Check file type
  const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
  if (!PATTERNS.FILE_TYPES.includes(fileExtension)) {
    return VALIDATION_MESSAGES.DOCUMENTS.INVALID_TYPE;
  }

  // Check file size
  if (file.size > PATTERNS.MAX_FILE_SIZE) {
    return VALIDATION_MESSAGES.DOCUMENTS.TOO_LARGE;
  }

  return null;
};

/**
 * Validate required documents (step 3)
 */
export const validateDocuments = (studentType, documents) => {
  const errors = {};

  if (studentType === "old") {
    return { isValid: true, errors: {} };
  }

  Object.entries(documents).forEach(([key, doc]) => {
    if (doc.required) {
      if (!doc.file) {
        errors[key] = VALIDATION_MESSAGES.DOCUMENTS.REQUIRED(doc.label);
      } else {
        const fileError = validateFile(doc.file, doc.label);
        if (fileError) {
          errors[key] = fileError;
        }
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Main validation function for each step
 */
export const validateStep = (step, data) => {
  switch (step) {
    case 1:
      return validateStudentType(data.studentType);

    case 2:
      return validateProfileInfo(data.formData);

    case 3:
      return validateDocuments(data.studentType, data.documents);

    default:
      return { isValid: true, errors: {} };
  }
};

/**
 * Check if a field has been touched and has error
 */
export const getFieldError = (fieldName, errors, touched) => {
  return touched[fieldName] && errors[fieldName] ? errors[fieldName] : null;
};

/**
 * Get input field className based on validation state
 */
export const getInputClassName = (
  fieldName,
  errors,
  touched,
  baseClassName = "",
) => {
  const hasError = touched[fieldName] && errors[fieldName];
  return `${baseClassName} ${hasError ? "border-red-500" : "border-gray-300"}`.trim();
};
