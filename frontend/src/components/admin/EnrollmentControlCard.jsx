// components/admin/EnrollmentControlCard.jsx
import React, { useState } from "react";
import { Calendar, Lock, Unlock } from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";

function EnrollmentControlCard() {
  const [enrollmentOpen, setEnrollmentOpen] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleToggleEnrollment = () => {
    if (enrollmentOpen) {
      setShowConfirmDialog(true);
    } else {
      setEnrollmentOpen(true);
    }
  };

  const confirmCloseEnrollment = () => {
    setEnrollmentOpen(false);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Enrollment Control
            </h3>
            <p className="text-gray-600">
              Manage enrollment periods and status
            </p>
          </div>
          <StatusBadge status={enrollmentOpen ? "open" : "closed"} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">Academic Year 2024-2025</p>
                <p className="text-sm text-gray-600">Active Year</p>
              </div>
            </div>
            <StatusBadge status="active" size="sm" />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Schedule</span>
              <SecondaryButton size="sm">Edit Schedule</SecondaryButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">January 15, 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">March 31, 2024</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <PrimaryButton
              onClick={handleToggleEnrollment}
              icon={enrollmentOpen ? Lock : Unlock}
              className="w-full"
            >
              {enrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
            </PrimaryButton>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {enrollmentOpen
                ? "Closing enrollment will prevent new applications"
                : "Opening enrollment will allow new applications"}
            </p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmCloseEnrollment}
        title="Close Enrollment?"
        message="Closing enrollment will prevent new students from applying. Existing applications can continue."
        confirmText="Close Enrollment"
        confirmColor="red"
      />
    </>
  );
}

export default EnrollmentControlCard;
