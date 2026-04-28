import React from "react";
import { Link } from "react-router-dom";
import { Rocket, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function UpcomingFeatures() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Rocket className="w-10 h-10 text-blue-600" />
            Upcoming Features
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            We're constantly improving the enrollPlus experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-1 gap-6">
          <img
            src="http://localhost:3000/faculty/get-images/upcomingfeatures.gif"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default UpcomingFeatures;
