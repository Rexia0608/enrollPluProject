// components/admin/BurstEmailCard.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Mail, Send, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";

// Constants
const PERIODS = [
  "Enrollment",
  "Prelim",
  "Midterm",
  "Pre-Final",
  "Final",
  "Summer",
  "Testda/Short-Courses",
];

const PERIOD_COLORS = {
  Enrollment: "bg-blue-100 text-blue-800 border-blue-200",
  Prelim: "bg-blue-100 text-blue-800 border-blue-200",
  Midterm: "bg-purple-100 text-purple-800 border-purple-200",
  "Pre-Final": "bg-amber-100 text-amber-800 border-amber-200",
  Final: "bg-green-100 text-green-800 border-green-200",
  Summer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Testda/Short-Courses": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

// Status constants
const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SENT: "sent",
};

// Email template messages
const EMAIL_MESSAGES = {
  Enrollment:
    "The enrollment period is approaching. If you are a transferee or a newly admitted student, please visit our website for further instructions.",
  Prelim:
    "Preliminary examinations are approaching. Please ensure that all pending balances are settled to avoid issues with your examination permit.",
  Midterm:
    "Midterm examinations will begin soon. Kindly clear any remaining balance to secure your examination slot.",
  "Pre-Final":
    "The pre-final period is about to begin. Please settle your outstanding balance to continue your academic progress.",
  Final:
    "Final examinations are approaching. Please complete all required payments to be eligible for your final grades.",
  Summer:
    "The summer term is approaching. Please complete all required payments to remain eligible for your final grades.",

  "Testda/Short-Courses":
    "TESDA course assessments are approaching. Please ensure that all requirements are completed to avoid any issues with your evaluation.",
};

// Stats data - ✅ Added missing periods
const STATS = {
  Enrollment: { students: 245, sent: 0, pending: 245 }, // Default values
  Prelim: { students: 245, sent: 198, pending: 47 },
  Midterm: { students: 245, sent: 212, pending: 33 },
  "Pre-Final": { students: 245, sent: 187, pending: 58 },
  Final: { students: 245, sent: 156, pending: 89 },
  Summer: { students: 120, sent: 45, pending: 75 }, // Different numbers for summer
  "Testda/Short-Courses": { students: 85, sent: 32, pending: 53 }, // Different numbers for TESDA
};

function BurstEmailCard() {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ✅ Removed unused handlePeriodChange

  const handlePeriodSelect = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  const handleSendClick = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const confirmSend = useCallback(async () => {
    setConfirmOpen(false);
    setStatus(STATUS.SENDING);

    // Show loading toast
    const toastId = toast.loading(
      `Preparing to send ${selectedPeriod} emails...`,
    );

    try {
      // Simulate API call - replace with actual fetch
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful response
      const data = { sentCount: STATS[selectedPeriod]?.pending || 0 };

      // Dismiss loading toast and show success
      toast.dismiss(toastId);
      toast.success(
        `✅ Successfully sent ${data.sentCount} ${selectedPeriod} emails!`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: CheckCircle,
        },
      );

      setStatus(STATUS.SENT);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setStatus(STATUS.IDLE);
      }, 3000);
    } catch (err) {
      console.error("Failed to send burst email:", err);

      // Dismiss loading toast and show error
      toast.dismiss(toastId);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send emails. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: AlertCircle,
        },
      );

      setStatus(STATUS.IDLE);
    }
  }, [selectedPeriod]);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const emailMessage = useMemo(
    () => EMAIL_MESSAGES[selectedPeriod] || EMAIL_MESSAGES.Prelim,
    [selectedPeriod],
  );

  const periodStats = useMemo(
    () => STATS[selectedPeriod] || STATS.Prelim,
    [selectedPeriod],
  );

  const isSending = status === STATUS.SENDING;
  const buttonText = isSending ? "Sending Emails..." : "Send Burst Email";
  const isButtonDisabled = isSending || status === STATUS.SENT;

  const periodColorClass =
    PERIOD_COLORS[selectedPeriod] || PERIOD_COLORS.Prelim;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Burst Email Campaign
                </h3>
                <p className="text-blue-100 text-sm">
                  Send period announcements to all students
                </p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="p-6">
          {/* Period Selection Card */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Academic Period
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                  disabled={isSending}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm
                    ${
                      selectedPeriod === period
                        ? `${PERIOD_COLORS[period]} border-gray-300 shadow-md scale-105`
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }
                    ${isSending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Email Preview Card */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Email Preview
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${periodColorClass}`}
              >
                {selectedPeriod} Template
              </span>
            </div>

            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
              {/* Email Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedPeriod} Period Announcement
                  </span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {emailMessage}
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg shadow-2xs">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      This message will be sent to{" "}
                      <strong>{periodStats.pending} students </strong> with
                      pending balances
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <PrimaryButton
            className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            icon={Send}
            onClick={handleSendClick}
            disabled={isButtonDisabled}
            loading={isSending}
            aria-label={buttonText}
          >
            {buttonText}
          </PrimaryButton>

          {/* Info Message */}
          <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            This action will send emails to {periodStats.pending} students with
            pending balances for {selectedPeriod}
          </p>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={handleCancel}
        onConfirm={confirmSend}
        title="Confirm Bulk Email"
        message={
          <div className="space-y-2">
            <p>
              You are about to send{" "}
              <span className="font-semibold">{selectedPeriod}</span>{" "}
              announcements to:
            </p>
            <ul className="list-disc list-inside text-sm bg-gray-50 p-3 rounded-lg">
              <li>
                <strong>{periodStats.pending} students</strong> with pending
                balances
              </li>
              <li>All active student accounts</li>
            </ul>
            <p className="text-sm text-amber-600 font-medium">
              This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Send Now"
        cancelText="Cancel"
        variant="warning"
        isLoading={isSending}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default BurstEmailCard;
