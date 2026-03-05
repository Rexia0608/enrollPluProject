// responseHandler.js

/**
 * Standard API Response Structure
 */
const createResponse = (
  success,
  message,
  data = null,
  error = null,
  meta = {},
) => ({
  success,
  message,
  data,
  error,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta,
  },
});

/**
 * Global Response Handler - Returns a function for Express middleware/route use
 */
export const globalResponseHandler = (res, data, options = {}) => {
  try {
    const {
      message = "Operation completed successfully",
      statusCode = 200,
      meta = {},
    } = options;

    // Handle different data types
    const responseData = data?.result ?? data ?? null;

    return res
      .status(statusCode)
      .json(createResponse(true, message, responseData, null, meta));
  } catch (err) {
    console.error("Error in responseHandler:", err);

    return res.status(500).json(
      createResponse(false, "Internal server error", null, {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }),
    );
  }
};

/**
 * Error Response Handler
 */
export const errorResponseHandler = (res, error, statusCode = 500) => {
  const isDev = process.env.NODE_ENV === "development";

  return res.status(statusCode).json(
    createResponse(false, error.message || "Error occurred", null, {
      message: error.message,
      ...(isDev && { stack: error.stack, details: error }),
    }),
  );
};
