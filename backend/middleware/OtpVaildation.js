// otpValidationMiddleware.js

// Helper to validate email format
const validEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// Helper to validate OTP (exactly 4 digits)
const validOtp = (otp) => {
  return /^\d{4}$/.test(otp);
};

// Middleware function
export default (req, res, next) => {
  const { email, otp } = req.body;

  // 1️⃣ Check required fields
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing email or OTP",
    });
  }

  // 2️⃣ Validate email
  if (!validEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // 3️⃣ Validate OTP format
  if (!validOtp(otp)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP format",
      errors: ["OTP must be exactly 4 digits"],
    });
  }

  // 4️⃣ All good → proceed to controller
  next();
};
