// utils/validation/documentValidation.js

/**
 * Document validation rules
 */
export const DOCUMENT_RULES = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
  ALLOWED_EXTENSIONS: [".pdf", ".jpg", ".jpeg", ".png"],
};

/**
 * Validate document file
 */
export const validateDocumentFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return errors;
  }

  // Check file type
  if (!DOCUMENT_RULES.ALLOWED_TYPES.includes(file.type)) {
    errors.push("Invalid file type. Please upload PDF, JPG, or PNG");
  }

  // Check file size
  if (file.size > DOCUMENT_RULES.MAX_SIZE) {
    errors.push(
      `File size exceeds ${DOCUMENT_RULES.MAX_SIZE / (1024 * 1024)}MB limit`,
    );
  }

  return errors;
};

/**
 * Get required documents based on student type
 */
export const getRequiredDocuments = (studentType) => {
  const baseDocuments = {
    form138: { required: false, label: "Form 138 / Report Card" },
    birthCertificate: { required: false, label: "Birth Certificate" },
    transcript: { required: false, label: "Transcript of Records" },
    honorableDismissal: { required: false, label: "Honorable Dismissal" },
  };

  if (studentType === "new") {
    return {
      ...baseDocuments,
      form138: { ...baseDocuments.form138, required: true },
      birthCertificate: { ...baseDocuments.birthCertificate, required: true },
    };
  }

  if (studentType === "transferee") {
    return {
      ...baseDocuments,
      transcript: { ...baseDocuments.transcript, required: true },
      honorableDismissal: {
        ...baseDocuments.honorableDismissal,
        required: true,
      },
      birthCertificate: { ...baseDocuments.birthCertificate, required: true },
    };
  }

  return baseDocuments;
};

/**
 * Validate all required documents
 */
export const validateRequiredDocuments = (studentType, documents) => {
  if (studentType === "old") {
    return { isValid: true, missingDocuments: [] };
  }

  const requiredDocs = getRequiredDocuments(studentType);
  const missingDocuments = [];

  Object.entries(requiredDocs).forEach(([key, doc]) => {
    if (doc.required && !documents[key]?.file) {
      missingDocuments.push(doc.label);
    }
  });

  return {
    isValid: missingDocuments.length === 0,
    missingDocuments,
  };
};
