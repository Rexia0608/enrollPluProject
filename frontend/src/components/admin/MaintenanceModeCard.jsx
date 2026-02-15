// components/admin/MaintenanceModeCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Shield, AlertTriangle, MessageSquare, Edit2 } from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ConfirmDialog from "../ui/ConfirmDialog";

const API_URL = "http://localhost:3000/admin/maintenance";

function MaintenanceModeCard() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System is undergoing scheduled maintenance. We expect to be back online by 10:00 PM.",
  );
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [messageInput, setMessageInput] = useState(maintenanceMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current maintenance status on component mount
  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      // Change from data.maintenanceMode to data.isActive
      setMaintenanceMode(data.isActive); // <-- FIX HERE
      setMaintenanceMessage(data.message || maintenanceMessage);
      setMessageInput(data.message || maintenanceMessage);
    } catch (err) {
      console.error("Error fetching maintenance status:", err);
      setError(
        err.response?.data?.message || "Failed to load maintenance status",
      );
    }
  };

  const updateMaintenanceStatus = async (mode, message) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(API_URL, {
        maintenanceMode: mode, // This is correct - sending to backend
        message: message,
      });

      const data = response.data;
      console.log("Response from server:", data); // Add this to debug

      // Update local state with the response
      // Change from data.maintenanceMode to data.isActive
      setMaintenanceMode(data.isActive); // <-- FIX HERE
      setMaintenanceMessage(data.message);
      setMessageInput(data.message);
    } catch (err) {
      console.error("Error updating maintenance status:", err);
      setError(
        err.response?.data?.message || "Failed to update maintenance status",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaintenanceMode = () => {
    if (maintenanceMode) {
      // Turning off maintenance mode - update immediately
      updateMaintenanceStatus(false, maintenanceMessage);
    } else {
      // Turning on maintenance mode - show confirmation
      setShowConfirmDialog(true);
    }
  };

  const confirmActivateMaintenance = async () => {
    await updateMaintenanceStatus(true, maintenanceMessage);
    setShowConfirmDialog(false);
  };

  const saveMaintenanceMessage = async () => {
    await updateMaintenanceStatus(maintenanceMode, messageInput);
    setIsEditingMessage(false);
  };

  return (
    <>
      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                maintenanceMode ? "bg-orange-100" : "bg-gray-100"
              }`}
            >
              <Shield
                className={`w-6 h-6 ${maintenanceMode ? "text-orange-600" : "text-gray-600"}`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Maintenance Mode
              </h3>
              <p className="text-gray-600">Control system availability</p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              maintenanceMode
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {maintenanceMode ? "Active" : "Inactive"}
          </div>
        </div>

        {maintenanceMode && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">
                  Maintenance Mode Active
                </p>
                <p className="text-orange-800 text-sm mt-1">
                  System is currently in maintenance mode. Students and faculty
                  cannot access the system.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Maintenance Message */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  Maintenance Message
                </span>
              </div>
              {!isEditingMessage && !isLoading && (
                <button
                  onClick={() => setIsEditingMessage(true)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditingMessage ? (
              <div className="space-y-3">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter maintenance message for users..."
                  disabled={isLoading}
                />
                <div className="flex space-x-2">
                  <PrimaryButton
                    onClick={saveMaintenanceMessage}
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Message"}
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => {
                      setIsEditingMessage(false);
                      setMessageInput(maintenanceMessage);
                    }}
                    size="sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </SecondaryButton>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700">{maintenanceMessage}</p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <div className="pt-4 border-t">
            <PrimaryButton
              onClick={toggleMaintenanceMode}
              className="w-full"
              icon={Shield}
              disabled={isLoading}
            >
              {isLoading
                ? "Updating..."
                : maintenanceMode
                  ? "Disable Maintenance Mode"
                  : "Enable Maintenance Mode"}
            </PrimaryButton>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {maintenanceMode
                ? "Disabling will restore normal system access"
                : "Enabling will restrict access to admin users only"}
            </p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          console.log("Closing dialog");
          setShowConfirmDialog(false);
        }}
        onConfirm={() => {
          console.log("onConfirm triggered in ConfirmDialog");
          confirmActivateMaintenance();
        }}
        title="Enable Maintenance Mode?"
        message="This will restrict system access to admin users only. Students and faculty will see the maintenance message and won't be able to access the system."
        confirmText="Enable Maintenance Mode"
      />
    </>
  );
}

export default MaintenanceModeCard;
