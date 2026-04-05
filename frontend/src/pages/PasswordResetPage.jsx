import { Eye, EyeOff } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const REDIRECT_DELAY = 3000;
const SUBMIT_COOLDOWN = 2000;
const VALIDATION_COOLDOWN_MS = 1000;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function PasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [validationCooldown, setValidationCooldown] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error(
        "Invalid or missing reset link. Please request a new password reset.",
      );
      setIsValidToken(false);
      setIsCheckingToken(false);
      setTimeout(() => {
        navigate("/password-reset-expired", { replace: true });
      }, 2000);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/enrollplus/verify-reset-token/${encodeURIComponent(
            token,
          )}`,
          { timeout: 10000 },
        );

        const isValid = response.data.value;

        if (!isValid) {
          toast.error("The password reset link is invalid or has expired.");
          setIsValidToken(false);
          setTimeout(() => {
            navigate("/password-reset-expired", { replace: true });
          }, 1500);
          return;
        }

        setIsValidToken(true);
      } catch (error) {
        console.error("Token verification error:", error);
        toast.error("The password reset link is invalid or has expired.");
        setIsValidToken(false);
        setTimeout(() => {
          navigate("/password-reset-expired", { replace: true });
        }, 1500);
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const validatePasswords = useCallback(() => {
    if (!newPassword || !confirmPassword) {
      return "Please fill in both password fields";
    }
    if (newPassword.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCooldown || isSubmitting) return;

    const validationError = validatePasswords();
    if (validationError) {
      if (!validationCooldown) {
        toast.error(validationError);
        setValidationCooldown(true);
        setTimeout(() => setValidationCooldown(false), VALIDATION_COOLDOWN_MS);
      }
      return;
    }

    setIsCooldown(true);
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/enrollplus/set-new-password/${token}`,
        [newPassword],
        {
          timeout: 10000,
        },
      );

      toast.success(
        response.data?.message || "Password reset successful! Please log in.",
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, REDIRECT_DELAY);
    } catch (err) {
      console.error("Password reset error:", err.response?.data);

      let errorMessage = "Password reset failed. Please try again.";

      if (err.response) {
        errorMessage =
          err.response.data?.error?.message ||
          err.response.data?.message ||
          errorMessage;
      } else if (err.request) {
        errorMessage = "Server is not responding. Please try again later.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      toast.error(errorMessage);

      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setIsCooldown(false);
      }, SUBMIT_COOLDOWN);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">Verifying reset link...</div>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-600 text-sm">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter new password (min. 8 characters)"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCooldown}
              className={`
                w-full py-3 rounded-lg font-semibold transition-colors
                ${
                  isSubmitting || isCooldown
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                text-white
              `}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
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

export default PasswordResetPage;
