// components/student/StudentPaymentStatus.jsx
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Wallet,
  ChevronRight,
  Ban,
  Upload,
  Image,
  X,
  Smartphone,
  Landmark,
  QrCode,
  BookOpen,
  GraduationCap,
  Sun,
  BookMarked,
} from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import PrimaryButton from "../ui/PrimaryButton";

function StudentPaymentStatus() {
  // Mock payment data for different payment types
  const mockPaymentData = {
    studentId: "STU-10231",
    semester: "1st Semester 2026",
    payments: [
      {
        id: "enrollment",
        name: "Enrollment",
        amount: 5000,
        dueDate: "2026-02-15",
        status: "paid", // paid, pending, partial, overdue
        icon: BookOpen,
        color: "blue",
      },
      {
        id: "prelim",
        name: "Prelim",
        amount: 3000,
        dueDate: "2026-03-15",
        status: "pending",
        icon: BookMarked,
        color: "purple",
      },
      {
        id: "midterm",
        name: "Midterm",
        amount: 3000,
        dueDate: "2026-04-15",
        status: "pending",
        icon: BookMarked,
        color: "indigo",
      },
      {
        id: "prefinal",
        name: "Pre-Final",
        amount: 3000,
        dueDate: "2026-05-15",
        status: "pending",
        icon: BookMarked,
        color: "orange",
      },
      {
        id: "final",
        name: "Final",
        amount: 3000,
        dueDate: "2026-06-15",
        status: "pending",
        icon: GraduationCap,
        color: "green",
      },
      {
        id: "summer",
        name: "Summer",
        amount: 2500,
        dueDate: "2026-07-15",
        status: "not_available",
        icon: Sun,
        color: "yellow",
      },
      {
        id: "shortcourses",
        name: "Testda/Short-Courses",
        amount: 2000,
        dueDate: "2026-08-15",
        status: "not_available",
        icon: BookMarked,
        color: "red",
      },
    ],
    totalPaid: 5000,
    totalBalance: 17500, // Total of all pending amounts
    paymentStart: "2026-03-01",
    paymentEnd: "2026-03-20",
  };

  // Payment options for methods
  const paymentOptions = [
    {
      id: "maya",
      name: "Maya",
      icon: Smartphone,
      accountNumber: "09123456789",
      accountName: "School Name - Enrollment",
      qrCode: "/maya-qr.png",
    },
    {
      id: "gcash",
      name: "GCash",
      icon: Smartphone,
      accountNumber: "09187654321",
      accountName: "School Name - Enrollment",
      qrCode: "/gcash-qr.png",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Landmark,
      accountNumber: "1234-5678-9012-3456",
      accountName: "School Name, Inc.",
      bankName: "Philippine National Bank",
    },
  ];

  const [paymentData, setPaymentData] = useState(mockPaymentData);
  const [loading, setLoading] = useState(false);
  const [paymentStage, setPaymentStage] = useState("payment_not_started");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showQrCode, setShowQrCode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  // Define payment roadmap stages
  const paymentStages = [
    {
      id: 1,
      key: "payment_not_started",
      label: "Not Started",
      description: "Payment period not yet open",
      icon: Clock,
      color: "gray",
    },
    {
      id: 2,
      key: "payment_open",
      label: "Payment Open",
      description: "Make your payment now",
      icon: CreditCard,
      color: "blue",
    },
    {
      id: 3,
      key: "payment_processing",
      label: "Processing",
      description: "Payment is being validated",
      icon: Clock,
      color: "yellow",
    },
    {
      id: 4,
      key: "payment_validated",
      label: "Validated",
      description: "Payment has been validated",
      icon: CheckCircle,
      color: "green",
    },
  ];

  // Calculate totals
  const calculateTotals = () => {
    const totalAmount = paymentData.payments.reduce(
      (sum, p) => sum + p.amount,
      0,
    );
    const totalPaid = paymentData.payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = paymentData.payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = paymentData.payments
      .filter((p) => p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalAmount, totalPaid, totalPending, totalOverdue };
  };

  const totals = calculateTotals();

  // Determine payment period status
  const getPaymentPeriodStatus = () => {
    const now = new Date();
    const paymentStart = new Date(paymentData.paymentStart);
    const paymentEnd = new Date(paymentData.paymentEnd);

    if (now < paymentStart) {
      const daysUntil = Math.ceil((paymentStart - now) / (1000 * 60 * 60 * 24));
      return {
        status: "upcoming",
        message: `Payment opens in ${daysUntil} days`,
        color: "blue",
        icon: Clock,
      };
    } else if (now > paymentEnd) {
      return {
        status: "closed",
        message: "Payment period has ended",
        color: "gray",
        icon: Ban,
      };
    } else {
      const daysLeft = Math.ceil((paymentEnd - now) / (1000 * 60 * 60 * 24));
      return {
        status: "open",
        message: `Payment period open - ${daysLeft} days left`,
        color: "green",
        icon: CheckCircle,
      };
    }
  };

  // Determine current payment stage
  const determinePaymentStage = () => {
    const periodStatus = getPaymentPeriodStatus();
    const hasPendingPayments = paymentData.payments.some(
      (p) => p.status === "pending",
    );

    if (!hasPendingPayments) {
      return "payment_validated";
    }

    if (periodStatus.status === "open" && hasPendingPayments) {
      return "payment_open";
    }

    return "payment_not_started";
  };

  // Update payment stage when data changes
  useEffect(() => {
    setPaymentStage(determinePaymentStage());
  }, [paymentData]);

  // Check if a stage is completed
  const isStageCompleted = (stageKey) => {
    const stageOrder = {
      payment_not_started: 1,
      payment_open: 2,
      payment_processing: 3,
      payment_validated: 4,
    };

    const currentStageNumber = stageOrder[paymentStage] || 1;
    const stageNumber = stageOrder[stageKey] || 1;

    return stageNumber < currentStageNumber;
  };

  // Check if a stage is current
  const isStageCurrent = (stageKey) => {
    return stageKey === paymentStage;
  };

  // Handle payment selection
  const handlePaymentSelection = (paymentId) => {
    setSelectedPayments((prev) => {
      if (prev.includes(paymentId)) {
        return prev.filter((id) => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  };

  // Handle select all pending payments
  const handleSelectAllPending = () => {
    const pendingIds = paymentData.payments
      .filter((p) => p.status === "pending")
      .map((p) => p.id);
    setSelectedPayments(pendingIds);
  };

  // Update total amount when selections change
  useEffect(() => {
    const total = paymentData.payments
      .filter((p) => selectedPayments.includes(p.id))
      .reduce((sum, p) => sum + p.amount, 0);
    setPaymentAmount(total);
  }, [selectedPayments, paymentData.payments]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setPaymentProof(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
    setUploadProgress(0);
  };

  // Handle payment submission
  const handleSubmitPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (selectedPayments.length === 0) {
      alert("Please select at least one payment item");
      return;
    }

    if (!paymentProof) {
      alert("Please upload proof of payment");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setPaymentData((prev) => ({
        ...prev,
        payments: prev.payments.map((p) =>
          selectedPayments.includes(p.id) ? { ...p, status: "processing" } : p,
        ),
      }));

      // Reset modal
      setShowPaymentModal(false);
      setSelectedPaymentMethod(null);
      setSelectedPayments([]);
      setPaymentAmount(0);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      setUploadProgress(0);
      setShowQrCode(false);
      setLoading(false);

      alert(
        "Payment submitted successfully! Your payment is now being validated.",
      );
    }, 2000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Check if payment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const paymentPeriod = getPaymentPeriodStatus();
  const PeriodIcon = paymentPeriod.icon;
  const isPaymentOpen = paymentPeriod.status === "open";
  const hasPendingPayments = paymentData.payments.some(
    (p) => p.status === "pending",
  );
  const allPaid = !hasPendingPayments;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
        <p className="text-gray-600">View and manage your payment schedules</p>
      </div>

      {/* Main Payment Card */}
      <Card className="p-6">
        {/* Student Info */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {paymentData.semester}
                </h3>
                <p className="text-sm text-gray-600">
                  Student ID: {paymentData.studentId}
                </p>
              </div>
            </div>
            <StatusBadge
              status={allPaid ? "paid" : "pending"}
              className={
                allPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            />
          </div>
        </div>

        {/* Payment Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Total Fees</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₱{totals.totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Paid</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₱{totals.totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              ₱{totals.totalPending.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₱{paymentData.totalBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Period Status */}
        <div className="mb-6">
          <div
            className={`p-4 rounded-lg border ${
              paymentPeriod.status === "open"
                ? "border-green-200 bg-green-50"
                : paymentPeriod.status === "upcoming"
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PeriodIcon
                  className={`w-5 h-5 ${
                    paymentPeriod.status === "open"
                      ? "text-green-600"
                      : paymentPeriod.status === "upcoming"
                        ? "text-blue-600"
                        : "text-gray-600"
                  }`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      paymentPeriod.status === "open"
                        ? "text-green-800"
                        : paymentPeriod.status === "upcoming"
                          ? "text-blue-800"
                          : "text-gray-800"
                    }`}
                  >
                    {paymentPeriod.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(paymentData.paymentStart)} -{" "}
                    {formatDate(paymentData.paymentEnd)}
                  </p>
                </div>
              </div>
              {isPaymentOpen && hasPendingPayments && (
                <PrimaryButton
                  onClick={() => setShowPaymentModal(true)}
                  size="sm"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        {/* Payment Items List */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Payment Schedule
          </h4>

          <div className="space-y-3">
            {paymentData.payments.map((payment) => {
              const Icon = payment.icon;
              const isItemOverdue =
                isOverdue(payment.dueDate) && payment.status === "pending";

              return (
                <div
                  key={payment.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    payment.status === "paid"
                      ? "bg-green-50 border-green-200"
                      : payment.status === "processing"
                        ? "bg-yellow-50 border-yellow-200"
                        : isItemOverdue
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        payment.status === "paid"
                          ? "text-green-600"
                          : payment.status === "processing"
                            ? "text-yellow-600"
                            : isItemOverdue
                              ? "text-red-600"
                              : "text-gray-400"
                      }`}
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {payment.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        Due: {formatDate(payment.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">
                      ₱{payment.amount.toLocaleString()}
                    </span>
                    <StatusBadge
                      status={payment.status}
                      className={
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status === "pending" && isItemOverdue
                              ? "bg-red-100 text-red-800"
                              : payment.status === "not_available"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Roadmap */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            Payment Status Roadmap
          </h4>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {paymentStages.map((stage) => {
                const Icon = stage.icon;
                const isCompleted = isStageCompleted(stage.key);
                const isCurrent = isStageCurrent(stage.key);
                const isPending = !isCompleted && !isCurrent;

                return (
                  <div
                    key={stage.id}
                    className="relative flex items-start group"
                  >
                    <div className="relative z-10 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-100"
                            : isCurrent
                              ? `bg-${stage.color}-100 ring-4 ring-${stage.color}-500/20`
                              : "bg-gray-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              isCurrent
                                ? `text-${stage.color}-600`
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h5
                          className={`font-semibold ${
                            isCompleted
                              ? "text-green-600"
                              : isCurrent
                                ? `text-${stage.color}-600`
                                : "text-gray-400"
                          }`}
                        >
                          {stage.label}
                        </h5>
                        {isCurrent && (
                          <span
                            className={`px-2 py-1 bg-${stage.color}-100 text-${stage.color}-700 text-xs font-medium rounded-full`}
                          >
                            Current Step
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-0.5 ${
                          isPending ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Make a Payment
                </h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod(null);
                    setSelectedPayments([]);
                    setPaymentAmount(0);
                    setPaymentProof(null);
                    setPaymentProofPreview(null);
                    setShowQrCode(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Select Payments to Pay */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Payments to Settle
                  </label>
                  <button
                    onClick={handleSelectAllPending}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select All Pending
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                  {paymentData.payments
                    .filter(
                      (p) =>
                        p.status === "pending" || p.status === "processing",
                    )
                    .map((payment) => {
                      const Icon = payment.icon;
                      return (
                        <label
                          key={payment.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPayments.includes(payment.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() =>
                                handlePaymentSelection(payment.id)
                              }
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <Icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">
                                {payment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Due: {formatDate(payment.dueDate)}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ₱{payment.amount.toLocaleString()}
                          </span>
                        </label>
                      );
                    })}
                </div>

                {/* Total Amount */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₱{paymentAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentOptions.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mb-2 ${
                            selectedPaymentMethod === method.id
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`font-medium ${
                            selectedPaymentMethod === method.id
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {method.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details based on selection */}
              {selectedPaymentMethod && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {
                      paymentOptions.find((m) => m.id === selectedPaymentMethod)
                        ?.name
                    }{" "}
                    Payment Details
                  </h3>

                  <div className="space-y-2">
                    {selectedPaymentMethod === "bank_transfer" ? (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-600">Bank:</span>{" "}
                          <span className="font-medium">
                            {
                              paymentOptions.find(
                                (m) => m.id === "bank_transfer",
                              )?.bankName
                            }
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">Account Number:</span>{" "}
                          <span className="font-medium">
                            {
                              paymentOptions.find(
                                (m) => m.id === "bank_transfer",
                              )?.accountNumber
                            }
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-600">Account Number:</span>{" "}
                          <span className="font-medium">
                            {
                              paymentOptions.find(
                                (m) => m.id === selectedPaymentMethod,
                              )?.accountNumber
                            }
                          </span>
                        </p>
                        <button
                          onClick={() => setShowQrCode(!showQrCode)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center mt-2"
                        >
                          <QrCode className="w-4 h-4 mr-1" />
                          {showQrCode ? "Hide QR Code" : "Show QR Code"}
                        </button>
                      </>
                    )}

                    <p className="text-sm">
                      <span className="text-gray-600">Account Name:</span>{" "}
                      <span className="font-medium">
                        {
                          paymentOptions.find(
                            (m) => m.id === selectedPaymentMethod,
                          )?.accountName
                        }
                      </span>
                    </p>
                  </div>

                  {/* QR Code Display */}
                  {showQrCode && selectedPaymentMethod !== "bank_transfer" && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center rounded-lg">
                        <QrCode className="w-24 h-24 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Scan QR code with your{" "}
                        {
                          paymentOptions.find(
                            (m) => m.id === selectedPaymentMethod,
                          )?.name
                        }{" "}
                        app
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Proof of Payment Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof of Payment
                </label>

                {!paymentProof ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label
                      htmlFor="payment-proof"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-blue-600">
                        Click to upload
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {paymentProofPreview && (
                          <img
                            src={paymentProofPreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {paymentProof.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(paymentProof.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress < 100 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <PrimaryButton
                  onClick={handleSubmitPayment}
                  loading={loading}
                  disabled={
                    !selectedPaymentMethod ||
                    selectedPayments.length === 0 ||
                    !paymentProof
                  }
                  className="flex-1"
                >
                  Submit Payment
                </PrimaryButton>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod(null);
                    setSelectedPayments([]);
                    setPaymentAmount(0);
                    setPaymentProof(null);
                    setPaymentProofPreview(null);
                    setShowQrCode(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Card */}
      <Card className="mt-6 p-4 bg-gray-50">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-700">
              For payment-related questions, please contact the Finance Office
              at
              <span className="font-medium"> finance@school.edu</span> or call
              <span className="font-medium"> (123) 456-7891</span>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StudentPaymentStatus;
