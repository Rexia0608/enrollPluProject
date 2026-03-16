import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "../../pages/LoadingPage";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import axios from "axios";

// QR Code Components (unchanged)
const MayaQR = () => (
  <div className="bg-linear-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white text-center">
    <div className="bg-white p-4 rounded-lg mb-4">
      <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">Maya QR Code</span>
      </div>
    </div>
    <p className="text-sm">Scan with Maya app to pay</p>
  </div>
);

const GCashQR = () => (
  <div className="bg-linear-to-br from-blue-400 to-blue-600 p-6 rounded-xl text-white text-center">
    <div className="bg-white p-4 rounded-lg mb-4">
      <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">GCash QR Code</span>
      </div>
    </div>
    <p className="text-sm">Scan with GCash app to pay</p>
  </div>
);

const InstapayQR = () => (
  <div className="bg-linear-to-br from-green-500 to-green-700 p-6 rounded-xl text-white text-center">
    <div className="bg-white p-4 rounded-lg mb-4">
      <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">Instapay QR Code</span>
      </div>
    </div>
    <p className="text-sm">Scan with your banking app</p>
  </div>
);

// Promised Note Component (unchanged)
const PromisedNote = ({ onSubmit }) => {
  const [promiseDate, setPromiseDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ promiseDate, notes });
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        Promise to Pay Note
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Promise Date
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
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Submit Promise Note
        </button>
      </form>
    </div>
  );
};

// Main Payment Component
const PaymentComponent = ({ userData }) => {
  const { getAuthHeaders } = useStudent();
  const { user } = useAuth();

  // States for API data
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [apiError, setApiError] = useState(null);

  // User info derived from API
  const userId = user?.id || "";
  const userName = user?.name || "Student";
  const userEmail = user?.email || "";

  // Payment periods (static, but dynamically enabled/disabled)
  const periods = [
    { id: "enrollment", label: "Enrollment", dueDate: "2024-03-15" },
    { id: "prelim", label: "Prelim", dueDate: "2024-03-15" },
    { id: "mid-term", label: "Mid-Term", dueDate: "2024-05-15" },
    { id: "pre-final", label: "Pre-Final", dueDate: "2024-07-15" },
    { id: "final", label: "Final", dueDate: "2024-09-15" },
    { id: "summer", label: "Summer", dueDate: "2024-11-15" },
  ];

  // State management
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].id);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPromisedNote, setShowPromisedNote] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    referenceNumber: "",
    remarks: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [paymentData, setPaymentData] = useState({}); // populated from API

  // Derived values from API
  const isEnrolled = enrollmentData?.enrollment_id != null;
  const enrollmentId = enrollmentData?.enrollment_id;
  const currentPeriod = currentPayment?.period;

  // Build allowed periods based on current payment period
  const allowedPeriods = currentPeriod ? [currentPeriod] : [];

  // Check if a period is allowed
  const isPeriodAllowed = (periodId) => allowedPeriods.includes(periodId);

  // Update selected period when currentPeriod changes
  useEffect(() => {
    if (currentPeriod && isPeriodAllowed(currentPeriod)) {
      setSelectedPeriod(currentPeriod);
    }
  }, [currentPeriod]);

  // Update paymentData when currentPayment changes – includes payment_per_period
  useEffect(() => {
    if (currentPayment) {
      const paid = parseFloat(currentPayment.paid || 0);
      const balance = parseFloat(currentPayment.balance || 0);
      const tuition = paid + balance;
      const paymentPerPeriod = parseFloat(
        currentPayment.payment_per_period || 0,
      );
      setPaymentData({
        [currentPayment.period]: {
          tuition,
          paid,
          remaining: balance,
          payment_per_period: paymentPerPeriod,
        },
      });
    }
  }, [currentPayment]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        // 1. Validate enrolled student
        const validateRes = await axios.get(
          `http://localhost:3000/student/validate-enrolled-student/${user.id}`,
          getAuthHeaders(),
        );

        if (validateRes.data.success && validateRes.data.data) {
          setEnrollmentData(validateRes.data.data);

          // 2. Fetch current payment using enrollment_id
          const paymentRes = await axios.get(
            `http://localhost:3000/student/validat-current-payment/${validateRes.data.data.enrollment_id}`,
            getAuthHeaders(),
          );

          if (paymentRes.data.success && paymentRes.data.data) {
            setCurrentPayment(paymentRes.data.data);
          } else {
            // No current payment (all paid or not yet assessed)
            setCurrentPayment(null);
          }
        } else {
          // Not enrolled
          setEnrollmentData(null);
          setCurrentPayment(null);
        }
      } catch (error) {
        console.error("API fetch error:", error);
        setApiError("Failed to load payment data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user, getAuthHeaders]);

  // Payment methods
  const paymentMethods = [
    { id: "maya", label: "Maya", icon: "💳", component: MayaQR },
    { id: "gcash", label: "GCash", icon: "📱", component: GCashQR },
    {
      id: "bank-transfer",
      label: "Bank Transfer (Instapay)",
      icon: "🏦",
      component: InstapayQR,
    },
    {
      id: "promised-note",
      label: "Promise to Pay",
      icon: "📝",
      component: null,
    },
  ];

  // Get current period data (default to zeros if not available)
  const currentPeriodData = paymentData[selectedPeriod] || {
    tuition: 0,
    paid: 0,
    remaining: 0,
    payment_per_period: 0,
  };

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert("Please upload only PNG or JPG images");
      }
    }
  }, []);

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId) => {
    if (!isEnrolled || !currentPeriod) return;
    setPaymentMethod(methodId);
    setShowPromisedNote(methodId === "promised-note");
    if (methodId !== "promised-note") {
      setShowPromisedNote(false);
    }
  };

  // Handle payment form changes
  const handlePaymentFormChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Handle promised note submission
  const handlePromisedNoteSubmit = async (promiseData) => {
    const submitData = {
      user: { id: userId, name: userName, email: userEmail },
      period: selectedPeriod,
      paymentMethod: "promised-note",
      promiseDate: promiseData.promiseDate,
      notes: promiseData.notes,
      timestamp: new Date().toISOString(),
      amount: currentPeriodData.remaining,
    };
    await submitPayment(submitData);
  };

  // Submit payment (placeholder)
  const submitPayment = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const paymentPayload = {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
          isEnrolled: isEnrolled,
          activeEnrollmentId: enrollmentId,
        },
        paymentDetails: {
          period: selectedPeriod,
          paymentType: "tuition",
          amount: data.amount || paymentDetails.amount,
          referenceNumber: paymentDetails.referenceNumber,
          remarks: paymentDetails.remarks,
          paymentMethod: paymentMethod,
          remainingBalance:
            currentPeriodData.remaining -
            (data.amount || paymentDetails.amount),
        },
        proofOfPayment: uploadedFile
          ? {
              fileName: uploadedFile.name,
              fileType: uploadedFile.type,
              fileSize: uploadedFile.size,
            }
          : null,
        promiseNote: data.promiseDate
          ? {
              promiseDate: data.promiseDate,
              notes: data.notes,
            }
          : null,
        timestamp: new Date().toISOString(),
        metadata: {
          userAgent: navigator.userAgent,
          platform: "web",
        },
      };

      console.log("Sending payment payload:", paymentPayload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: "success",
        message: "Payment submitted successfully! (Placeholder)",
      });

      // Reset form
      setPaymentDetails({ amount: "", referenceNumber: "", remarks: "" });
      setUploadedFile(null);
      setPaymentMethod(null);
      setShowPromisedNote(false);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to process payment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitPayment({ amount: paymentDetails.amount });
  };

  // Get QR component based on selected method
  const getQRComponent = () => {
    const method = paymentMethods.find((m) => m.id === paymentMethod);
    return method?.component || null;
  };
  const QRComponent = getQRComponent();

  // Loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Error state
  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{apiError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Not enrolled
  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Not yet enrolled
            </h2>
            <p className="text-gray-600">
              Please complete your enrollment process to access payment options.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No current payment (all paid)
  if (!currentPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No payment required
            </h2>
            <p className="text-gray-600">
              All payments are up to date for this enrollment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {userName} | Enrollment ID: {enrollmentId}
          </p>
        </div>

        {/* Payment Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Summary
          </h2>

          {/* Period Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Period
            </label>
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => {
                const allowed = isPeriodAllowed(period.id);
                return (
                  <button
                    key={period.id}
                    onClick={() => allowed && setSelectedPeriod(period.id)}
                    disabled={!allowed}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedPeriod === period.id
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : allowed
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                  >
                    {period.label}
                    <span className="block text-xs mt-1">
                      Due: {new Date(period.dueDate).toLocaleDateString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Summary Table – shows actual values from API, now includes payment_per_period */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tuition Fee</p>
                <p className="text-xl font-bold text-gray-900">
                  ₱
                  {currentPeriodData.tuition.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Period Due</p>
                <p className="text-xl font-bold text-green-600">
                  ₱
                  {currentPeriodData.payment_per_period.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₱
                  {currentPeriodData.paid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining Balance</p>
                <p className="text-xl font-bold text-red-600">
                  ₱
                  {currentPeriodData.remaining.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Payment Method
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                disabled={!currentPeriod}
                className={`p-4 rounded-xl border-2 transition-all text-center
                  ${!currentPeriod ? "opacity-50 cursor-not-allowed" : ""}
                  ${
                    paymentMethod === method.id
                      ? "border-blue-600 bg-blue-50 scale-105 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
              >
                <span className="text-3xl mb-2 block">{method.icon}</span>
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>

          {/* QR Code Display */}
          <AnimatePresence mode="wait">
            {paymentMethod &&
              !showPromisedNote &&
              QRComponent &&
              currentPeriod && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <QRComponent />
                </motion.div>
              )}
          </AnimatePresence>

          {/* Promised Note Section */}
          <AnimatePresence>
            {showPromisedNote && currentPeriod && (
              <motion.div
                key="promised-note"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <PromisedNote onSubmit={handlePromisedNoteSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Payment Form (only if payment method selected and not promised note) */}
        {paymentMethod && !showPromisedNote && currentPeriod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Complete Payment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Pay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentDetails.amount}
                    onChange={(e) =>
                      handlePaymentFormChange("amount", e.target.value)
                    }
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    max={currentPeriodData.remaining}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Max amount: ₱
                  {currentPeriodData.remaining.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.referenceNumber}
                  onChange={(e) =>
                    handlePaymentFormChange("referenceNumber", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reference number"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Proof
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
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
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
                {uploadedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {uploadedFile.name} uploaded successfully
                  </p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={paymentDetails.remarks}
                  onChange={(e) =>
                    handlePaymentFormChange("remarks", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !uploadedFile ||
                  !paymentDetails.amount ||
                  !paymentDetails.referenceNumber
                }
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                  ${
                    isSubmitting ||
                    !uploadedFile ||
                    !paymentDetails.amount ||
                    !paymentDetails.referenceNumber
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Payment"
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {submitStatus.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Data Debug (can be removed in production) */}
        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Enrollment API:</p>
          <pre className="mt-1">{JSON.stringify(enrollmentData, null, 2)}</pre>
          <p className="mt-2">Payment API:</p>
          <pre className="mt-1">{JSON.stringify(currentPayment, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
