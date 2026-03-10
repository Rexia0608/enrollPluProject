// components/student/StudentPaymentStatus.jsx
import React, { useState } from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Wallet,
  Ban,
  Upload,
  X,
  Smartphone,
  Landmark,
  ChevronRight,
  FileText,
  Download,
  Shield,
  CheckSquare,
  Circle,
  QrCode,
} from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import PrimaryButton from "../ui/PrimaryButton";
import Modal from "../ui/Modal";

function StudentPaymentStatus() {
  // Mock payment data with enhanced details
  const mockPaymentData = {
    studentId: "STU-10231",
    studentName: "Juan Dela Cruz",
    course: "Bachelor of Science in Computer Science",
    yearLevel: "2nd Year",
    semester: "1st Semester 2026",
    paymentItems: [
      {
        name: "Enrollment",
        amount: 5000,
        status: "paid",
        dueDate: "2026-02-15",
        paidDate: "2026-02-10",
        reference: "PAY-001-2026",
      },
      {
        name: "Prelim",
        amount: 3000,
        status: "pending",
        dueDate: "2026-03-15",
        paidDate: null,
        reference: null,
      },
      {
        name: "Midterm",
        amount: 3000,
        status: "pending",
        dueDate: "2026-04-15",
        paidDate: null,
        reference: null,
      },
      {
        name: "Pre-Final",
        amount: 3000,
        status: "pending",
        dueDate: "2026-05-15",
        paidDate: null,
        reference: null,
      },
      {
        name: "Final",
        amount: 3000,
        status: "pending",
        dueDate: "2026-06-15",
        paidDate: null,
        reference: null,
      },
      {
        name: "Summer",
        amount: 2500,
        status: "upcoming",
        dueDate: "2026-07-15",
        paidDate: null,
        reference: null,
      },
      {
        name: "Testda/Short-Courses",
        amount: 2000,
        status: "upcoming",
        dueDate: "2026-08-15",
        paidDate: null,
        reference: null,
      },
    ],
    paymentStart: "2026-03-01",
    paymentEnd: "2026-03-20",
    paymentTerms: "Monthly Installment",
  };

  // Payment methods with details
  const paymentMethods = [
    {
      id: "gcash",
      name: "GCash",
      icon: Smartphone,
      number: "0917 123 4567",
      accountName: "School Name Official",
      color: "blue",
      qrCode: "/gcash-qr.png",
    },
    {
      id: "maya",
      name: "Maya",
      icon: Smartphone,
      number: "0918 765 4321",
      accountName: "School Name Official",
      color: "purple",
      qrCode: "/maya-qr.png",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Landmark,
      bank: "Philippine National Bank",
      number: "1234-5678-9012-3456",
      accountName: "School Name, Inc.",
      color: "green",
    },
  ];

  const [paymentData] = useState(mockPaymentData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showQrCode, setShowQrCode] = useState(false);

  // Calculate totals
  const totals = {
    total: paymentData.paymentItems.reduce((sum, item) => sum + item.amount, 0),
    paid: paymentData.paymentItems
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0),
    pending: paymentData.paymentItems
      .filter((i) => i.status === "pending")
      .reduce((sum, i) => sum + i.amount, 0),
    upcoming: paymentData.paymentItems
      .filter((i) => i.status === "upcoming")
      .reduce((sum, i) => sum + i.amount, 0),
  };

  // Check payment period
  const getPaymentPeriod = () => {
    const now = new Date();
    const start = new Date(paymentData.paymentStart);
    const end = new Date(paymentData.paymentEnd);

    if (now < start) {
      const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      return {
        status: "upcoming",
        message: `Opens in ${daysUntil} days`,
        description: `Starts on ${start.toLocaleDateString()}`,
        color: "blue",
        icon: Clock,
      };
    }
    if (now > end) {
      return {
        status: "closed",
        message: "Payment period ended",
        description: `Closed on ${end.toLocaleDateString()}`,
        color: "gray",
        icon: Ban,
      };
    }
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return {
      status: "open",
      message: `${daysLeft} days left to pay`,
      description: `Until ${end.toLocaleDateString()}`,
      color: "green",
      icon: CheckCircle,
    };
  };

  const period = getPaymentPeriod();
  const PeriodIcon = period.icon;

  // Handle payment selection
  const toggleItem = (itemName) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName],
    );
  };

  const selectAllPending = () => {
    const pendingItems = paymentData.paymentItems
      .filter((i) => i.status === "pending")
      .map((i) => i.name);
    setSelectedItems(pendingItems);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit payment
  const handleSubmit = () => {
    if (!selectedMethod || selectedItems.length === 0 || !paymentProof) {
      alert("Please complete all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      setShowReceipt(true);
      setSelectedItems([]);
      setSelectedMethod(null);
      setPaymentProof(null);
      setProofPreview(null);
      setStep(1);
      setShowQrCode(false);

      // Auto-hide receipt after 5 seconds
      setTimeout(() => setShowReceipt(false), 5000);
    }, 1500);
  };

  // Reset modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItems([]);
    setSelectedMethod(null);
    setPaymentProof(null);
    setProofPreview(null);
    setStep(1);
    setShowQrCode(false);
  };

  const selectedAmount = paymentData.paymentItems
    .filter((item) => selectedItems.includes(item.name))
    .reduce((sum, item) => sum + item.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "pending":
        return Clock;
      case "upcoming":
        return Calendar;
      default:
        return Circle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>Payments</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-700 font-medium">Payment Status</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Status</h1>
        <p className="text-gray-600 mt-1">
          View and manage your payment schedules
        </p>
      </div>

      {/* Success Receipt Toast */}
      {showReceipt && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-slideDown">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-800">
                Payment Submitted Successfully!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your payment of ₱{selectedAmount.toLocaleString()} has been
                submitted for validation. You will receive a confirmation email
                once validated.
              </p>
              <p className="text-xs text-green-600 mt-2">
                Reference: PAY-{Date.now().toString().slice(-8)}
              </p>
            </div>
            <button onClick={() => setShowReceipt(false)}>
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Student Profile Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {paymentData.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {paymentData.studentName}
              </h2>
              <p className="text-gray-600">
                {paymentData.studentId} • {paymentData.course}
              </p>
              <p className="text-sm text-gray-500">
                {paymentData.yearLevel} • {paymentData.semester}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Payment Terms</p>
              <p className="font-semibold text-blue-700">
                {paymentData.paymentTerms}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards with Icons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold">
                ₱{totals.total.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ₱{totals.paid.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ₱{totals.pending.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-purple-600">
                ₱{totals.upcoming.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Period & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Period Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Payment Period
            </h3>

            <div
              className={`p-4 rounded-lg bg-${period.color}-50 border border-${period.color}-200`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full bg-${period.color}-100 flex items-center justify-center`}
                >
                  <PeriodIcon className={`w-5 h-5 text-${period.color}-600`} />
                </div>
                <div>
                  <p className={`font-medium text-${period.color}-800`}>
                    {period.message}
                  </p>
                  <p className={`text-sm text-${period.color}-600`}>
                    {period.description}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 border-t pt-3">
                <p>
                  Start:{" "}
                  {new Date(paymentData.paymentStart).toLocaleDateString()}
                </p>
                <p>
                  End: {new Date(paymentData.paymentEnd).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              {period.status === "open" && totals.pending > 0 && (
                <PrimaryButton
                  onClick={() => setShowModal(true)}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </PrimaryButton>
              )}
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Statement
              </button>
            </div>
          </Card>

          {/* Payment Info Card */}
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-600" />
              Payment Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Payments are only accepted during the open period</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Upload clear screenshot of payment confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Allow 1-2 business days for payment validation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Check your email for validation updates</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Column - Payment Items */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-gray-600" />
                Payment Schedule
              </h3>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {paymentData.paymentItems.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <div
                    key={item.name}
                    className={`p-4 rounded-lg border ${getStatusColor(item.status)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm opacity-75">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          ₱{item.amount.toLocaleString()}
                        </span>
                        <StatusBadge
                          status={item.status}
                          className={getStatusColor(item.status)
                            .split(" ")
                            .slice(0, 2)
                            .join(" ")}
                        />
                      </div>
                    </div>

                    {item.status === "paid" && (
                      <div className="mt-3 pt-3 border-t border-green-200 text-sm text-green-700">
                        <div className="flex items-center justify-between">
                          <span>
                            Paid on:{" "}
                            {new Date(item.paidDate).toLocaleDateString()}
                          </span>
                          <span className="font-mono">
                            Ref: {item.reference}
                          </span>
                          <button className="text-green-700 hover:text-green-800 font-medium">
                            View Receipt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Payment Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((totals.paid / totals.total) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(totals.paid / totals.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Make Payment"
        size="lg"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Items */}
        {step === 1 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Items to Pay
              </label>
              <button
                onClick={selectAllPending}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Select All Pending
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
              {paymentData.paymentItems
                .filter((i) => i.status === "pending")
                .map((item) => (
                  <label
                    key={item.name}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItems.includes(item.name)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.name)}
                        onChange={() => toggleItem(item.name)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₱{item.amount.toLocaleString()}
                    </span>
                  </label>
                ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₱{selectedAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Method */}
        {step === 2 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setShowQrCode(false); // Reset QR code visibility when changing method
                  }}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedMethod === method.id
                      ? `border-${method.color}-500 bg-${method.color}-50 ring-2 ring-${method.color}-200`
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <method.icon
                    className={`w-8 h-8 mb-2 ${
                      selectedMethod === method.id
                        ? `text-${method.color}-600`
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      selectedMethod === method.id
                        ? `text-${method.color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {method.number || method.bank}
                  </p>
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="mt-4 space-y-4">
                {/* Payment Details */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Payment Details
                  </h4>
                  {selectedMethod === "bank_transfer" ? (
                    <>
                      <p className="text-sm">
                        <span className="text-gray-600">Bank:</span> PNB
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Account:</span>{" "}
                        1234-5678-9012-3456
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Name:</span> School
                        Name, Inc.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">
                        <span className="text-gray-600">Number:</span>{" "}
                        {selectedMethod === "gcash"
                          ? "0917 123 4567"
                          : "0918 765 4321"}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Name:</span> School Name
                        Official
                      </p>
                    </>
                  )}
                </div>

                {/* QR Code Section for GCash and Maya */}
                {selectedMethod !== "bank_transfer" && (
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">QR Code</h4>
                      <button
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        {showQrCode ? "Hide" : "Show"} QR Code
                      </button>
                    </div>

                    {showQrCode && (
                      <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 p-4">
                          <div className="text-center">
                            {/* Simulated QR Code Pattern */}
                            <div className="w-32 h-32 mx-auto bg-white p-2 shadow-inner rounded">
                              <div className="grid grid-cols-7 gap-0.5">
                                {[...Array(49)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                                  ></div>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              Scan with{" "}
                              {selectedMethod === "gcash" ? "GCash" : "Maya"}{" "}
                              app
                            </p>
                          </div>
                        </div>
                        <button className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto">
                          <Download className="w-3 h-3 mr-1" />
                          Download QR Code
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Upload Proof */}
        {step === 3 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Proof of Payment
            </label>
            {!paymentProof ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="proof"
                />
                <label htmlFor="proof" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <span className="text-lg font-medium text-blue-600 block mb-1">
                    Click to upload
                  </span>
                  <span className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={proofPreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {paymentProof.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(paymentProof.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentProof(null);
                      setProofPreview(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Make sure the screenshot clearly shows the reference number and
                amount.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer with Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <PrimaryButton
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && selectedItems.length === 0) ||
                (step === 2 && !selectedMethod)
              }
              className="flex-1"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleSubmit}
              loading={loading}
              disabled={!paymentProof}
              className="flex-1"
            >
              Submit Payment
            </PrimaryButton>
          )}
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Help Card */}
      <Card className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm text-gray-700 flex-1">
            Need help with payments? Contact the Finance Office at
            <span className="font-medium text-blue-600">
              {" "}
              finance@school.edu
            </span>{" "}
            or call{" "}
            <span className="font-medium text-blue-600">(123) 456-7891</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default StudentPaymentStatus;
