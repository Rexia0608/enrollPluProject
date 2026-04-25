import { User, Calendar, Lock, Mail, Eye, EyeOff, Phone } from "lucide-react";
import { useState, useCallback } from "react";
import signUpValidation from "../utils/signUpValidation";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion"; // ← animation library

// Constants
const API_BASE_URL = "http://localhost:3000/enrollplus/register";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState({
    fName: "",
    lName: "",
    birthDate: "",
    gender: "",
    email: "",
    mNumber: "",
    password: "",
  });

  // Debounced validation to avoid validating on every keystroke
  const validateField = useCallback(
    async (name, value) => {
      const { notValid } = await signUpValidation({
        ...inputs,
        [name]: value,
      });
      setInvalid((prev) => ({ ...prev, [name]: notValid[name] || "" }));
    },
    [inputs],
  );

  // Handle input changes
  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    // Validate only after user stops typing (simple debounce)
    if (name !== "gender") {
      const timer = setTimeout(() => validateField(name, value), 500);
      return () => clearTimeout(timer);
    }
  };

  // Handle gender selection
  const handleGenderSelect = async (gender) => {
    const updatedInputs = { ...inputs, gender: gender };
    setInputs(updatedInputs);

    const { notValid } = await signUpValidation(updatedInputs);
    setInvalid((prev) => ({ ...prev, gender: notValid.gender || "" }));
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { notValid, isValid } = await signUpValidation(inputs);

      if (!isValid && Object.keys(notValid).length > 0) {
        setInvalid(notValid);
        const errorMessages = Object.values(notValid).join(", ");
        toast(errorMessages, {
          toastId: "validation-errors",
          type: "error",
          autoClose: 5000,
        });
        return;
      }

      const body = inputs;
      const response = await axios.post(`${API_BASE_URL}`, body);
      toast(response.data.message, {
        toastId: "validation-success",
        type: "success",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/email-validation", {
          state: { currentEmail: response.data.value },
        });
      }, 2500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Something went wrong";

      toast(errorMessage, {
        toastId: "server-error",
        type: "error",
        autoClose: 4000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.values(invalid).every((error) => !error);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-xl"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="space-y-1 mb-6 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900">Sign up here</h2>
            <p className="text-gray-600">Easy and efficient.</p>
          </motion.div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    onChange={onChange}
                    value={inputs.fName}
                    name="fName"
                    type="text"
                    placeholder="First name"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                      invalid.fName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.fName && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-sm text-red-500"
                  >
                    {invalid.fName}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    onChange={onChange}
                    value={inputs.lName}
                    name="lName"
                    type="text"
                    placeholder="Last name"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                      invalid.lName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.lName && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-sm text-red-500"
                  >
                    {invalid.lName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Birthday */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Birthday
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  onChange={onChange}
                  value={inputs.birthDate}
                  name="birthDate"
                  type="date"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                    invalid.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {invalid.birthDate && (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-sm text-red-500"
                >
                  {invalid.birthDate}
                </motion.p>
              )}
            </motion.div>

            {/* Gender */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Female", "Male"].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleGenderSelect(option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 text-sm font-medium rounded-lg border transition-all ${
                      inputs.gender === option
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              {invalid.gender && (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-sm text-red-500"
                >
                  {invalid.gender}
                </motion.p>
              )}
            </motion.div>

            {/* Email and Mobile */}
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    onChange={onChange}
                    value={inputs.email}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                      invalid.email ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.email && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-sm text-red-500"
                  >
                    {invalid.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    onChange={onChange}
                    value={inputs.mNumber}
                    name="mNumber"
                    type="tel"
                    placeholder="Enter mobile"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                      invalid.mNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.mNumber && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-sm text-red-500"
                  >
                    {invalid.mNumber}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  onChange={onChange}
                  value={inputs.password}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-900 outline-none transition-all duration-200 ${
                    invalid.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {invalid.password && (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-sm text-red-500"
                >
                  {invalid.password}
                </motion.p>
              )}
            </motion.div>

            {/* Sign Up Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: isSubmitting || !isFormValid ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || !isFormValid ? 1 : 0.98 }}
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3.5 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 shadow-sm transition-all duration-200 ${
                isSubmitting || !isFormValid
                  ? "bg-green-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-900"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Already have an account */}
          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <NavLink to="/login">
              <p className="text-gray-600">
                Already have an account?{" "}
                <span className="text-green-600 hover:underline hover:text-green-900 font-semibold transition-colors">
                  Sign in
                </span>
              </p>
            </NavLink>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EnrollPlus • Developed by: John Rey C.
          </p>
        </motion.div>

        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default RegisterPage;
