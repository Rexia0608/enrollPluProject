import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function EmailValidationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const currentEmail =
    location.state?.currentEmail || sessionStorage.getItem("currentEmail");

  // 🚫 Block direct access
  useEffect(() => {
    if (!currentEmail) {
      navigate("/register");
    }
  }, [currentEmail, navigate]);

  // Autofocus first OTP box
  useEffect(() => {
    document.getElementById("otp-0")?.focus();
  }, []);

  // Mask email
  const maskEmailSmart = (email) => {
    if (!email || !email.includes("@")) return "";
    const [name, domain] = email.split("@");
    const lastDot = domain.lastIndexOf(".");
    if (lastDot === -1) return `${name}@*****`;
    const domainName = domain.slice(0, lastDot);
    const domainExt = domain.slice(lastDot + 1);
    const maskedDomain =
      domainName[0] +
      "*".repeat(Math.max(domainName.length - 2, 3)) +
      domainName.slice(-1);
    return `${name}@${maskedDomain}.${domainExt}`;
  };

  // Handle OTP typing
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
    if (pasted.every((d) => /^\d$/.test(d))) setOtp(pasted);
  };

  // Submit OTP
  const onSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 4) {
      toast("Please enter the 4-digit verification code", { type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/verify-otp",
        {
          email: currentEmail,
          otp: code,
        },
      );

      toast(response.data.message, { type: "success" });

      setIsVerified(true);
      setOtp(["", "", "", ""]);
      sessionStorage.removeItem("currentEmail");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast(err.response?.data?.error || "Verification failed", {
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="text-gray-600 text-sm">We sent a 4-digit code to</p>
            <p className="font-semibold text-gray-800">
              {maskEmailSmart(currentEmail)}
            </p>
          </div>

          {isVerified ? (
            <div className="text-center text-green-600 font-semibold text-lg">
              ✅ Email Verified! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type={showOtp ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="
                      w-14 h-14 text-center text-xl font-semibold
                      border border-blue-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500
                      outline-none
                    "
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showOtp ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showOtp ? "Hide code" : "Show code"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold
                  bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Verify
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EnrollPlus • Developed by John Rey C.
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default EmailValidationPage;
