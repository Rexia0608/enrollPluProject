// components/admin/MaintenanceModeCard.jsx
import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  MessageSquare,
  Clock,
  Edit2,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ConfirmDialog from "../ui/ConfirmDialog";

function MaintenanceModeCard() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System is undergoing scheduled maintenance. We expect to be back online by 10:00 PM.",
  );
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [messageInput, setMessageInput] = useState(maintenanceMessage);

  const toggleMaintenanceMode = () => {
    if (maintenanceMode) {
      // Turning off maintenance mode
      setMaintenanceMode(false);
    } else {
      // Turning on maintenance mode - show confirmation
      setShowConfirmDialog(true);
    }
  };

  const confirmActivateMaintenance = () => {
    setMaintenanceMode(true);
    setShowConfirmDialog(false);
  };

  const saveMaintenanceMessage = () => {
    setMaintenanceMessage(messageInput);
    setIsEditingMessage(false);
  };

  return (
    <>
      <Card>
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
              {!isEditingMessage && (
                <button
                  onClick={() => setIsEditingMessage(true)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
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
                />
                <div className="flex space-x-2">
                  <PrimaryButton onClick={saveMaintenanceMessage} size="sm">
                    Save Message
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => setIsEditingMessage(false)}
                    size="sm"
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

          {/* Scheduled Maintenance */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Scheduled Maintenance
              </span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Next Maintenance Window
                  </p>
                  <p className="text-sm text-gray-600">
                    March 15, 2024 • 2:00 AM - 4:00 AM
                  </p>
                </div>
                <SecondaryButton size="sm">Schedule</SecondaryButton>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="pt-4 border-t">
            <PrimaryButton
              onClick={toggleMaintenanceMode}
              className="w-full"
              icon={Shield}
            >
              {maintenanceMode
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
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmActivateMaintenance}
        title="Enable Maintenance Mode?"
        message="This will restrict system access to admin users only. Students and faculty will see the maintenance message and won't be able to access the system."
        confirmText="Enable Maintenance Mode"
        confirmColor="orange"
      />
    </>
  );
}

export default MaintenanceModeCard;
