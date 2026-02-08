import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

// Constants
const OTP_LENGTH = 4;
const REDIRECT_DELAY = 3000;
const RESEND_COOLDOWN = 30; // seconds
const SUBMIT_COOLDOWN = 2000; // milliseconds
const API_BASE_URL = "http://localhost:3000/auth/verify-otp";

// Email masking utility
const maskEmailSmart = (email) => {
  if (!email || typeof email !== "string") return "";

  const atIndex = email.indexOf("@");
  if (atIndex === -1) return "";

  const name = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  const lastDot = domain.lastIndexOf(".");

  if (lastDot === -1) return `${name}@*****`;

  const domainName = domain.slice(0, lastDot);
  const domainExt = domain.slice(lastDot + 1);

  const maskedDomain =
    domainName.length > 1
      ? `${domainName[0]}${"*".repeat(Math.max(domainName.length - 2, 3))}${domainName.slice(-1)}`
      : `${domainName[0]}***`;

  return `${name}@${maskedDomain}.${domainExt}`;
};

function EmailValidationPage() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const resendTimerRef = useRef(null);
  const submitDisabledRef = useRef(false);

  const currentEmail =
    location.state?.currentEmail || sessionStorage.getItem("currentEmail");

  // Block direct access
  useEffect(() => {
    if (!currentEmail) {
      navigate("/register", { replace: true });
    }
  }, [currentEmail, navigate]);

  // Initialize input refs and autofocus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      resendTimerRef.current = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendTimerRef.current) {
      clearTimeout(resendTimerRef.current);
    }

    return () => {
      if (resendTimerRef.current) {
        clearTimeout(resendTimerRef.current);
      }
    };
  }, [resendCooldown]);

  // Check if we're in cooldown period for resend
  const canResend = useCallback(() => {
    const now = Date.now();
    const timeSinceLastResend = now - lastResendTime;
    const cooldownMs = RESEND_COOLDOWN * 1000;

    if (timeSinceLastResend < cooldownMs) {
      const remainingSeconds = Math.ceil(
        (cooldownMs - timeSinceLastResend) / 1000,
      );
      setResendCooldown(remainingSeconds);
      return false;
    }
    return true;
  }, [lastResendTime]);

  // Check if we're in cooldown period for submit
  const canSubmit = useCallback(() => {
    if (submitDisabledRef.current) return false;

    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;

    if (timeSinceLastSubmit < SUBMIT_COOLDOWN) {
      toast(
        `Please wait ${Math.ceil((SUBMIT_COOLDOWN - timeSinceLastSubmit) / 1000)}s before trying again`,
        {
          type: "warning",
        },
      );
      return false;
    }
    return true;
  }, [lastSubmitTime]);

  // Handle OTP typing
  const handleOtpChange = useCallback(
    (value, index) => {
      if (!/^\d?$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  // Handle backspace
  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  // Handle paste
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.slice(0, OTP_LENGTH).split("");

    if (digits.every((digit) => /^\d$/.test(digit))) {
      const newOtp = [...Array(OTP_LENGTH).fill("")];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);

      const lastFilledIndex = Math.min(digits.length, OTP_LENGTH) - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      toast("Please paste only numbers", { type: "error" });
    }
  }, []);

  // Validate OTP
  const validateOtp = useCallback(() => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast("Please enter the 4-digit verification code", { type: "error" });
      return false;
    }
    if (!/^\d{4}$/.test(code)) {
      toast("OTP must contain only numbers", { type: "error" });
      return false;
    }
    return true;
  }, [otp]);

  // Submit OTP with anti-flood protection
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit()) return;
    if (isSubmitting) return;
    if (!validateOtp()) return;

    // Set submit cooldown
    setLastSubmitTime(Date.now());
    submitDisabledRef.current = true;
    setIsSubmitting(true);

    const code = otp.join("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}`,
        {
          email: currentEmail,
          otp: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );

      toast(response.data.message || "Email verified successfully!", {
        type: "success",
      });

      setIsVerified(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      sessionStorage.removeItem("currentEmail");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, REDIRECT_DELAY);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Verification failed. Please try again.";

      toast(errorMessage, {
        type: "error",
      });

      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);

      // Reset submit cooldown after delay
      setTimeout(() => {
        submitDisabledRef.current = false;
      }, SUBMIT_COOLDOWN);
    }
  };

  // Resend OTP with anti-flood protection
  const handleResendOtp = async () => {
    if (!canResend()) {
      toast(`Please wait ${resendCooldown}s before requesting a new code`, {
        type: "warning",
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email: currentEmail,
      });

      toast("New verification code sent!", { type: "success" });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();

      // Set resend cooldown
      setLastResendTime(Date.now());
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to resend code. Please try again.";

      toast(errorMessage, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  if (!currentEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="text-gray-600 text-sm">We sent a 4-digit code to</p>
            <p
              className="font-semibold text-gray-800 break-all"
              title={currentEmail}
            >
              {maskEmailSmart(currentEmail)}
            </p>
          </div>

          {isVerified ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-semibold text-lg">
                ✅ Email Verified!
              </div>
              <p className="text-gray-600">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type={showOtp ? "text" : "password"}
                    inputMode="numeric"
                    pattern="\d"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isSubmitting}
                    aria-label={`Digit ${index + 1} of verification code`}
                    className={`
                      w-14 h-14 text-center text-xl font-semibold
                      border border-blue-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      outline-none transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isSubmitting ? "opacity-50" : ""}
                    `}
                  />
                ))}
              </div>

              <div className="flex justify-center items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {showOtp ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showOtp ? "Hide code" : "Show code"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting || resendCooldown > 0}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? (
                    <span className="text-gray-500">
                      Resend in {formatTime(resendCooldown)}
                    </span>
                  ) : (
                    "Resend code"
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitDisabledRef.current}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-colors
                  ${
                    isSubmitting || submitDisabledRef.current
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  text-white
                `}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EnrollPlus • Developed by John Rey C.
        </p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default EmailValidationPage;
