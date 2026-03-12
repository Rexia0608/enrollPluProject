import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "../../pages/LoadingPage";

// Mock QR Code components (in real app, you'd use actual QR code images)
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

const PaymentComponent = ({ userData }) => {
  // Mock API response - simulating data from backend
  const mockApiResponse = {
    user_id: "08593912-2cb3-49d0-8ac8-ec37da4d5064",
    enrollment_year_code: "d0406ab2-3588-4aa9-a4d8-33b9de410fb1",
    enrollment_id: "AGJORF", // AGJORF || Change to null/empty to test enrollment validation
    current_payment_period: "mid-term" || "enrollment",
    allowed_payment_periods: ["mid-term"], // ["enrollment", "prelim", "mid-term", "pre-final", "final", "summer"]
  };

  // Loading state for API simulation
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);

  // Mock user data (in real app, this would come from props/context)
  const mockUser = {
    id: userData?.id || "12345",
    name: userData?.name || "John Doe",
    email: userData?.email || "john.doe@example.com",
    isUserEnrolled: userData?.isUserEnrolled || true,
    isUserActiveEnrolled_id:
      userData?.isUserActiveEnrolled_id || "ENROLL-2024-001",
    payment_type: userData?.payment_type || "tuition",
  };

  // Payment periods
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
  const [paymentData, setPaymentData] = useState({
    enrollment: { tuition: 15000, paid: 0, remaining: 15000 },
    prelim: { tuition: 15000, paid: 5000, remaining: 10000 },
    "mid-term": { tuition: 15000, paid: 3000, remaining: 12000 },
    "pre-final": { tuition: 15000, paid: 2000, remaining: 13000 },
    final: { tuition: 15000, paid: 0, remaining: 15000 },
    summer: { tuition: 8000, paid: 0, remaining: 8000 },
  });

  // Simulate API call on component mount
  useEffect(() => {
    const fetchPaymentData = async () => {
      setIsLoading(true);

      // Simulate API request with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be:
      // import { useAuth } from "../../context/AuthContext";
      // import { useStudent } from "../../context/StudentContext";
      // const { getAuthHeaders } = useStudent();
      // const { user } = useAuth();
      // const response = await axios.get(
      //   `http://localhost:3000/student/my-transaction-payment/${user.id}`,
      //   getAuthHeaders()
      // );

      setApiData(mockApiResponse);

      // Set current payment period from API
      if (mockApiResponse.current_payment_period) {
        setSelectedPeriod(mockApiResponse.current_payment_period);
      }

      setIsLoading(false);
    };

    fetchPaymentData();
  }, []);

  // Check if user is enrolled
  const isEnrolled =
    apiData?.enrollment_id &&
    apiData.enrollment_id !== null &&
    apiData.enrollment_id !== undefined &&
    apiData.enrollment_id !== "";

  // Check if period is allowed
  const isPeriodAllowed = (periodId) => {
    if (!apiData?.allowed_payment_periods) return false;
    return apiData.allowed_payment_periods.includes(periodId);
  };

  // Check if payment should be visible
  const shouldShowPayment =
    isEnrolled &&
    apiData?.current_payment_period &&
    isPeriodAllowed(selectedPeriod);

  // Check if there are any allowed periods
  const hasAllowedPeriods = apiData?.allowed_payment_periods?.length > 0;

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

  // Get current period data
  const currentPeriodData = paymentData[selectedPeriod] || paymentData.prelim;

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
    if (!shouldShowPayment) return; // Prevent selection if payment not allowed

    setPaymentMethod(methodId);
    setShowPromisedNote(methodId === "promised-note");
    if (methodId !== "promised-note") {
      setShowPromisedNote(false);
    }
  };

  // Handle payment form changes
  const handlePaymentFormChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle promised note submission
  const handlePromisedNoteSubmit = async (promiseData) => {
    const submitData = {
      user: mockUser,
      period: selectedPeriod,
      paymentMethod: "promised-note",
      promiseDate: promiseData.promiseDate,
      notes: promiseData.notes,
      timestamp: new Date().toISOString(),
      amount: currentPeriodData.remaining,
    };

    await submitPayment(submitData);
  };

  // Submit payment
  const submitPayment = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare the data for POST request
      const paymentPayload = {
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          isEnrolled: mockUser.isUserEnrolled,
          activeEnrollmentId: mockUser.isUserActiveEnrolled_id,
        },
        paymentDetails: {
          period: selectedPeriod,
          paymentType: mockUser.payment_type,
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
              // In real app, you'd upload the actual file to server
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

      // Simulate API call
      console.log("Sending POST request to payment endpoint:", paymentPayload);

      // Mock API call - replace with actual fetch
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            status: 200,
            data: {
              message: "Payment processed successfully",
              transactionId: "TRX-" + Math.random().toString(36).substr(2, 9),
              ...paymentPayload,
            },
          });
        }, 1500);
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Payment submitted successfully! Transaction ID: " +
            response.data.transactionId,
        });

        // Reset form
        setPaymentDetails({ amount: "", referenceNumber: "", remarks: "" });
        setUploadedFile(null);
        setPaymentMethod(null);
        setShowPromisedNote(false);
      }
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

  // Enrollment validation - Show "Not yet enrolled" if enrollment_id is invalid
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {mockUser.name} | Enrollment ID:{" "}
            {apiData?.enrollment_id}
          </p>
        </div>

        {/* Payment Details Card */}
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

          {/* Payment Summary Table */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tuition Fee</p>
                <p className="text-xl font-bold text-gray-900">
                  ₱{currentPeriodData.tuition.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₱{currentPeriodData.paid.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining Balance</p>
                <p className="text-xl font-bold text-red-600">
                  ₱{currentPeriodData.remaining.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* No Payment Required Message */}
        {!hasAllowedPeriods && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8"
          >
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No payment required at this time.
            </h2>
            <p className="text-gray-600">All your payments are up to date.</p>
          </motion.div>
        )}

        {/* Payment Method Selection - Only show if payment should be visible */}
        {hasAllowedPeriods && (
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
                  disabled={!shouldShowPayment}
                  className={`p-4 rounded-xl border-2 transition-all text-center
                    ${!shouldShowPayment ? "opacity-50 cursor-not-allowed" : ""}
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
                shouldShowPayment && (
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
              {showPromisedNote && shouldShowPayment && (
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
        )}

        {/* Payment Form - Only show if payment should be visible */}
        {paymentMethod && !showPromisedNote && shouldShowPayment && (
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
                  Max amount: ₱{currentPeriodData.remaining.toLocaleString()}
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
          <p>API Response:</p>
          <pre className="mt-1">{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
