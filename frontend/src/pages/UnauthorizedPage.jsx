// pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import MaintenanceImage from "/img/maintenance.gif?url";

function NotFound() {
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
        <div className="mt-6 space-x-4">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Go to sign in page.
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
