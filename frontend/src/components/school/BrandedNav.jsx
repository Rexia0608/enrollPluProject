import React from "react";
import { useNavigate } from "react-router-dom";

const BrandedNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <img
              src="http://localhost:3000/faculty/get-images/logoTransparent.png"
              alt="LSTC Logo"
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Laguna Science and Technology College
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Filipina Compound Landayan, San Pedro, Philippines, 4023
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Replaced PrimaryButton with a standard button */}
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BrandedNav;
