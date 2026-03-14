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
  data, // Always an object (or null)
  error,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta,
  },
});

/**
 * Global Response Handler - For successful responses
 * Data is always returned as an object standard
 */
export const globalResponseHandler = (res, data, options = {}) => {
  if (!res || typeof res.status !== "function") {
    console.error("Invalid response object provided to globalResponseHandler");
    throw new Error("Invalid response object");
  }

  if (res.headersSent) {
    console.error("Headers already sent, cannot send response");
    return;
  }

  try {
    const {
      message = "Operation completed successfully",
      statusCode = 200,
      meta = {},
    } = options;

    // Ensure data is always an object
    let responseData = null;

    if (data === null || data === undefined) {
      responseData = null;
    } else if (Array.isArray(data)) {
      // Wrap arrays in an object with 'items' or 'list' key
      responseData = { items: data, count: data.length };
    } else if (typeof data === "object" && !Array.isArray(data)) {
      // Already an object, use as-is
      responseData = data;
    } else {
      // Primitive (string, number, boolean) - wrap in object
      responseData = { value: data };
    }

    return res
      .status(statusCode)
      .json(createResponse(true, message, responseData, null, meta));
  } catch (err) {
    console.error("Error in globalResponseHandler:", err);
    if (res.headersSent) return;

    return res.status(500).json(
      createResponse(false, "Internal server error", null, {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }),
    );
  }
};

/**
 * Error Response Handler - For error responses
 * Error is always returned as an object
 */
export const errorResponseHandler = (res, error, statusCode = 500) => {
  if (!res || typeof res.status !== "function") {
    console.error("Invalid response object provided to errorResponseHandler");
    throw new Error("Invalid response object");
  }

  if (res.headersSent) {
    console.error("Headers already sent, cannot send error response");
    return;
  }

  const isDev = process.env.NODE_ENV === "development";
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Error always as object
  const errorData = {
    message: errorObj.message,
    ...(isDev && {
      stack: errorObj.stack,
      ...(error instanceof Error && { details: error }),
    }),
  };

  return res
    .status(statusCode)
    .json(
      createResponse(
        false,
        errorObj.message || "Error occurred",
        null,
        errorData,
      ),
    );
};
