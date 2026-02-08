export default (req, res, next) => {
  // Sanitize all incoming fields

  const email = sanitizeInput(req.body.email || "", {
    lowerCase: true,
    normalizeWhitespace: true,
    allowOnlyEmailSafe: true,
  });

  // Replace original values with sanitized ones
  req.body.email = email;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/resend-otp") {
    if (![email].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
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
    output = output.replace(/[^a-zA-Z0-9@._-]/g, "");
  }

  return output;
}
