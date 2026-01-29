// components/admin/CourseManagement.jsx
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";

function CourseManagement() {
  const [courses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Programming",
      credits: 3,
      seats: 45,
      enrolled: 42,
      status: "active",
    },
    {
      id: 2,
      code: "MATH201",
      name: "Calculus I",
      credits: 4,
      seats: 50,
      enrolled: 48,
      status: "active",
    },
    {
      id: 3,
      code: "PHYS101",
      name: "Physics Fundamentals",
      credits: 4,
      seats: 40,
      enrolled: 35,
      status: "active",
    },
    {
      id: 4,
      code: "ENG101",
      name: "English Composition",
      credits: 3,
      seats: 60,
      enrolled: 55,
      status: "active",
    },
    {
      id: 5,
      code: "BIO101",
      name: "Biology Basics",
      credits: 4,
      seats: 35,
      enrolled: 30,
      status: "inactive",
    },
  ]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-600">Manage all available courses</p>
        </div>
        <PrimaryButton icon={Plus} className="mt-4 sm:mt-0">
          Add New Course
        </PrimaryButton>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <input
                type="text"
                placeholder="Search courses..."
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
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
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {course.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {course.credits} credits
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(course.enrolled / course.seats) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.enrolled}/{course.seats}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={course.status === "active" ? "active" : "pending"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-yellow-600">
                        {course.status === "active" ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {courses.length} of {courses.length} courses
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CourseManagement;
