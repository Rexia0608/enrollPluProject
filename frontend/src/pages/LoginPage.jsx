import { Lock, Mail, Eye, EyeOff, Building } from "lucide-react";
import { useState } from "react";
import signInValidation from "../utils/signInValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Constants
const API_BASE_URL = "http://localhost:3000/auth/login";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState({});
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  // 🔐 AUTH CONTEXT
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

    const { notValid } = await signInValidation(inputs);
    setInvalid(notValid);

    if (Object.keys(notValid).length !== 0) {
      toast(Object.values(notValid).join(", "), { type: "error" });
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, inputs);

      // Correctly destructure from response.data.response
      const { user, token } = response.data.response;

      // Save to AuthContext
      login({
        ...user,
        token,
      });

      // Optional persistence
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast("Login successful!", { type: "success" });

      // Redirect by role
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "faculty") navigate("/faculty/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setTimeout(() => {
          navigate("/email-validation", {
            state: {
              currentEmail: inputs.email,
            },
          });
        }, 1500);
      }
      toast(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
        { type: "error" },
      );
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Welcome Content (Hidden on mobile, shown on larger screens) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 p-8 md:p-12 flex-col justify-center">
        <div className="max-w-lg mx-auto text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Building className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">EnrollPlus</h1>
                <p className="text-blue-200 font-medium">
                  School Enrollment System
                </p>
              </div>
            </div>

            <p className="text-xl font-light text-blue-100 leading-relaxed">
              Streamline your school's enrollment process with our comprehensive
              management system designed for administrators, faculty, and
              students.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Key Features</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>
                    Role-based dashboards for admin, faculty, and students
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Document upload and review system</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Payment validation and tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Real-time enrollment status updates</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-blue-500/30">
              <h3 className="text-lg font-semibold mb-3">Demo Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="font-medium">Admin</div>
                  <div className="text-sm text-blue-200">admin@school.edu</div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="font-medium">Faculty</div>
                  <div className="text-sm text-blue-200">
                    faculty@school.edu
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="font-medium">Student</div>
                  <div className="text-sm text-blue-200">
                    student@school.edu
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-200 mt-3">
                Password: <span className="font-mono">demo123</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Always visible, takes full width on mobile) */}
      <div className="w-full lg:w-1/2 xl:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (Only shows on mobile) */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EnrollPlus</h1>
                <p className="text-blue-600 font-medium text-sm">
                  School Enrollment System
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    onChange={(e) => onChange(e)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border-gray-300"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="font-mono text-red-600">
                    {invalid.email}
                  </span>
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="font-mono text-red-600">
                    {invalid.password}
                  </span>
                </p>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmit}
                className="w-full py-3.5 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all duration-20 bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign In
              </button>
            </form>

            {/* Mobile Demo Info (Only shows on mobile) */}
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Demo
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Admin</span>
                  <span className="text-xs font-mono text-blue-600">
                    admin@school.edu
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Faculty</span>
                  <span className="text-xs font-mono text-green-600">
                    faculty@school.edu
                  </span>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <NavLink to="/register">
              <div className="mt-6 text-center">
                <p className="text-sm text-blue-600 hover:underline hover:text-blue-700 font-medium">
                  Create an Accout
                </p>
              </div>
            </NavLink>

            <NavLink to="/***">
              <div className="mt-6 text-center">
                <p className="text-sm text-blue-600 hover:underline hover:text-blue-700 font-medium">
                  Forgot password?
                </p>
              </div>
            </NavLink>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} EnrollPlus • Developed by: John Rey
              C.
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
