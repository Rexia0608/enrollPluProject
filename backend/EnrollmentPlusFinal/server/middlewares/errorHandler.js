const errorHandler = (err, req, res, next) => {
  // Joi validation error
  if (err.isJoi) {
    return res.status(422).json({
      status: "error",
      errors: err.details.map((e) => e.message),
    });
  }

  // Custom ValidationError
  if (err.name === "ValidationError") {
    return res.status(err.status || 422).json({
      status: "error",
      errors: err.details || [err.message],
    });
  }

  // Default 500
  return res.status(500).json({
    status: "error",
    errors: [err.message || "Internal Server Error"],
  });
};

export default errorHandler;
