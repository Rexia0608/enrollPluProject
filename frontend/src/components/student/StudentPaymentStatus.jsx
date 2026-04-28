import React, { useState, useEffect } from "react";
import { isFutureDate, getTomorrowDate } from "../../utils/pastDateUtils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import LoadingPage from "../../pages/LoadingPage";

import Card from "../ui/Card";
import axios from "axios";

// ============================================
// 1. STATIC DATA
// ============================================
const PERIODS = [
  { id: "enrollment", label: "Enrollment", order: 1 },
  { id: "prelim", label: "Prelim", order: 2 },
  { id: "mid-term", label: "Mid-Term", order: 3 },
  { id: "pre-final", label: "Pre-Final", order: 4 },
  { id: "final", label: "Final", order: 5 },
];

// Updated STEPS to match the 4-step flow
const STEPS = [
  { id: "periods", label: "Select Period" },
  { id: "method", label: "Payment Method" },
  { id: "qr", label: "QR Code" },
  { id: "submit", label: "Submit Payment" },
];

const PAYMENT_METHODS = [
  { id: "maya", label: "Maya", icon: "💳", color: "from-blue-500 to-blue-700" },
  {
    id: "gcash",
    label: "GCash",
    icon: "📱",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    icon: "🏦",
    color: "from-green-500 to-green-700",
  },
  {
    id: "promised-note",
    label: "Promise to Pay",
    icon: "📝",
    color: "from-yellow-500 to-yellow-700",
  },
];

const STATUS_STYLES = {
  paid: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: "✅",
    label: "Paid",
  },
  review: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    icon: "⏳",
    label: "Under Review",
  },
  pending: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    icon: "⚠️",
    label: "Pending",
  },
};

// ============================================
// 2. UI COMPONENTS
// ============================================
const NotEnrolledView = ({ user, onStartEnrollment }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
  >
    <Card className="max-w-md w-full text-center" padding>
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        You're not enrolled yet
      </h2>
      <p className="text-gray-600 mb-6">
        Hi {user?.name || "Student"}, please complete your enrollment process to
        access payment options.
      </p>
      <button
        onClick={onStartEnrollment}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
      >
        Go to Enrollment
      </button>
    </Card>
  </motion.div>
);

const StepIndicator = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {STEPS.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "#10B981"
                    : isActive
                      ? "#3B82F6"
                      : "#E5E7EB",
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <p
                className={`text-xs mt-2 font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}
              >
                {step.label}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  className="h-full bg-green-500 transition-all duration-500"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

const PaymentPeriodsCard = ({ payments, onSelectPeriod, selectedPeriod }) => {
  const getPeriodData = (periodId) => {
    const p = payments?.find((p) => p.period === periodId);
    return p
      ? {
          status: p.payment_status,
          due: parseFloat(p.payment_per_period || 0),
          balance: parseFloat(p.balance || 0),
        }
      : null;
  };
  const firstUnpaid = PERIODS.find((p) => getPeriodData(p.id)?.balance > 0);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mb-8" padding>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Payment Schedule
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {firstUnpaid
            ? `📌 Current payment needed: ${firstUnpaid.label}`
            : "✅ All payments are complete!"}
        </p>
        <div className="space-y-3">
          {PERIODS.map((period) => {
            const data = getPeriodData(period.id);
            if (!data) return null;
            const isSelected = selectedPeriod?.period === period.id;
            const isUnpaid = data.balance > 0;
            const status =
              STATUS_STYLES[
                data.status === "paid"
                  ? "paid"
                  : data.status === "review"
                    ? "review"
                    : "pending"
              ];
            return (
              <motion.button
                key={period.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  isUnpaid && onSelectPeriod({ period: period.id, ...data })
                }
                disabled={!isUnpaid}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected ? "border-blue-600 bg-blue-50 shadow-md" : isUnpaid ? "border-red-200 bg-white hover:border-red-400 cursor-pointer" : "border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{period.order}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {period.label}
                      </h3>
                      {data.status === "review" && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Under Review
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Amount Due</p>
                      <p className="font-semibold text-gray-800">
                        ₱
                        {data.due.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Balance</p>
                      <p
                        className={`font-semibold ${data.balance > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        ₱
                        {data.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text} ${status.border}`}
                    >
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </div>
                  </div>
                </div>
                {isUnpaid && !isSelected && (
                  <div className="mt-2 text-xs text-blue-600">
                    Click to pay for this period →
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

const PaymentMethodSelector = ({ selectedMethod, onSelect, disabled }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Select Payment Method
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAYMENT_METHODS.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onSelect(method.id)}
          disabled={disabled}
          className={`relative p-4 rounded-xl transition-all ${selectedMethod === method.id ? `bg-linear-to-r ${method.color} text-white shadow-lg` : "bg-white border-2 border-gray-200 hover:border-blue-300"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span className="text-3xl block mb-2">{method.icon}</span>
          <span className="text-sm font-medium">{method.label}</span>
          {selectedMethod === method.id && (
            <motion.div
              layoutId="activeMethod"
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              ✓
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  </div>
);

const QRDisplay = ({ method }) => {
  const qrMap = {
    maya: {
      bg: "from-blue-500 to-blue-700",
      text: "Maya QR Code",
      desc: "Scan with Maya app to pay",
    },
    gcash: {
      bg: "from-blue-400 to-blue-600",
      text: "GCash QR Code",
      desc: "Scan with GCash app to pay",
    },
    "bank-transfer": {
      bg: "from-green-500 to-green-700",
      text: "Instapay QR Code",
      desc: "Scan with your banking app",
    },
  };
  const qr = qrMap[method];
  if (!qr) return null;
  return (
    <Card className={`bg-linear-to-br ${qr.bg} text-white text-center`} padding>
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
          <span className="text-gray-600">{qr.text}</span>
        </div>
      </div>
      <p className="text-sm">{qr.desc}</p>
    </Card>
  );
};

const PromiseNoteForm = ({ onSubmit, onCancel, amount }) => {
  const [promiseDate, setPromiseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [dateError, setDateError] = useState("");
  const minDate = getTomorrowDate();
  const handleDateChange = (e) => {
    setPromiseDate(e.target.value);
    if (dateError) setDateError("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!promiseDate) {
      setDateError("Promise date is required.");
      return;
    }
    if (!isFutureDate(promiseDate)) {
      setDateError("Promise date must be a future date (tomorrow or later).");
      return;
    }
    onSubmit({ promiseDate, notes, amount });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-yellow-50 border-2 border-yellow-200" padding>
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          Promise to Pay Note
        </h3>
        <p className="text-sm text-yellow-700 mb-4">
          Amount to pay: ₱
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Promise Date *
            </label>
            <input
              type="date"
              value={promiseDate}
              onChange={handleDateChange}
              min={minDate}
              className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              required
            />
            {dateError && (
              <p className="mt-1 text-xs text-red-600">{dateError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              rows="3"
              placeholder="Add any additional notes or conditions..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
            >
              Submit Promise
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

// ==================== PaymentForm with Amount = Due (min) up to Balance (max) ====================
const PaymentForm = ({
  selectedPeriod,
  paymentMethod,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [amount, setAmount] = useState(() => {
    const due = selectedPeriod?.due || 0;
    const balance = selectedPeriod?.balance || 0;
    return due <= balance ? due : balance;
  });
  const [referenceNumber, setReferenceNumber] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getReferenceLabel = () => {
    switch (paymentMethod) {
      case "maya":
        return "Reference ID *";
      case "gcash":
        return "Ref No. *";
      case "bank-transfer":
        return "Confirmation No. / Transaction ID *";
      default:
        return "Reference / Transaction Number *";
    }
  };

  const getReferenceBaseLabel = () => {
    switch (paymentMethod) {
      case "maya":
        return "Reference ID";
      case "gcash":
        return "Ref No.";
      case "bank-transfer":
        return "Confirmation No. / Transaction ID";
      default:
        return "Reference / Transaction Number";
    }
  };

  const getReferencePlaceholder = () => {
    switch (paymentMethod) {
      case "maya":
        return "Enter Maya Reference ID";
      case "gcash":
        return "Enter GCash Reference Number";
      case "bank-transfer":
        return "Enter confirmation or transaction number";
      default:
        return "Enter transaction or reference number";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(f.type)) {
      alert("Please upload only PNG, JPG, or PDF files.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById("payment-proof-input");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const due = selectedPeriod?.due || 0;
    const balance = selectedPeriod?.balance || 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < due) {
      alert(`Amount must be at least ₱${due.toLocaleString()}.`);
      return;
    }
    if (amountNum > balance) {
      alert(
        `Amount cannot exceed remaining balance of ₱${balance.toLocaleString()}.`,
      );
      return;
    }
    if (!referenceNumber.trim()) {
      alert(`Please enter ${getReferenceBaseLabel()}.`);
      return;
    }
    if (!file) {
      alert("Please upload proof of payment.");
      return;
    }
    onSubmit({
      amount: amountNum,
      referenceNumber: referenceNumber.trim(),
      file,
      period: selectedPeriod.period,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
    >
      <Card padding>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800">
            Paying for:{" "}
            <strong className="capitalize">{selectedPeriod?.period}</strong>
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Total Due for this period: ₱
            {selectedPeriod?.due.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Remaining Balance: ₱
            {selectedPeriod?.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Pay *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₱</span>
            <input
              type="number"
              step="0.01"
              min={selectedPeriod?.due || 0}
              max={selectedPeriod?.balance || 0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum: ₱{selectedPeriod?.due.toLocaleString()} (due amount) |
            Maximum: ₱{selectedPeriod?.balance.toLocaleString()} (remaining
            balance)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getReferenceLabel()}
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={getReferencePlaceholder()}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Proof *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors relative">
            {!file ? (
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="payment-proof-input"
                      type="file"
                      className="sr-only"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            ) : (
              <div className="w-full text-center">
                {previewUrl ? (
                  <div className="mb-3">
                    <img
                      src={previewUrl}
                      alt="Payment proof preview"
                      className="max-h-40 mx-auto rounded-lg border shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13h-6M15 17h-6M9 9h1"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 mt-1">{file.name}</p>
                    <p className="text-xs text-gray-500">PDF file</p>
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 text-sm">
                    <span>Change file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isSubmitting || !amount || !referenceNumber.trim() || !file
            }
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Submit Payment"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </Card>
    </motion.form>
  );
};

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <Card className="max-w-md w-full text-center" padding>
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
      <p className="text-gray-600">{error}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Try Again
      </button>
    </Card>
  </div>
);

// ============================================
// 3. MAIN COMPONENT
// ============================================
const StudentPaymentStatus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAuthHeaders } = useStudent();
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    enrollment: null,
    payments: [],
    selectedPeriod: null,
    currentStep: 0,
    selectedMethod: null,
    showPromiseForm: false,
    isSubmitting: false,
    submitStatus: null,
  });
  const [toast, setToast] = useState(null);
  const update = (updates) => setState((prev) => ({ ...prev, ...updates }));
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchData = async () => {
    if (!user?.id) return;
    update({ isLoading: true, error: null });
    try {
      const enrollmentRes = await axios.get(
        `http://localhost:3000/student/validate-enrolled-student/${user.id}`,
        getAuthHeaders(),
      );
      const enrollmentItems = enrollmentRes.data?.items || [];
      if (!enrollmentRes.data.success || enrollmentItems.length === 0) {
        update({ isLoading: false, enrollment: null });
        return;
      }
      const enrollmentData = enrollmentItems[0];
      update({ enrollment: enrollmentData });
      if (enrollmentData.enrollment_id) {
        const paymentsRes = await axios.get(
          `http://localhost:3000/student/payments-all-periods/${enrollmentData.enrollment_id}`,
          getAuthHeaders(),
        );
        if (paymentsRes.data.success && Array.isArray(paymentsRes.data.items)) {
          const payments = paymentsRes.data.items.map((item) => ({
            id: item.id,
            period: item.period,
            payment_status: item.payment_status,
            paid_amount: parseFloat(item.paid_amount || 0),
            balance: parseFloat(item.balance || 0),
            payment_per_period: parseFloat(item.payment_per_period || 0),
            remarks: item.remarks,
          }));
          update({ payments });
        } else {
          update({ payments: [] });
        }
      }
    } catch (err) {
      console.error("Failed to load payment data:", err);
      update({ error: "Failed to load payment data. Please try again." });
    } finally {
      update({ isLoading: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, getAuthHeaders]);

  const handlePaymentSubmit = async ({
    amount,
    referenceNumber,
    file,
    period,
  }) => {
    update({ isSubmitting: true, submitStatus: null });
    try {
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          isEnrolled: !!state.enrollment,
          activeEnrollmentId: state.enrollment?.enrollment_id,
        }),
      );
      formData.append(
        "paymentDetails",
        JSON.stringify({
          period,
          amount,
          referenceNumber,
          paymentMethod: state.selectedMethod,
          remainingBalance: state.selectedPeriod?.balance - amount,
        }),
      );
      if (file) formData.append("proofOfPayment", file);
      formData.append("promiseNote", JSON.stringify({ promiseStatus: false }));
      const res = await axios.post(
        "http://localhost:3000/student/enrollment-payment-upload-process",
        formData,
        getAuthHeaders(),
      );
      if (res.data?.success) {
        update({
          submitStatus: {
            type: "success",
            message: res.data.message || "Payment submitted successfully!",
          },
          currentStep: 0,
          selectedPeriod: null,
          selectedMethod: null,
          showPromiseForm: false,
        });
        await fetchData();
      } else {
        throw new Error(res.data?.message || "Payment failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to process payment. Please try again.";
      if (
        errorMessage.includes(
          'duplicate key value violates unique constraint "transaction_table_tracking_number_key"',
        )
      ) {
        showToast(
          "This reference number has already been used. Please settle your balance.",
          "error",
        );
      } else {
        update({
          submitStatus: {
            type: "error",
            message: errorMessage,
          },
        });
      }
    } finally {
      update({ isSubmitting: false });
    }
  };

  const handlePromiseSubmit = async (promiseData) => {
    update({ isSubmitting: true });
    try {
      const submitData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isEnrolled: !!state.enrollment,
          activeEnrollmentId: state.enrollment?.enrollment_id,
        },
        paymentDetails: {
          period: state.selectedPeriod.period,
          amount: state.selectedPeriod.due,
          paymentStatus: "review",
          referenceNumber: state.enrollment?.enrollment_id,
          remarks: promiseData.notes,
          remainingBalance: state.selectedPeriod.balance,
        },
        promiseNote: {
          promiseStatus: true,
          date: promiseData.promiseDate,
          note: promiseData.notes,
        },
      };
      const res = await axios.post(
        "http://localhost:3000/student/enrollment-payment-upload-process",
        submitData,
        getAuthHeaders(),
      );
      if (res.data?.success) {
        update({
          submitStatus: {
            type: "success",
            message:
              res.data.message || "Promise to pay submitted successfully!",
          },
          currentStep: 0,
          selectedPeriod: null,
          selectedMethod: null,
          showPromiseForm: false,
        });
        setTimeout(() => window.location.reload(), 5000);
      } else {
        throw new Error(res.data?.message || "Failed to submit promise to pay");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit promise to pay. Please try again.";
      if (
        errorMessage.includes(
          'duplicate key value violates unique constraint "transaction_table_tracking_number_key"',
        )
      ) {
        showToast(
          "This reference number has already been used. Please use a different reference number.",
          "error",
        );
      } else {
        update({
          submitStatus: {
            type: "error",
            message: errorMessage,
          },
        });
      }
    } finally {
      update({ isSubmitting: false });
    }
  };

  if (state.isLoading) return <LoadingPage />;
  if (state.error)
    return (
      <ErrorDisplay
        error={state.error}
        onRetry={() => window.location.reload()}
      />
    );
  if (!state.enrollment)
    return (
      <NotEnrolledView
        user={user}
        onStartEnrollment={() => navigate("/student/dashboard/enrollment")}
      />
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome, {user?.name} | Enrollment ID:{" "}
            {state.enrollment.enrollment_id}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {state.enrollment.semester} • {state.enrollment.year_series}
          </p>
        </div>
        <StepIndicator currentStep={state.currentStep} />
        {state.currentStep === 0 && (
          <PaymentPeriodsCard
            payments={state.payments}
            onSelectPeriod={(p) =>
              update({ selectedPeriod: p, currentStep: 1 })
            }
            selectedPeriod={state.selectedPeriod}
          />
        )}
        {state.currentStep === 1 && state.selectedPeriod && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="mb-6" padding>
              <button
                onClick={() => update({ currentStep: 0, selectedPeriod: null })}
                className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                ← Back to periods
              </button>
              <PaymentMethodSelector
                selectedMethod={state.selectedMethod}
                onSelect={(m) =>
                  update({
                    selectedMethod: m,
                    showPromiseForm: m === "promised-note",
                    currentStep: m !== "promised-note" ? 2 : state.currentStep,
                  })
                }
                disabled={state.isSubmitting}
              />
            </Card>
            {state.showPromiseForm && (
              <div className="mt-6">
                <PromiseNoteForm
                  onSubmit={handlePromiseSubmit}
                  onCancel={() =>
                    update({ selectedMethod: null, showPromiseForm: false })
                  }
                  amount={state.selectedPeriod.due}
                />
              </div>
            )}
          </motion.div>
        )}
        {state.currentStep === 2 &&
          state.selectedMethod &&
          !state.showPromiseForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="mb-6" padding>
                <button
                  onClick={() =>
                    update({ currentStep: 1, selectedMethod: null })
                  }
                  className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  ← Back to payment methods
                </button>
                <QRDisplay method={state.selectedMethod} />
                <button
                  onClick={() => update({ currentStep: 3 })}
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
                >
                  Continue to Payment Form
                </button>
              </Card>
            </motion.div>
          )}
        {state.currentStep === 3 &&
          state.selectedMethod &&
          !state.showPromiseForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="mb-6" padding>
                <button
                  onClick={() => update({ currentStep: 2 })}
                  className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  ← Back to QR code
                </button>
                <PaymentForm
                  selectedPeriod={state.selectedPeriod}
                  paymentMethod={state.selectedMethod}
                  onSubmit={handlePaymentSubmit}
                  onCancel={() =>
                    update({ currentStep: 1, selectedMethod: null })
                  }
                  isSubmitting={state.isSubmitting}
                />
              </Card>
            </motion.div>
          )}
        <AnimatePresence>
          {state.submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card
                className={
                  state.submitStatus.type === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
                padding
              >
                <p
                  className={
                    state.submitStatus.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }
                >
                  {state.submitStatus.message}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Toast Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full"
          >
            <Card
              className={`${toast.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"} shadow-lg`}
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm ${toast.type === "error" ? "text-red-800" : "text-green-800"}`}
                >
                  {toast.message}
                </p>
                <button
                  onClick={() => setToast(null)}
                  className="ml-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentPaymentStatus;
