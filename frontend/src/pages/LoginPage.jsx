import { Lock, Mail, Eye, EyeOff, Building } from "lucide-react";
import { useState } from "react";
import signInValidation from "../utils/signInValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion"; // ← animation library

// Constants
const API_BASE_URL = "http://localhost:3000/enrollplus/login";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState({});
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = async (e) => {
    const newInputs = { ...inputs, [e.target.name]: e.target.value };
    setInputs(newInputs);
    const { notValid } = await signInValidation(newInputs);
    setInvalid(notValid);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const { notValid } = await signInValidation(inputs);
    setInvalid(notValid);
    if (Object.keys(notValid).length !== 0) {
      toast(Object.values(notValid).join(", "), { type: "error" });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(API_BASE_URL, inputs);
      const { user, token } = response.data.response;
      login({ ...user, token });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast("Login successful!", { type: "success" });
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "faculty") navigate("/faculty/dashboard");
        else navigate("/student/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message === "Email is not yet verified.") {
        toast("Email not verified. Redirecting to verification...", {
          type: "info",
        });
        setTimeout(() => {
          navigate("/email-validation", {
            state: { currentEmail: inputs.email },
          });
        }, 1500);
      } else {
        toast(
          err.response?.data?.message ||
            "Login failed. Please check your credentials.",
          { type: "error" },
        );
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 4500);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  const leftVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const rightVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Side - Animated */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={leftVariants}
        className="hidden lg:flex lg:w-1/2 xl:w-1/2 bg-green-900 p-8 md:p-12 flex-col justify-center"
      >
        <div className="max-w-lg mx-auto text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              >
                <Building className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold">EnrollPlus</h1>
                <p className="text-green-200 font-medium">
                  School Enrollment System
                </p>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-light text-green-100 leading-relaxed"
            >
              Streamline your school's enrollment process with our comprehensive
              management system designed for administrators, faculty, and
              students.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Key Features</h2>
            <ul className="space-y-3">
              {[
                "Role-based dashboards for admin, faculty, and students",
                "Real-time enrollment status updates via email",
                "Document upload and review system",
                "Payment QR validation and tracking",
              ].map((feature, idx) => (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form (Animated) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightVariants}
        className="w-full lg:w-1/2 xl:w-1/2 flex items-center justify-center p-4 md:p-8"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (with fade-in) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden text-center mb-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EnrollPlus</h1>
                <p className="text-green-600 font-medium text-sm">
                  School Enrollment System
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Card with Staggered Children */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
          >
            <motion.div variants={itemVariants} className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </motion.div>

            <form className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    onChange={(e) => onChange(e)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 border-gray-300"
                    required
                    disabled={isLoading}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: invalid.email ? 1 : 0 }}
                  className="text-xs text-gray-500"
                >
                  <span className="font-mono text-red-600">
                    {invalid.email}
                  </span>
                </motion.p>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    onChange={(e) => onChange(e)}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 border-gray-300"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: invalid.password ? 1 : 0 }}
                  className="text-xs text-gray-500"
                >
                  <span className="font-mono text-red-600">
                    {invalid.password}
                  </span>
                </motion.p>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={onSubmit}
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-all duration-200 ${
                  isLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-900 text-white"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            {/* Mobile Demo Info (Animated) */}
            <motion.div
              variants={itemVariants}
              className="lg:hidden mt-6 pt-6 border-t border-gray-200"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Demo
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Admin</span>
                  <span className="text-xs font-mono text-green-600">
                    johnDoeAdmin12@gmail.com
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Faculty</span>
                  <span className="text-xs font-mono text-green-600">
                    juanDelaCruzFaculty12@gmail.com
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Help Links with hover animations */}
            <motion.div variants={itemVariants}>
              <NavLink to="/register">
                <div className="mt-6 text-center">
                  <p className="text-sm text-green-600 hover:underline hover:text-green-900 font-medium transition-all duration-200">
                    Create an Account
                  </p>
                </div>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NavLink to="/***">
                <div className="mt-6 text-center">
                  <p className="text-sm text-green-600 hover:underline hover:text-green-900 font-medium transition-all duration-200">
                    Forgot password?
                  </p>
                </div>
              </NavLink>
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} EnrollPlus • Developed by: John Rey
              C.
            </p>
          </motion.div>
        </div>
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default LoginPage;
