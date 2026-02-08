export default (req, res, next) => {
  const email = sanitizeInput(req.body.email || "", {
    lowerCase: true,
    normalizeWhitespace: true,
    allowOnlyEmailSafe: true,
  });

  const password = (req.body.password || "").trim();

  req.body.email = email;
  req.body.password = password;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

function sanitizeInput(input, options = {}) {
  const {
    stripHTML = false,
    normalizeWhitespace = true,
    lowerCase = false,
    allowOnlyEmailSafe = false,
  } = options;

  let output = String(input);

  if (normalizeWhitespace) {
    output = output.trim().replace(/\s+/g, " ");
  }

  if (lowerCase) {
    output = output.toLowerCase();
  }

  if (stripHTML) {
    output = output.replace(/<\/?[^>]+>/g, "");
  }

  if (allowOnlyEmailSafe) {
    output = output.replace(/[^a-zA-Z0-9@._+-]/g, "");
  }

  return output;
}
