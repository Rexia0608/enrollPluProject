import { User, Calendar, Lock, Mail, Eye, EyeOff, Phone } from "lucide-react";
import { useState, useCallback } from "react";
import signUpValidation from "../utils/signUpValidation";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState({
    fName: "",
    lName: "",
    birthDate: "",
    sex: "",
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
    if (name !== "sex") {
      // Don't validate gender on every change
      const timer = setTimeout(() => validateField(name, value), 500);
      return () => clearTimeout(timer);
    }
  };

  // Handle gender selection
  const handleGenderSelect = async (gender) => {
    const updatedInputs = { ...inputs, sex: gender };
    setInputs(updatedInputs);

    // Validate gender selection
    const { notValid } = await signUpValidation(updatedInputs);
    setInvalid((prev) => ({ ...prev, sex: notValid.sex || "" }));
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ApiTest = true;

    try {
      const { notValid, isValid } = await signUpValidation(inputs);

      if (isValid || Object.keys(notValid).length === 0) {
        console.log("READY TO SUBMIT 🚀", inputs);

        if (ApiTest) {
          // Set token logic here
        }
        toast(ApiTest ? "Checking Credentials." : "Email is already used.", {
          toastId: "validation-errors",
          type: ApiTest ? "success" : "error",
          autoClose: ApiTest ? 3000 : 5000,
        });
      } else {
        setInvalid(notValid);
        const errorMessages = Object.values(notValid).join(", ");
        toast(`${errorMessages}`, {
          toastId: "validation-errors",
          type: "error",
          autoClose: 5000, // Added for consistency
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = Object.values(invalid).every((error) => !error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl">
        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="space-y-1 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Sign up here</h2>
            <p className="text-gray-600">Easy and efficient.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                      invalid.fName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.fName && (
                  <p className="text-sm text-red-500">{invalid.fName}</p>
                )}
              </div>

              <div className="space-y-2">
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
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                      invalid.lName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.lName && (
                  <p className="text-sm text-red-500">{invalid.lName}</p>
                )}
              </div>
            </div>

            {/* Birthday */}
            <div className="space-y-2">
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
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    invalid.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {invalid.birthDate && (
                <p className="text-sm text-red-500">{invalid.birthDate}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Female", "Male"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleGenderSelect(option)}
                    className={`py-3 text-sm font-medium rounded-lg border transition-all ${
                      inputs.sex === option
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {invalid.sex && (
                <p className="text-sm text-red-500 text-center">
                  {invalid.sex}
                </p>
              )}
            </div>

            {/* Email and Mobile */}
            <div className="space-y-4">
              <div className="space-y-2">
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
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                      invalid.email ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.email && (
                  <p className="text-sm text-red-500">{invalid.email}</p>
                )}
              </div>

              <div className="space-y-2">
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
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                      invalid.mNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {invalid.mNumber && (
                  <p className="text-sm text-red-500">{invalid.mNumber}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
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
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
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
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {invalid.password && (
                <p className="text-sm text-red-500">{invalid.password}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3.5 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-all duration-200 ${
                isSubmitting || !isFormValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <NavLink to="/login">
              <p className="text-gray-600">
                Already have an account?{" "}
                <span className="text-green-600 hover:underline font-semibold">
                  Sign in
                </span>
              </p>
            </NavLink>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EnrollPlus • Developed by: John Rey C.
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default RegisterPage;
