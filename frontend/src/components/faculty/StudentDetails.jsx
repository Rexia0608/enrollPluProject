// components/faculty/StudentDetails.jsx
import React, { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Book,
  Clock,
  FileText,
  CreditCard,
  Download,
  Eye,
} from "lucide-react";
import Card from "../ui/Card";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";

function StudentDetails() {
  const [selectedStudent, setSelectedStudent] = useState(1);

  const students = [
    {
      id: 1,
      name: "John Doe",
      studentId: "S2024001",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      program: "Computer Science",
      semester: "Fall 2024",
      status: "documents_pending",
      enrollmentDate: "2024-01-15",
      address: "123 Main St, Anytown, USA",
      documents: [
        { name: "Admission Form", status: "approved", date: "2024-01-15" },
        {
          name: "Birth Certificate",
          status: "rejected",
          date: "2024-01-15",
          feedback: "Document is blurry",
        },
        { name: "Transcript", status: "pending", date: "2024-01-14" },
      ],
      payments: [
        {
          description: "Tuition Fee",
          amount: "$1,500",
          status: "pending",
          date: "2024-01-16",
        },
      ],
      timeline: [
        {
          date: "2024-01-15",
          event: "Application Submitted",
          description: "Initial application completed",
        },
        {
          date: "2024-01-15",
          event: "Documents Uploaded",
          description: "Submitted required documents",
        },
        {
          date: "2024-01-16",
          event: "Payment Submitted",
          description: "Uploaded payment proof",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "S2024002",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      program: "Business Administration",
      semester: "Fall 2024",
      status: "payment_validated",
      enrollmentDate: "2024-01-14",
      address: "456 Oak Ave, Somewhere, USA",
      documents: [
        { name: "Admission Form", status: "approved", date: "2024-01-14" },
        { name: "Birth Certificate", status: "approved", date: "2024-01-14" },
        { name: "Transcript", status: "approved", date: "2024-01-13" },
      ],
      payments: [
        {
          description: "Tuition Fee",
          amount: "$1,500",
          status: "validated",
          date: "2024-01-15",
        },
      ],
      timeline: [
        {
          date: "2024-01-14",
          event: "Application Submitted",
          description: "Initial application completed",
        },
        {
          date: "2024-01-14",
          event: "Documents Approved",
          description: "All documents approved",
        },
        {
          date: "2024-01-15",
          event: "Payment Validated",
          description: "Payment verified",
        },
      ],
    },
  ];

  const student = students.find((s) => s.id === selectedStudent) || students[0];

  const getStatusLabel = (status) => {
    const labels = {
      not_started: "Not Started",
      documents_pending: "Documents Pending",
      documents_approved: "Documents Approved",
      payment_pending: "Payment Pending",
      payment_validated: "Payment Validated",
      enrolled: "Enrolled",
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
        <p className="text-gray-600">
          View and manage student information and progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student List Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Students
            </h3>
            <div className="space-y-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedStudent === s.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.studentId}</p>
                    </div>
                    <StatusBadge
                      status={s.status.split("_").join(" ")}
                      size="sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Student Details Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Student Header */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600">{student.studentId}</span>
                    <StatusBadge status={student.status.split("_").join(" ")} />
                  </div>
                </div>
              </div>
              <SecondaryButton icon={Download}>Export Details</SecondaryButton>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Book className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{student.program}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Enrollment Date</p>
                  <p className="font-medium">{student.enrollmentDate}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{student.address}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents and Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Documents */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Documents
                </h3>
                <span className="text-sm text-gray-600">
                  {
                    student.documents.filter((d) => d.status === "approved")
                      .length
                  }
                  /{student.documents.length} approved
                </span>
              </div>
              <div className="space-y-3">
                {student.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={doc.status} size="sm" />
                      <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payments */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payments
                </h3>
                <span className="text-sm text-gray-600">
                  {
                    student.payments.filter((p) => p.status === "validated")
                      .length
                  }
                  /{student.payments.length} validated
                </span>
              </div>
              <div className="space-y-3">
                {student.payments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.description}
                        </p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{payment.amount}</span>
                      <StatusBadge status={payment.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enrollment Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {student.timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-6 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-4 border-white"></div>
                    <div className="ml-12">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {item.event}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
