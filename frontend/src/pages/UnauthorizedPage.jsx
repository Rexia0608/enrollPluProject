import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Unauthorized() {
  const { user } = useAuth();

  // Fallback logic
  const dashboardPath = user?.role ? `/${user.role}/dashboard` : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">403</h1>

        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Unauthorized
        </h2>

        <p className="text-gray-600 mt-2">
          You don’t have permission to access this page.
        </p>

        <div className="mt-6">
          <Link
            to={dashboardPath}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            {user ? "Go back to dashboard" : "Go to sign in"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
