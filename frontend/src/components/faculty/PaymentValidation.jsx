// components/faculty/PaymentValidation.jsx
import React, { useState } from "react";
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

function PaymentValidation() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      studentName: "Jane Smith",
      studentId: "S2024002",
      amount: "$1,500",
      reference: "PAY-2024-00123",
      submitted: "4 hours ago",
      status: "pending",
      method: "Bank Transfer",
      proof: "bank_receipt.pdf",
      priority: "medium",
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentId: "S2024006",
      amount: "$1,200",
      reference: "PAY-2024-00124",
      submitted: "6 hours ago",
      status: "pending",
      method: "Credit Card",
      proof: "payment_screenshot.png",
      priority: "high",
    },
    {
      id: 3,
      studentName: "Emma Wilson",
      studentId: "S2024007",
      amount: "$1,500",
      reference: "PAY-2024-00125",
      submitted: "1 day ago",
      status: "validated",
      method: "Bank Transfer",
      proof: "receipt.pdf",
      priority: "low",
    },
    {
      id: 4,
      studentName: "David Brown",
      studentId: "S2024008",
      amount: "$1,500",
      reference: "PAY-2024-00126",
      submitted: "2 days ago",
      status: "rejected",
      method: "Online Payment",
      proof: "payment_confirmation.pdf",
      reason: "Incorrect amount",
      priority: "medium",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState("");

  const handleValidate = (id, status) => {
    if (status === "rejected" && !feedback.trim()) {
      alert("Please provide feedback for rejection");
      return;
    }

    setPayments(
      payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status,
              feedback: status === "rejected" ? feedback : "",
            }
          : payment,
      ),
    );
    setSelectedPayment(null);
    setFeedback("");
  };

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p) =>
          filter === "pending" ? p.status === "pending" : p.status === filter,
        );

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
            onClick={() => setSelectedPayment(null)}
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

            {/* Student Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedPayment.studentName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Student ID: {selectedPayment.studentId}
                  </p>
                </div>
                <StatusBadge status={selectedPayment.status} />
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <h4 className="font-medium text-gray-900 mb-4">
                  Payment Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      {selectedPayment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference Number</span>
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
                    <span className="text-gray-600">Submitted</span>
                    <span className="font-medium">
                      {selectedPayment.submitted}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Proof of Payment */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Proof of Payment
                  </h4>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">
                    {selectedPayment.proof}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Click buttons above to view or download
                  </p>
                </div>
              </Card>
            </div>

            {/* Feedback Section */}
            {selectedPayment.status === "pending" && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Feedback (Required for Rejection)
                </h4>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback for the student. Required if rejecting payment."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Feedback will be sent to the student. Required when rejecting
                  payment.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedPayment.status === "pending" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryButton
                  onClick={() =>
                    handleValidate(selectedPayment.id, "validated")
                  }
                  icon={CheckCircle}
                  className="sm:flex-1"
                >
                  Validate Payment
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => handleValidate(selectedPayment.id, "rejected")}
                  icon={XCircle}
                  className="sm:flex-1 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reject Payment
                </SecondaryButton>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or reference..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="validated">Validated</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Payments List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
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
                      <p className="text-sm">Validated Today</p>
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

            {/* Payments Table */}
            <div className="lg:col-span-3">
              <Card className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Queue
                    </h3>
                    <span className="text-sm text-gray-600">
                      {filteredPayments.length} of {payments.length} payments
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {payment.studentName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {payment.studentId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {payment.amount}
                            </div>
                            <div className="text-sm text-gray-600">
                              {payment.method}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">
                              {payment.reference}
                            </div>
                            <div className="text-sm text-gray-600">
                              {payment.submitted}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedPayment(payment)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                              >
                                Review
                              </button>
                              {payment.status === "rejected" &&
                                payment.reason && (
                                  <div
                                    className="text-xs text-red-600"
                                    title={payment.reason}
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

                {filteredPayments.length === 0 && (
                  <div className="py-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No payments found
                    </h4>
                    <p className="text-gray-600">
                      No payments match your current filters.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentValidation;
