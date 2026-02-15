// components/admin/BurstEmailCard.jsx
import React, { useState, useCallback, useEffect } from "react";
import { Mail, Send, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";
import axios from "axios";

const API_URL = "http://localhost:3000/admin/announcement";
const API_URL_STATS = "http://localhost:3000/admin/stats";
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

function BurstEmailCard() {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const [status, setStatus] = useState("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceStats();
  }, []);

  const fetchMaintenanceStats = async () => {
    try {
      setLoading(true);
      setStats((await axios.get(API_URL_STATS)).data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmSend = useCallback(async () => {
    setConfirmOpen(false);
    setStatus("sending");
    const toastId = toast.loading(
      `Preparing to send ${selectedPeriod} emails...`,
    );
    try {
      const response = await axios.post(API_URL, {
        period: selectedPeriod,
        message: EMAIL_MESSAGES[selectedPeriod],
        recipients: stats?.[selectedPeriod]?.pending || 0,
      });
      toast.dismiss(toastId);
      toast.success(
        `✅ Successfully sent ${response.data?.sentCount || stats?.[selectedPeriod]?.pending || 0} ${selectedPeriod} emails!`,
        { icon: CheckCircle },
      );
      setStatus("sent");
      await fetchMaintenanceStats();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to send burst email:", err);
      toast.dismiss(toastId);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to send emails. Please try again.",
        { icon: AlertCircle },
      );
      setStatus("idle");
    }
  }, [selectedPeriod, stats]);

  const periodStats = stats?.[selectedPeriod] || null;
  const isSending = status === "sending";
  const isButtonDisabled =
    isSending || status === "sent" || loading || !periodStats;
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Academic Period
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  disabled={isSending || loading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${selectedPeriod === period ? `${PERIOD_COLORS[period]} border-gray-300 shadow-md scale-105` : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"} ${isSending || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

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
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedPeriod} Period Announcement
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {EMAIL_MESSAGES[selectedPeriod] || EMAIL_MESSAGES.Prelim}
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg shadow-xs">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {loading ? (
                        "Loading statistics..."
                      ) : !periodStats ? (
                        "This message will be sent to not available yet students with pending balances"
                      ) : (
                        <>
                          This message will be sent to{" "}
                          <strong>{periodStats.pending} students</strong> with
                          pending balances
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
            {["Total Students", "Already Sent", "Pending"].map((label, i) => (
              <div
                key={label}
                className="bg-gray-50 p-2 rounded-lg text-center"
              >
                <span className="text-gray-600 block text-xs">{label}</span>
                <span className="font-semibold">
                  {!periodStats
                    ? "not available yet"
                    : i === 0
                      ? periodStats.students
                      : i === 1
                        ? periodStats.sent
                        : periodStats.pending}
                </span>
              </div>
            ))}
          </div>

          <PrimaryButton
            className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            icon={Send}
            onClick={() => setConfirmOpen(true)}
            disabled={isButtonDisabled}
            loading={isSending}
          >
            {loading
              ? "Loading..."
              : isSending
                ? "Sending Emails..."
                : "Send Burst Email"}
          </PrimaryButton>

          <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            {loading ? (
              "Loading statistics..."
            ) : !periodStats ? (
              <>
                Cannot send emails: Student count{" "}
                <span className="font-semibold">not available yet</span> for{" "}
                {selectedPeriod}
              </>
            ) : (
              <>
                This action will send emails to {periodStats.pending} students
                with pending balances for {selectedPeriod}
              </>
            )}
          </p>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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
                {!periodStats ? (
                  <>
                    <span className="font-semibold">not available yet</span>{" "}
                    students with pending balances
                  </>
                ) : (
                  <>
                    <strong>{periodStats.pending} students</strong> with pending
                    balances
                  </>
                )}
              </li>
              <li>All active student accounts</li>
            </ul>
            {!periodStats && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Cannot proceed: Student count is{" "}
                <span className="font-semibold">not available yet</span>
              </p>
            )}
            <p className="text-sm text-amber-600 font-medium">
              This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Send Now"
        cancelText="Cancel"
        variant="warning"
        isLoading={isSending}
        disabled={!periodStats}
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
