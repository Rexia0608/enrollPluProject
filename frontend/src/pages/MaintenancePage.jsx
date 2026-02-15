// pages/MaintenancePage.jsx
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import MaintenanceImage from "/img/maintenance.gif?url";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useState } from "react";

const API_URL_MESSAGE = "http://localhost:3000/admin/maintenance-messege";

function MaintenancePage() {
  const [message, setMessage] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMaintenanceMessege();
  }, []);

  const handleSignInClick = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const fetchMaintenanceMessege = async () => {
    try {
      const response = await axios.get(API_URL_MESSAGE);
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <img
          width={400}
          src={MaintenanceImage}
          alt="System under maintenance"
          className="mx-auto mb-8"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          We're Currently Working on an Update
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
        <div className="mt-6 space-x-4">
          <button
            onClick={handleSignInClick}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Go to Sign In Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
