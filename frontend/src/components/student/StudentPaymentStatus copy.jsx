// StudentPaymentStatus.jsx - Updated to show all periods
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import axios from "axios";

// ============================================
// 1. UI COMPONENTS
// ============================================

const LoadingView = () => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-600 font-medium">
        Loading your payment details...
      </p>
    </motion.div>
  </div>
);

const NotEnrolledView = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
  >
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        You're not enrolled yet
      </h2>
      <p className="text-gray-600 mb-6">
        Hi {user?.name || "Student"}, please complete your enrollment process to
        access payment options.
      </p>
      <button
        onClick={() => navigate("/enrollment")}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
      >
        Go to Enrollment
      </button>
    </div>
  </motion.div>
);

// Step Indicator Component
const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all`}
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
              {index < steps.length - 1 && (
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
};

// Enhanced Payment Periods Card - Shows all periods
const PaymentPeriodsCard = ({ payments, onSelectPeriod, selectedPeriod }) => {
  const periods = [
    { id: "enrollment", label: "Enrollment", order: 1 },
    { id: "prelim", label: "Prelim", order: 2 },
    { id: "mid-term", label: "Mid-Term", order: 3 },
    { id: "pre-final", label: "Pre-Final", order: 4 },
    { id: "final", label: "Final", order: 5 },
  ];

  const getPeriodData = (periodId) => {
    const payment = payments?.find((p) => p.period === periodId);
    if (!payment) return null;

    return {
      status: payment.payment_status,
      paid: parseFloat(payment.paid_amount || 0),
      due: parseFloat(payment.payment_per_period || 0),
      balance: parseFloat(payment.balance || 0),
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return "✅";
      case "review":
        return "⏳";
      default:
        return "⚠️";
    }
  };

  // Find the first unpaid period
  const firstUnpaidPeriod = periods.find((period) => {
    const data = getPeriodData(period.id);
    return data && data.balance > 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Schedule</h2>
      <p className="text-sm text-gray-600 mb-4">
        {firstUnpaidPeriod
          ? `📌 Current payment needed: ${firstUnpaidPeriod.label}`
          : "✅ All payments are complete!"}
      </p>

      <div className="space-y-3">
        {periods.map((period) => {
          const data = getPeriodData(period.id);
          if (!data) return null;

          const isSelected = selectedPeriod?.period === period.id;
          const isUnpaid = data.balance > 0;
          const isPaid = data.status === "paid";
          const isReview = data.status === "review";

          return (
            <motion.button
              key={period.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                isUnpaid && onSelectPeriod({ period: period.id, ...data })
              }
              disabled={!isUnpaid}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : isUnpaid
                    ? "border-red-200 bg-white hover:border-red-400 cursor-pointer"
                    : "border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{period.order}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {period.label}
                    </h3>
                    {isReview && (
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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}
                  >
                    <span className="mr-1">{getStatusIcon(data.status)}</span>
                    {data.status === "review"
                      ? "Under Review"
                      : data.status === "paid"
                        ? "Paid"
                        : "Pending"}
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
    </motion.div>
  );
};

// Payment Method Selector
const PaymentMethodSelector = ({ selectedMethod, onSelect, disabled }) => {
  const methods = [
    {
      id: "maya",
      label: "Maya",
      icon: "💳",
      color: "from-blue-500 to-blue-700",
    },
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

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Select Payment Method
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => !disabled && onSelect(method.id)}
            disabled={disabled}
            className={`relative p-4 rounded-xl transition-all ${
              selectedMethod === method.id
                ? `bg-gradient-to-r ${method.color} text-white shadow-lg`
                : "bg-white border-2 border-gray-200 hover:border-blue-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
};

// QR Display Component
const QRDisplay = ({ method }) => {
  const qrComponents = {
    maya: () => (
      <div className="bg-linear-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white text-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-600">Maya QR Code</span>
          </div>
        </div>
        <p className="text-sm">Scan with Maya app to pay</p>
      </div>
    ),
    gcash: () => (
      <div className="bg-linear-to-br from-blue-400 to-blue-600 p-6 rounded-xl text-white text-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-600">GCash QR Code</span>
          </div>
        </div>
        <p className="text-sm">Scan with GCash app to pay</p>
      </div>
    ),
    "bank-transfer": () => (
      <div className="bg-linear-to-br from-green-500 to-green-700 p-6 rounded-xl text-white text-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-600">Instapay QR Code</span>
          </div>
        </div>
        <p className="text-sm">Scan with your banking app</p>
      </div>
    ),
  };

  const QRComponent = qrComponents[method];
  return QRComponent ? <QRComponent /> : null;
};

// Promise Note Form
const PromiseNoteForm = ({ onSubmit, onCancel, amount }) => {
  const [promiseDate, setPromiseDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ promiseDate, notes });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6"
    >
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
            onChange={(e) => setPromiseDate(e.target.value)}
            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="3"
            placeholder="Add any additional notes or conditions..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Submit Promise
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Payment Form Component
const PaymentForm = ({ selectedPeriod, onSubmit, onCancel, isSubmitting }) => {
  const [amount, setAmount] = useState(selectedPeriod?.balance || 0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (allowedTypes.includes(uploadedFile.type)) {
        setFile(uploadedFile);
      } else {
        alert("Please upload only PNG, JPG, or PDF files");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      referenceNumber,
      remarks,
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
      className="space-y-6"
    >
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Paying for:{" "}
          <strong className="capitalize">{selectedPeriod?.period}</strong>
        </p>
        <p className="text-sm text-blue-800 mt-1">
          Amount Due: ₱
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Pay *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">₱</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount"
            max={selectedPeriod?.balance}
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Maximum amount: ₱{selectedPeriod?.balance.toLocaleString()}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference Number *
        </label>
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter reference number from your payment"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Proof *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
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
                  type="file"
                  className="sr-only"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
        {file && (
          <p className="mt-2 text-sm text-green-600">
            ✓ {file.name} uploaded successfully
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remarks (Optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !amount || !referenceNumber || !file}
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
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
};

// ============================================
// 2. MAIN COMPONENT
// ============================================

const StudentPaymentStatus = () => {
  const { user } = useAuth();
  const { getAuthHeaders } = useStudent();
  const navigate = useNavigate();

  // State Management
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    enrollment: null,
    payments: [], // Changed from single payment to array
    selectedPeriod: null,
    currentStep: 0,
    selectedMethod: null,
    showPromiseForm: false,
    isSubmitting: false,
    submitStatus: null,
  });

  const steps = [
    { id: "periods", label: "Select Period" },
    { id: "method", label: "Payment Method" },
    { id: "submit", label: "Submit Payment" },
  ];

  // Helper to update state
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      updateState({ isLoading: true, error: null });

      try {
        // Step 1: Check enrollment
        const enrollmentRes = await axios.get(
          `http://localhost:3000/student/validate-enrolled-student/${user.id}`,
          getAuthHeaders(),
        );

        if (!enrollmentRes.data.success) {
          updateState({ isLoading: false, enrollment: null });
          return;
        }

        const enrollment = enrollmentRes.data.data;
        updateState({ enrollment });

        // Step 2: Fetch ALL payments for this enrollment
        if (enrollment?.enrollment_id) {
          // You'll need to create an endpoint to get all periods
          // For now, let's simulate with the data you have
          const allPayments = [
            {
              period: "enrollment",
              payment_status: "review",
              paid_amount: 5000,
              balance: 1000,
              payment_per_period: 5000,
            },
            {
              period: "prelim",
              payment_status: "pending",
              paid_amount: 0,
              balance: 1000,
              payment_per_period: 5000,
            },
            {
              period: "mid-term",
              payment_status: "review",
              paid_amount: 0,
              balance: 1000,
              payment_per_period: 5000,
            },
            {
              period: "pre-final",
              payment_status: "pending",
              paid_amount: 0,
              balance: 0,
              payment_per_period: 0,
            },
            {
              period: "final",
              payment_status: "review",
              paid_amount: 0,
              balance: 0,
              payment_per_period: 0,
            },
          ];

          updateState({ payments: allPayments });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        updateState({
          error: "Failed to load payment data. Please try again.",
        });
      } finally {
        updateState({ isLoading: false });
      }
    };

    fetchData();
  }, [user, getAuthHeaders]);

  // Handle Payment Submission
  const handlePaymentSubmit = async (paymentData) => {
    updateState({ isSubmitting: true, submitStatus: null });

    try {
      const formData = new FormData();
      const { amount, referenceNumber, remarks, file, period } = paymentData;

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
          period: period,
          paymentType: "tuition",
          amount: amount,
          referenceNumber: referenceNumber,
          remarks: remarks,
          paymentMethod: state.selectedMethod,
          remainingBalance: state.selectedPeriod?.balance - amount,
        }),
      );

      if (file) {
        formData.append("proofOfPayment", file);
      }

      formData.append("promiseNote", JSON.stringify({ promiseStatus: false }));
      formData.append(
        "metadata",
        JSON.stringify({ userAgent: navigator.userAgent, platform: "web" }),
      );
      formData.append("timestamp", new Date().toISOString());

      const response = await axios.post(
        "http://localhost:3000/student/enrollment-payment-upload-process",
        formData,
        getAuthHeaders(),
      );

      if (response.data?.success) {
        updateState({
          submitStatus: {
            type: "success",
            message: response.data.message || "Payment submitted successfully!",
          },
          currentStep: 0,
          selectedPeriod: null,
          selectedMethod: null,
          showPromiseForm: false,
        });

        // Refresh payments data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Payment failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      updateState({
        submitStatus: {
          type: "error",
          message:
            error.response?.data?.message ||
            "Failed to process payment. Please try again.",
        },
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  // Handle Promise Note Submission
  const handlePromiseSubmit = async (promiseData) => {
    updateState({ isSubmitting: true });

    try {
      const submitData = {
        period: state.selectedPeriod.period,
        amount: state.selectedPeriod.balance,
        referenceNumber: "PROMISE-NOTE-" + Date.now(),
        remarks: promiseData.notes,
        file: null,
        promiseData: promiseData,
      };

      await handlePaymentSubmit(submitData);
    } finally {
      updateState({ isSubmitting: false, showPromiseForm: false });
    }
  };

  // Render Logic
  if (state.isLoading) return <LoadingView />;
  if (state.error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!state.enrollment) return <NotEnrolledView user={user} />;

  // Main Payment Flow
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Step Indicator */}
        <StepIndicator currentStep={state.currentStep} steps={steps} />

        {/* Step 0: Select Period */}
        {state.currentStep === 0 && (
          <PaymentPeriodsCard
            payments={state.payments}
            onSelectPeriod={(period) => {
              updateState({ selectedPeriod: period, currentStep: 1 });
            }}
            selectedPeriod={state.selectedPeriod}
          />
        )}

        {/* Step 1: Payment Method Selection */}
        {state.currentStep === 1 && state.selectedPeriod && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <button
              onClick={() =>
                updateState({ currentStep: 0, selectedPeriod: null })
              }
              className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              ← Back to periods
            </button>

            <PaymentMethodSelector
              selectedMethod={state.selectedMethod}
              onSelect={(method) => {
                updateState({
                  selectedMethod: method,
                  showPromiseForm: method === "promised-note",
                });
                if (method !== "promised-note") {
                  updateState({ currentStep: 2 });
                }
              }}
              disabled={state.isSubmitting}
            />

            {state.showPromiseForm && (
              <div className="mt-6">
                <PromiseNoteForm
                  onSubmit={handlePromiseSubmit}
                  onCancel={() =>
                    updateState({
                      selectedMethod: null,
                      showPromiseForm: false,
                    })
                  }
                  amount={state.selectedPeriod.balance}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: QR Display */}
        {state.currentStep === 2 &&
          state.selectedMethod &&
          !state.showPromiseForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <button
                onClick={() =>
                  updateState({ currentStep: 1, selectedMethod: null })
                }
                className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                ← Back to payment methods
              </button>

              <QRDisplay method={state.selectedMethod} />
              <button
                onClick={() => updateState({ currentStep: 3 })}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
              >
                Continue to Payment Form
              </button>
            </motion.div>
          )}

        {/* Step 3: Payment Form */}
        {state.currentStep === 3 &&
          state.selectedMethod &&
          !state.showPromiseForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <button
                onClick={() => updateState({ currentStep: 2 })}
                className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                ← Back to QR code
              </button>

              <PaymentForm
                selectedPeriod={state.selectedPeriod}
                onSubmit={handlePaymentSubmit}
                onCancel={() =>
                  updateState({ currentStep: 1, selectedMethod: null })
                }
                isSubmitting={state.isSubmitting}
              />
            </motion.div>
          )}

        {/* Status Message */}
        <AnimatePresence>
          {state.submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 p-4 rounded-lg ${
                state.submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {state.submitStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentPaymentStatus;
