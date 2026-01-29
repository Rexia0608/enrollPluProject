// components/student/StudentStatus.jsx
import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  CreditCard,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton.jsx";
import StatusBadge from "../ui/StatusBadge";

function StudentStatus() {
  const [enrollmentStage] = useState("documents_pending");

  const stages = [
    {
      id: 1,
      stage: "not_started",
      label: "Not Started",
      description: "Begin your enrollment",
      completed: false,
    },
    {
      id: 2,
      stage: "documents_pending",
      label: "Documents Pending",
      description: "Upload required documents",
      completed: false,
      current: true,
    },
    {
      id: 3,
      stage: "documents_approved",
      label: "Documents Approved",
      description: "Await document review",
      completed: false,
    },
    {
      id: 4,
      stage: "payment_pending",
      label: "Payment Pending",
      description: "Submit payment proof",
      completed: false,
    },
    {
      id: 5,
      stage: "payment_validated",
      label: "Payment Validated",
      description: "Await payment validation",
      completed: false,
    },
    {
      id: 6,
      stage: "enrolled",
      label: "Enrolled",
      description: "Enrollment complete",
      completed: false,
    },
  ];

  const getCurrentAction = () => {
    switch (enrollmentStage) {
      case "not_started":
        return { text: "Start Enrollment", icon: Upload, action: () => {} };
      case "documents_pending":
        return { text: "Upload Documents", icon: Upload, action: () => {} };
      case "payment_pending":
        return { text: "Make Payment", icon: CreditCard, action: () => {} };
      default:
        return { text: "View Details", icon: CheckCircle, action: () => {} };
    }
  };

  const currentAction = getCurrentAction();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrollment Status</h1>
        <p className="text-gray-600">Track your enrollment progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Progress Overview
                </h3>
                <p className="text-gray-600">
                  Complete each step to finish enrollment
                </p>
              </div>
              <StatusBadge status={enrollmentStage.split("_").join(" ")} />
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>

            {/* Enrollment Steps */}
            <div className="space-y-4">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`flex items-center p-4 rounded-lg border ${
                    stage.current
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      stage.completed
                        ? "bg-green-100"
                        : stage.current
                          ? "bg-blue-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {stage.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : stage.current ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {stage.label}
                      </h4>
                      {stage.current && (
                        <span className="text-sm text-blue-600 font-medium">
                          Current Step
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Next Action Required
            </h3>
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center">
                <currentAction.icon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">Action Needed</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                {enrollmentStage === "documents_pending"
                  ? "Upload the required documents to proceed with your enrollment."
                  : "Complete the next step to continue your enrollment process."}
              </p>
            </div>
            <PrimaryButton
              onClick={currentAction.action}
              icon={currentAction.icon}
              className="w-full"
            >
              {currentAction.text}
            </PrimaryButton>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deadlines
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Document Submission</span>
                <span className="text-sm text-gray-600">Mar 15, 2024</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Payment Deadline</span>
                <span className="text-sm text-gray-600">Mar 25, 2024</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentStatus;
