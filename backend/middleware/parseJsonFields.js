// middleware/parseJsonFields.js
const parseJsonFields = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      const value = req.body[key];
      if (typeof value === "string") {
        try {
          // Attempt to parse as JSON
          const parsed = JSON.parse(value);
          req.body[key] = parsed;
        } catch (err) {
          // Not JSON, leave as is
        }
      }
    }
  }
  next();
};

export default parseJsonFields;
