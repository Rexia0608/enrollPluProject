import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";
import axios from "axios";

// Helper: format ISO date to relative time
const getRelativeTime = (isoDate) => {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

// Map API payment_status to component status
const mapStatus = (apiStatus) => {
  switch (apiStatus) {
    case "review":
      return "pending";
    case "approved":
      return "validated";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

// Build proof image URL
const getProofUrl = (filename) => {
  if (!filename) return null;
  const clean = filename.replace(/^\/+/, "");
  return `http://localhost:3000/faculty/review-proof-of-payment/${clean}`;
};

function PaymentValidation() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [periodFilter, setPeriodFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [imageBlobUrl, setImageBlobUrl] = useState(null);

  const fetchPaymentQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3000/faculty/queue-proof-of-payment-review",
      );
      const { success, items, message, error: apiError } = response.data;
      if (success && Array.isArray(items)) {
        const transformed = items.map((item) => {
          const proofFilename = item.proof_filename || `${item.enrollment_id}`;
          return {
            id: item.id,
            enrollmentId: item.enrollment_id,
            period: item.period,
            amount: parseFloat(item.paid_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }),
            amountRaw: parseFloat(item.paid_amount),
            reference: item.id,
            submitted: getRelativeTime(item.updated_at),
            status: mapStatus(item.payment_status),
            method: item.payment_type || "Bank Transfer",
            tracking_number: item.tracking_number,
            proofFilename: proofFilename,
            proofUrl: getProofUrl(proofFilename),
            priority: "medium",
            feedback: item.remarks?.note || "",
            createdAt: item.updated_at,
            raw: item,
          };
        });
        setPayments(transformed);
      } else {
        throw new Error(
          message || apiError?.message || "Failed to fetch payment queue",
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Network error");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentQueue();

    const intervalId = setInterval(
      () => {
        fetchPaymentQueue();
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (imageBlobUrl) {
      URL.revokeObjectURL(imageBlobUrl);
      setImageBlobUrl(null);
    }

    if (!selectedPayment?.proofUrl) return;
    if (selectedPayment.raw?.remarks?.promiseStatus) return; // Skip for promise notes

    const fetchImage = async () => {
      try {
        const response = await axios.get(selectedPayment.proofUrl, {
          responseType: "blob",
        });
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setImageBlobUrl(url);
      } catch (error) {
        console.error("Failed to fetch proof image:", error);
        setImageBlobUrl(null);
      }
    };

    fetchImage();
  }, [selectedPayment]);

  useEffect(() => {
    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
  }, [imageBlobUrl]);

  const handleValidate = async (
    enrollmentId,
    status,
    period,
    amount,
    reference,
  ) => {
    setSelectedPayment(null);
    setImageBlobUrl(null);

    if (status === false && !feedback.trim()) {
      toast.error("Please provide feedback when rejecting.");
      return;
    }

    const fileData = {
      enrollmentId,
      period,
      action: status,
      reference,
      paidAmount: amount,
      remark: feedback.trim(),
    };

    try {
      const response = await axios.patch(
        "http://localhost:3000/faculty/verified-payment",
        fileData,
      );
      toast.success(response.data.message);
      setFeedback("");
      await fetchPaymentQueue();
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update payment status.";
      toast.error(errorMsg);
    }
  };

  // TODO: Replace with actual excuse letter approval endpoint
  const handleExcuseLetter = async (approved) => {
    if (!approved && !feedback.trim()) {
      toast.error("Please provide feedback when rejecting the excuse letter.");
      return;
    }

    const fileData = {
      enrollmentId: selectedPayment.enrollmentId,
      period: selectedPayment.period,
      reference: selectedPayment.id,
      action: approved,
      remark: feedback.trim(),
    };

    try {
      // Replace with correct endpoint
      const response = await axios.patch(
        "http://localhost:3000/faculty/handle-excuse-letter",
        fileData,
      );
      toast.success(response.data.message);
      setFeedback("");
      setSelectedPayment(null);
      await fetchPaymentQueue();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to process excuse letter.",
      );
    }
  };

  const getPaymentMod = (paymentMethod) => {
    switch (paymentMethod) {
      case "maya":
        return `Maya Reference ID`;
      case "gcash":
        return `GCash Reference Number`;
      case "bank-transfer":
        return "Confirmation or Transaction number";
      default:
        return "Transaction or Reference ID";
    }
  };

  const downloadProof = async (filename) => {
    const url = getProofUrl(filename);
    if (!url) {
      alert("Proof file not available.");
      return;
    }
    try {
      const response = await axios.get(url, { responseType: "blob" });

      let mimeType = "image/jpeg";
      if (filename) {
        const ext = filename.split(".").pop().toLowerCase();
        if (ext === "png") mimeType = "image/png";
        else if (ext === "gif") mimeType = "image/gif";
        else if (ext === "webp") mimeType = "image/webp";
        else if (ext === "bmp") mimeType = "image/bmp";
      }

      const blob = new Blob([response.data], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      let finalFilename = filename || "proof.jpg";
      if (!finalFilename.includes(".")) finalFilename += ".jpg";
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download proof. Please try again.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments.filter((p) =>
      periodFilter === "all" ? true : p.period === periodFilter,
    );

    filtered = filtered.filter((p) =>
      searchTerm
        ? p.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.reference
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true,
    );

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "enrollmentId":
          aVal = a.enrollmentId;
          bVal = b.enrollmentId;
          break;
        case "period":
          aVal = a.period;
          bVal = b.period;
          break;
        case "amount":
          aVal = a.amountRaw;
          bVal = b.amountRaw;
          break;
        case "reference":
          aVal = a.reference;
          bVal = b.reference;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "submitted":
        case "createdAt":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [payments, periodFilter, searchTerm, sortField, sortDirection]);

  const getStatusColor = (status) => {
    switch (status) {
      case "validated":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment queue...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Unable to load payments
        </h3>
        <p className="text-red-600">{error}</p>
        <PrimaryButton onClick={fetchPaymentQueue} className="mt-4">
          Try Again
        </PrimaryButton>
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Validation</h1>
        <p className="text-gray-600">
          Validate student payments and provide feedback
        </p>
      </div>

      {selectedPayment ? (
        <div>
          <button
            onClick={() => {
              setSelectedPayment(null);
              setFeedback("");
              if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
              setImageBlobUrl(null);
            }}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            ← Back to Payment List
          </button>
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h3>
              <p className="text-gray-600">Review and validate payment proof</p>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Enrollment number: {selectedPayment.enrollmentId}
                  </p>
                </div>
                <StatusBadge status={selectedPayment.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <h4 className="font-medium text-gray-900 mb-4">
                  Payment Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium">
                      ₱ {selectedPayment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Number</span>
                    <span className="font-medium">
                      {selectedPayment.reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">
                      {selectedPayment.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {getPaymentMod(selectedPayment.method)}
                    </span>
                    <span className="font-medium">
                      {selectedPayment.tracking_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Period</span>
                    <span className="font-medium">
                      {selectedPayment.period}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted</span>
                    <span className="font-medium">
                      {selectedPayment.submitted}
                    </span>
                  </div>
                  {selectedPayment.raw?.remarks?.promiseStatus && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Promise Date</span>
                        <span className="font-medium">
                          {new Date(
                            selectedPayment.raw.remarks.date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Conditional Proof of Payment / Promise Note Section */}
              {selectedPayment.raw?.remarks?.promiseStatus ? (
                <Card>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Promissory Note
                  </h4>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Promise Date:</span>{" "}
                      {new Date(
                        selectedPayment.raw.remarks.date,
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Letter:</span>{" "}
                      {selectedPayment.raw.remarks.note ||
                        "No additional note provided."}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    This payment is covered by a promise note. No proof of
                    payment image is required.
                  </p>
                </Card>
              ) : (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Proof of Payment
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (imageBlobUrl) window.open(imageBlobUrl, "_blank");
                          else alert("Image not loaded yet.");
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View full image"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          downloadProof(selectedPayment.proofFilename)
                        }
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {imageBlobUrl ? (
                      <img
                        src={imageBlobUrl}
                        alt="Proof of payment"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-900">
                          Loading proof...
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          If this persists, the file may be missing or
                          inaccessible.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {selectedPayment.status === "pending" && (
              <>
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Feedback (Required for Rejection)
                  </h4>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback for the student. Required if rejecting."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Feedback will be sent to the student. Required when
                    rejecting.
                  </p>
                </div>

                {/* Action Buttons – Different for promise notes vs regular payments */}
                {selectedPayment.raw?.remarks?.promiseStatus ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <PrimaryButton
                      onClick={() => handleExcuseLetter(true)}
                      icon={CheckCircle}
                      className="sm:flex-1"
                    >
                      Approve Excuse Letter
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => handleExcuseLetter(false)}
                      icon={XCircle}
                      className="sm:flex-1 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Reject Excuse Letter
                    </SecondaryButton>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <PrimaryButton
                      onClick={() =>
                        handleValidate(
                          selectedPayment.enrollmentId,
                          true,
                          selectedPayment.period,
                          selectedPayment.amount,
                          selectedPayment.id,
                        )
                      }
                      icon={CheckCircle}
                      className="sm:flex-1"
                    >
                      Validate Payment
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() =>
                        handleValidate(
                          selectedPayment.enrollmentId,
                          false,
                          selectedPayment.period,
                          selectedPayment.amount,
                          selectedPayment.id,
                        )
                      }
                      icon={XCircle}
                      className="sm:flex-1 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Reject Payment
                    </SecondaryButton>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by enrollment ID or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Periods</option>
                    <option value="enrollment">Enrollment</option>
                    <option value="prelim">Prelim</option>
                    <option value="mid-term">Mid-term</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-lg border ${getStatusColor("pending")}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Pending Validation</p>
                      <p className="text-2xl font-bold mt-1">
                        {payments.filter((p) => p.status === "pending").length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 opacity-50" />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${getStatusColor("validated")}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Validated</p>
                      <p className="text-2xl font-bold mt-1">
                        {
                          payments.filter((p) => p.status === "validated")
                            .length
                        }
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 opacity-50" />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${getStatusColor("rejected")}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Total Rejected</p>
                      <p className="text-2xl font-bold mt-1">
                        {payments.filter((p) => p.status === "rejected").length}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Card className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Queue
                    </h3>
                    <span className="text-sm text-gray-600">
                      {filteredAndSortedPayments.length} of {payments.length}{" "}
                      payments
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("enrollmentId")}
                        >
                          ENROLLMENT ID
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("period")}
                        >
                          PERIOD
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("amount")}
                        >
                          AMOUNT
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("reference")}
                        >
                          REFERENCE
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("status")}
                        >
                          STATUS
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("submitted")}
                        >
                          SUBMITTED
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {payment.enrollmentId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 capitalize">
                              {payment.period}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              ₱ {payment.amount}
                            </div>
                            <div className="text-sm text-gray-600">
                              {payment.method}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">
                              {payment.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {payment.submitted}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setFeedback("");
                                }}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                              >
                                Review
                              </button>
                              {payment.status === "rejected" &&
                                payment.feedback && (
                                  <div
                                    className="text-xs text-red-600 cursor-help"
                                    title={payment.feedback}
                                  >
                                    Rejected
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredAndSortedPayments.length === 0 && (
                  <div className="py-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No payments found
                    </h4>
                    <p className="text-gray-600">
                      {searchTerm || periodFilter !== "all"
                        ? "No payments match your current filters."
                        : "The payment queue is empty."}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default PaymentValidation;
