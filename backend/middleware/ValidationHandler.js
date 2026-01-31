export default (req, res, next) => {
  // Sanitize all incoming fields
  const fName = sanitizeInput(req.body.fName || "", {
    stripHTML: true,
    normalizeWhitespace: true,
  });

  const lName = sanitizeInput(req.body.lName || "", {
    stripHTML: true,
    normalizeWhitespace: true,
  });

  const birthDate = sanitizeInput(req.body.birthDate || "", {
    stripHTML: true,
    normalizeWhitespace: true,
  });

  const gender = sanitizeInput(req.body.gender || "", {
    stripHTML: true,
    normalizeWhitespace: true,
    lowerCase: true,
  });

  const email = sanitizeInput(req.body.email || "", {
    lowerCase: true,
    normalizeWhitespace: true,
    allowOnlyEmailSafe: true,
  });

  const mNumber = sanitizeInput(req.body.mNumber || "", {
    normalizeWhitespace: true,
  });

  const password = sanitizeInput(req.body.password || "", {
    normalizeWhitespace: true,
  });

  // Replace original values with sanitized ones
  req.body.fName = fName;
  req.body.lName = lName;
  req.body.birthDate = birthDate;
  req.body.gender = gender;
  req.body.email = email;
  req.body.mNumber = mNumber;
  req.body.password = password;

  // Validation functions
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  function validName(name) {
    return name.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(name);
  }

  function validBirthDate(date) {
    if (!date) return true; // Optional field

    // Check format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const inputDate = new Date(date);
    const today = new Date();

    // Date should be valid and not in the future
    return !isNaN(inputDate) && inputDate <= today;
  }

  function validGender(gender) {
    if (!gender) return true; // Optional field

    const validGenders = ["male", "female", "other"];
    return validGenders.includes(gender);
  }

  function validPhone(phone) {
    if (!phone) return true; // Optional field

    // Basic international phone validation
    const cleaned = phone.replace(/[^\d+]/g, "");
    return cleaned.length >= 10 && /^\+?[\d\s()-]{10,20}$/.test(phone);
  }

  function validPassword(password) {
    // At least 8 characters, with letter and number
    if (password.length < 8) return false;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasLetter && hasNumber;
  }

  // Path-specific validation
  if (req.path === "/register") {
    const requiredFields = [fName, lName, email, password];
    if (!requiredFields.every(Boolean)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const errors = [];

    if (!validName(fName)) {
      errors.push(
        "First name must be at least 2 characters and contain only letters",
      );
    }

    if (!validName(lName)) {
      errors.push(
        "Last name must be at least 2 characters and contain only letters",
      );
    }

    if (!validEmail(email)) {
      errors.push("Invalid email format");
    }

    if (birthDate && !validBirthDate(birthDate)) {
      errors.push(
        "Invalid birth date (must be in YYYY-MM-DD format and not in the future)",
      );
    }

    if (gender && !validGender(gender)) {
      errors.push("Gender must be male, female, or other");
    }

    if (mNumber && !validPhone(mNumber)) {
      errors.push("Invalid phone number format");
    }

    if (!validPassword(password)) {
      errors.push(
        "Password must be at least 8 characters with letters and numbers",
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    if (!validEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
  } else if (req.path === "/update-profile") {
    // Optional: Add validation for profile updates
    const errors = [];

    if (fName && !validName(fName)) {
      errors.push("Invalid first name format");
    }

    if (lName && !validName(lName)) {
      errors.push("Invalid last name format");
    }

    if (email && !validEmail(email)) {
      errors.push("Invalid email format");
    }

    if (birthDate && !validBirthDate(birthDate)) {
      errors.push("Invalid birth date");
    }

    if (gender && !validGender(gender)) {
      errors.push("Invalid gender selection");
    }

    if (mNumber && !validPhone(mNumber)) {
      errors.push("Invalid phone number");
    }

    if (password && !validPassword(password)) {
      errors.push(
        "Password must be at least 8 characters with letters and numbers",
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
  }

  next();
};

function sanitizeInput(input, options = {}) {
  const {
    escapeHTML = true,
    stripHTML = false,
    normalizeWhitespace = true,
    lowerCase = false,
    allowOnlyEmailSafe = false,
  } = options;

  // Handle non-string inputs
  if (typeof input !== "string") {
    input = String(input || "");
  }

  let output = input;

  if (normalizeWhitespace) {
    output = output.trim().replace(/\s+/g, " ");
  }

  if (lowerCase) {
    output = output.toLowerCase();
  }

  if (stripHTML) {
    output = output.replace(/<\/?[^>]+(>|$)/g, "");
  }

  if (escapeHTML && !stripHTML) {
    output = output
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (allowOnlyEmailSafe) {
    output = output.replace(/[^a-zA-Z0-9@._%+-]/g, ""); // Added % and + for email
  }

  return output;
}
