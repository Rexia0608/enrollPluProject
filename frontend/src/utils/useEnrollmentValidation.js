// hooks/useEnrollmentValidation.js
import { useState, useCallback } from "react";
import { validateStep, getFieldError } from "../utils/enrollmentValidation";

export const useEnrollmentValidation = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Validate a specific step
   */
  const validateStepData = useCallback((step, data) => {
    const result = validateStep(step, data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  /**
   * Validate a single field (for real-time validation)
   */
  const validateField = useCallback((fieldName, value, context = {}) => {
    let fieldError = null;

    // Simple field validations
    switch (fieldName) {
      case "contactNumber":
        if (!value?.trim()) {
          fieldError = "Contact number is required";
        } else if (!/^[0-9]{11}$/.test(value.replace(/\D/g, ""))) {
          fieldError = "Must be 11 digits";
        }
        break;

      case "address":
        if (!value?.trim()) {
          fieldError = "Address is required";
        }
        break;

      case "yearLevel":
        if (!value) {
          fieldError = "Please select year level";
        }
        break;

      case "course":
        if (!value) {
          fieldError = "Please select a course";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return !fieldError;
  }, []);

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  /**
   * Get error message for a field (if touched and has error)
   */
  const getError = useCallback(
    (fieldName) => {
      return getFieldError(fieldName, errors, touched);
    },
    [errors, touched],
  );

  /**
   * Clear errors for specific fields or all
   */
  const clearErrors = useCallback((fieldNames) => {
    if (fieldNames) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        fieldNames.forEach((field) => delete newErrors[field]);
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  /**
   * Clear touched state
   */
  const clearTouched = useCallback(() => {
    setTouched({});
  }, []);

  /**
   * Reset all validation state
   */
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    setErrors,
    setTouched,
    validateStep: validateStepData,
    validateField,
    handleBlur,
    getError,
    clearErrors,
    clearTouched,
    resetValidation,
  };
};
